package users

import (
	"errors"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/config"
	_ "github.com/danny-rangel/web/hum/backend/config"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID       string `json:"id"`
	Username string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	NumPosts int    `json:"numposts"`
	Joined   string `json:"joined"`
}

func RegisterUser(r *http.Request) (Credentials, error) {
	creds := Credentials{}
	creds.Username = r.FormValue("username")
	creds.Email = r.FormValue("email")
	creds.Password = r.FormValue("password")

	if creds.Username == "" || creds.Email == "" || creds.Password == "" {
		return creds, errors.New("400. Bad Request. Fields can't be empty")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)

	_, err = config.DB.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", creds.Username, creds.Email, string(hash))
	if err != nil {
		return creds, errors.New("500. Internal Server Error." + err.Error())
	}

	return creds, nil
}

func LoginUser(r *http.Request) (User, error) {
	return User{}, nil
}
