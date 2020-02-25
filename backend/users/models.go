package users

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

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
	Joined    string `json:"joined"`
	Followers int    `json:"followers"`
	Following int    `json:"following"`
}

func GetUserInfo(userID string, username string) (User, error) {
	var rows *sql.Rows
	var err error

	if userID != "" {
		fmt.Println("HI")
		fmt.Println(userID)
		rows, err = config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined, users.followers FROM users WHERE users.id = $1", userID)
	} else {
		rows, err = config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined, users.followers FROM users WHERE users.username = $1", username)
	}

	if err != nil {
		return User{}, err
	}

	defer rows.Close()

	var fetchedUser User

	for rows.Next() {
		err := rows.Scan(&fetchedUser.ID, &fetchedUser.Username, &fetchedUser.NumPosts, &fetchedUser.Joined, &fetchedUser.Followers)
		if err != nil {
			return User{}, err
		}
		break
	}

	return fetchedUser, nil
}

func RegisterUser(r *http.Request) (Credentials, error) {
	creds := Credentials{}
	creds.Username = r.FormValue("username")
	creds.Password = r.FormValue("password")

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

	_, err = config.DB.Exec("INSERT INTO users (username, password, joined) VALUES ($1, $2, $3)", creds.Username, string(hash), time.Now())
	if err != nil {
		return creds, errors.New("500. Internal Server Error." + err.Error())
	}

	return creds, nil
}

func LoginUser(r *http.Request) (Credentials, error) {
	creds := Credentials{}
	creds.Username = r.FormValue("username")
	creds.Password = r.FormValue("password")

	if creds.Username == "" || creds.Password == "" {
		return creds, errors.New("400. Bad Request. Fields can't be empty")
	}

	rows, err := config.DB.Query("SELECT users.id, users.username, users.password FROM users WHERE users.username = $1", creds.Username)

	if err != nil {
		return creds, err
	}
	defer rows.Close()

	check := Credentials{}

	for rows.Next() {
		err = rows.Scan(&check.ID, &check.Username, &check.Password)
		break
	}

	if err != nil {
		return Credentials{}, err
	}

	check.Username = creds.Username

	if err = bcrypt.CompareHashAndPassword([]byte(check.Password), []byte(creds.Password)); err != nil {
		// If the two passwords don't match, return a 401 status
		return creds, errors.New("Unauthorized")
	}

	return check, nil
}

func Follow(r *http.Request, userID string) error {
	vars := mux.Vars(r)
	followeeUsername := vars["username"]

	followee, err := GetUserInfo("", followeeUsername)

	if userID == followee.ID {
		return errors.New("400. Bad Request. Can't follow yourself")
	}

	_, err = config.DB.Exec("INSERT INTO follow (FOLLOWER_ID,FOLLOWING_ID) VALUES ($1, $2)", userID, followee.ID)
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

	_, err = config.DB.Exec("DELETE FROM follow WHERE follower_id = $1 AND following_id = $2", userID, followee.ID)

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

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined, users.followers, users.following FROM users INNER JOIN follow on follower_id = users.id AND following_id = $1", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.Joined, &user.Followers, &user.Following)
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

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined, users.followers, users.following FROM users INNER JOIN follow on follower_id = $1 AND following_id = users.id", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.Joined, &user.Followers, &user.Following)
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

	rows, err := config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined, users.followers, users.following FROM users INNER JOIN likes on user_id = users.id AND hum_id = $1", humID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := make([]User, 0)
	for rows.Next() {
		user := User{}
		err := rows.Scan(&user.ID, &user.Username, &user.NumPosts, &user.Joined, &user.Followers, &user.Following)
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
