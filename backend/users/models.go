package users

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/danny-rangel/web/hum/backend/config"
	"github.com/disintegration/imaging"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	NumPosts  int    `json:"numposts"`
	AVI       string `json:"avi"`
	Followers int    `json:"followers"`
	Following int    `json:"following"`
	Joined    string `json:"joined"`
}

type SearchData struct {
	Username string `json:"username"`
}

func CurrentUser(r *http.Request) (User, error) {
	c, err := r.Cookie("session_token")
	if err != nil {
		return User{}, err
	}

	sessionToken := c.Value

	userID, err := config.Cache.Get(sessionToken).Result()

	if err != nil {
		return User{}, err
	}

	user, err := GetUserInfo(userID, "")

	if err != nil {
		return User{}, err
	}

	return user, nil
}

func GetUserInfo(userID string, username string) (User, error) {
	var rows *sql.Rows
	var err error

	if userID != "" {
		rows, err = config.DB.Query("SELECT users.id, users.username, users.numposts, users.avi, users.followers, users.following, users.joined FROM users WHERE users.id = $1", userID)
	} else {
		rows, err = config.DB.Query("SELECT users.id, users.username, users.numposts, users.avi, users.followers, users.following, users.joined FROM users WHERE users.username = $1", username)
	}

	if err != nil {
		return User{}, err
	}

	defer rows.Close()

	var fetchedUser User

	for rows.Next() {
		err := rows.Scan(&fetchedUser.ID, &fetchedUser.Username, &fetchedUser.NumPosts, &fetchedUser.AVI, &fetchedUser.Followers, &fetchedUser.Following, &fetchedUser.Joined)
		if err != nil {
			return User{}, err
		}
		break
	}

	return fetchedUser, nil
}

func RegisterUser(r *http.Request) (Credentials, error) {
	d := json.NewDecoder(r.Body)
	creds := Credentials{}
	err := d.Decode(&creds)

	if err != nil {
		panic(err)
	}

	if creds.Username == "" || creds.Password == "" {
		return creds, errors.New("400. Bad Request. Fields can't be empty")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)

	rows, err := config.DB.Query("SELECT EXISTS(SELECT 1 FROM users WHERE users.username=$1)", creds.Username)
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var exists bool
		if err := rows.Scan(&exists); err != nil {
			log.Fatal(err)
		}

		if exists {
			return creds, errors.New("400. Bad Request. Username taken")
		}
	}

	_, err = config.DB.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", creds.Username, string(hash))
	if err != nil {
		return creds, errors.New("500. Internal Server Error." + err.Error())
	}

	return creds, nil
}

func LoginUser(r *http.Request) (User, error) {
	d := json.NewDecoder(r.Body)
	creds := Credentials{}
	err := d.Decode(&creds)

	if err != nil {
		panic(err)
	}

	if creds.Username == "" || creds.Password == "" {
		return User{}, errors.New("400. Bad Request. Fields can't be empty")
	}

	rows, err := config.DB.Query("SELECT users.id, users.username, users.password FROM users WHERE users.username = $1", creds.Username)

	if err != nil {
		return User{}, err
	}

	defer rows.Close()

	check := Credentials{}

	for rows.Next() {
		err = rows.Scan(&check.ID, &check.Username, &check.Password)
		break
	}

	if err != nil {
		return User{}, err
	}

	if err = bcrypt.CompareHashAndPassword([]byte(check.Password), []byte(creds.Password)); err != nil {
		return User{}, errors.New("Unauthorized")
	}

	user, err := GetUserInfo(check.ID, "")

	if err != nil {
		return User{}, errors.New("Error fetching user")
	}

	return user, nil
}

func Follow(r *http.Request, userID string) error {
	vars := mux.Vars(r)
	followeeUsername := vars["username"]

	followee, err := GetUserInfo("", followeeUsername)
	follower, err := GetUserInfo(userID, "")

	if userID == followee.ID {
		return errors.New("400. Bad Request. Can't follow yourself")
	}

	rows, err := config.DB.Query("SELECT EXISTS(SELECT 1 FROM follow WHERE follow.from_id=$1 AND follow.to_id=$2)", userID, followee.ID)
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var exists bool
		if err := rows.Scan(&exists); err != nil {
			log.Fatal(err)
		}

		if exists {
			return errors.New("400. Bad Request. Already following")
		}
	}

	_, err = config.DB.Exec("INSERT INTO follow (FROM_ID,TO_ID) VALUES ($1, $2)", userID, followee.ID)
	if err != nil {
		return err
	}

	_, err = config.DB.Exec("INSERT INTO notifications (KIND,FROM_ID,TO_ID,FROM_USERNAME,LINK) VALUES ($1, $2, $3, $4, $5)", "follow", userID, followee.ID, follower.Username, follower.Username)
	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE users SET followers = followers + 1 WHERE users.id = $1", followee.ID)
	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE users SET following = following + 1 WHERE users.id = $1", userID)
	if err != nil {
		return err
	}

	return nil
}

func Unfollow(r *http.Request, userID string) error {
	vars := mux.Vars(r)
	followeeUsername := vars["username"]

	followee, err := GetUserInfo("", followeeUsername)

	_, err = config.DB.Exec("DELETE FROM follow WHERE from_id = $1 AND to_id = $2", userID, followee.ID)

	if err != nil {
		return err
	}

	_, err = config.DB.Exec("DELETE FROM notifications WHERE from_id = $1 AND to_id = $2 AND kind = 'follow'", userID, followee.ID)

	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE users SET followers = followers - 1 WHERE users.id = $1", followee.ID)
	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE users SET following = following - 1 WHERE users.id = $1", userID)
	if err != nil {
		return err
	}

	return nil
}

func Followers(r *http.Request) ([]User, error) {
	vars := mux.Vars(r)
	userID := vars["id"]

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.avi, users.joined, users.followers, users.following FROM users INNER JOIN follow on to_id = $1 AND from_id = users.id", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.AVI, &user.Joined, &user.Followers, &user.Following)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func Following(r *http.Request) ([]User, error) {
	vars := mux.Vars(r)
	userID := vars["id"]

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.avi, users.joined, users.followers, users.following FROM users INNER JOIN follow on from_id = $1 AND to_id = users.id", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.AVI, &user.Joined, &user.Followers, &user.Following)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func Likers(r *http.Request) ([]User, error) {
	vars := mux.Vars(r)
	humID := vars["humID"]

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.avi, users.joined, users.followers, users.following FROM users INNER JOIN likes on from_id = users.id AND likes.hum_id = $1", humID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.AVI, &user.Joined, &user.Followers, &user.Following)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func isFollowing(r *http.Request, userID string) (bool, error) {
	vars := mux.Vars(r)
	checkID := vars["id"]

	rows, err := config.DB.Query("SELECT CASE WHEN EXISTS (SELECT  follow.id FROM follow WHERE follow.from_id=$1 and follow.to_id=$2) THEN 1 ELSE 0 END", userID, checkID)

	if err != nil {
		return false, err
	}
	defer rows.Close()

	var exists int

	for rows.Next() {
		if err := rows.Scan(&exists); err != nil {
			log.Fatal(err)
		}
	}

	if exists == 1 {
		return true, nil
	}

	return false, nil
}

func Search(r *http.Request, userID string) (User, error) {
	d := json.NewDecoder(r.Body)
	sd := SearchData{}
	err := d.Decode(&sd)

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.followers, users.following, users.avi, users.joined FROM users WHERE users.username LIKE $1", sd.Username)

	if err != nil {
		return User{}, err
	}

	defer rows.Close()

	user := User{}

	for rows.Next() {
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.Followers, &user.Following, &user.AVI, &user.Joined)
		if err != nil {
			return User{}, err
		}
	}

	return user, nil
}

func Update(w http.ResponseWriter, r *http.Request, userID string) (User, error) {
	avi, handler, err := r.FormFile("avi")
	username := r.FormValue("username")
	username = username[1 : len(username)-1]

	if avi != nil {
		if err := godotenv.Load(); err != nil {
			log.Print("No .env file found")
		}

		region, ok := os.LookupEnv("AWSREGION")
		akID, ok := os.LookupEnv("ACCESSKEYID")
		secret, ok := os.LookupEnv("SECRETACCESSKEY")
		bucket, ok := os.LookupEnv("AWSBUCKET")

		if !ok {
			panic(errors.New("Error retrieving variables"))
		}

		defer avi.Close()

		mimeType := handler.Header.Get("Content-Type")

		var dimage image.Image

		switch mimeType {
		case "image/jpeg":
			dimage, err = jpeg.Decode(avi)
		case "image/png":
			dimage, err = png.Decode(avi)
		default:
			return User{}, errors.New("The format of the file is not valid")
		}

		cropped := imaging.CropCenter(dimage, 400, 400)

		buf := new(bytes.Buffer)
		err := jpeg.Encode(buf, cropped, nil)
		sendS3 := buf.Bytes()

		var aviURL string

		s, err := session.NewSession(&aws.Config{
			Region: aws.String(region),
			Credentials: credentials.NewStaticCredentials(
				akID,
				secret,
				""),
		})

		if err != nil {
			fmt.Println("Could not create session")
		}

		fileName, err := UploadFileToS3(s, sendS3, handler, bucket, userID)
		if err != nil {
			fmt.Println("Could not upload file")
		}

		aviURL = "https://hum.s3.us-west-1.amazonaws.com/" + fileName

		_, err = config.DB.Exec("UPDATE users SET username = $1, avi = $2 WHERE id = $3", username, aviURL, userID)

		if err != nil {
			return User{}, err
		}

		u, err := GetUserInfo(userID, "")

		if err != nil {
			return User{}, errors.New("Error fetching new user")
		}

		return u, nil
	}

	_, err = config.DB.Exec("UPDATE users SET username = $1 WHERE id = $2", username, userID)

	if err != nil {
		return User{}, err
	}

	u, err := GetUserInfo(userID, "")

	if err != nil {
		return User{}, errors.New("Error fetching new user")
	}

	return u, nil

}

func UploadFileToS3(s *session.Session, img []byte, fileHeader *multipart.FileHeader, bucket string, userID string) (string, error) {
	tempFileName := "pictures/" + userID

	_, err := s3.New(s).PutObject(&s3.PutObjectInput{
		Bucket:               aws.String(bucket),
		Key:                  aws.String(tempFileName),
		ACL:                  aws.String("public-read"),
		Body:                 bytes.NewReader(img),
		ContentType:          aws.String(http.DetectContentType(img)),
		ContentDisposition:   aws.String("attachment"),
		ServerSideEncryption: aws.String("AES256"),
		StorageClass:         aws.String("INTELLIGENT_TIERING"),
	})
	if err != nil {
		return "", err
	}

	return tempFileName, err
}
