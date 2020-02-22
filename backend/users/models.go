package users

import (
	"errors"
	"net/http"
	"time"

	"github.com/danny-rangel/web/hum/backend/config"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
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

func RegisterUser(r *http.Request) (Credentials, error) {
	creds := Credentials{}
	creds.Username = r.FormValue("username")
	creds.Password = r.FormValue("password")

	if creds.Username == "" || creds.Password == "" {
		return creds, errors.New("400. Bad Request. Fields can't be empty")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)

	// TODO: Check and make sure there is no
	// other user with the same username or email

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

	rows, err := config.DB.Query("SELECT users.username, users.password FROM users WHERE users.username = $1", creds.Username)

	if err != nil {
		return creds, err
	}
	defer rows.Close()

	check := Credentials{}

	for rows.Next() {
		err = rows.Scan(&check.Username, &check.Password)
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

	return creds, nil
}
