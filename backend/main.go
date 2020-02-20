package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type user struct {
	Name string `json:"name"`
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	user1 := user{Name: "Danny"}
	userjson, err := json.Marshal(user1)

	if err == nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(userjson)
}

func GetPosts(w http.ResponseWriter, r *http.Request) {

}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/user/:id", GetUser)
	r.HandleFunc("/posts/:id", GetPosts)

	log.Fatal(http.ListenAndServe(":8080", r))
}
