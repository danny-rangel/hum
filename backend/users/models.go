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
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	NumPosts int    `json:"numposts"`
	Joined   string `json:"joined"`
}

func GetUserInfo(userID string, username string) (User, error) {
	var rows *sql.Rows
	var err error

	if userID != "" {
		fmt.Println("HI")
		fmt.Println(userID)
		rows, err = config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined FROM users WHERE users.id = $1", userID)
	} else {
		rows, err = config.DB.Query("SELECT users.id, users.username, users.numposts, users.joined FROM users WHERE users.username = $1", username)
	}

	if err != nil {
		return User{}, err
	}

	defer rows.Close()

	var fetchedUser User

	for rows.Next() {
		err := rows.Scan(&fetchedUser.ID, &fetchedUser.Username, &fetchedUser.NumPosts, &fetchedUser.Joined)
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

	_, err = config.DB.Exec("INSERT INTO follow (FOLLOWER_ID,FOLLOWING_ID) VALUES ($1, $2)", userID, followee.ID)

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

	return nil
}
