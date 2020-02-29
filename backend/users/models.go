package users

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/config"
	"github.com/gorilla/mux"
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
