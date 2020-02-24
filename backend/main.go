package main

import (
	"log"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/hums"
	"github.com/danny-rangel/web/hum/backend/users"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/login", users.Login)
	r.HandleFunc("/logout", users.Logout)
	r.HandleFunc("/signup", users.SignUp)
	r.HandleFunc("/api/hums/{username}", hums.Index)

	log.Fatal(http.ListenAndServe(":8080", r))
}
