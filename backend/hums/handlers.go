package hums

import (
	"encoding/json"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/middleware"
)

// GetUserHums runs the UserHums function
func GetUserHums(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	hums, err := UserHums(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(hums)
}

// GetFollowerHums runs the UserHums function
func GetFollowerHums(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	username, err := middleware.Auth(w, r)

	if err != nil || username == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	hums, err := FollowerHums(username)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(hums)
}

func NewHum(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	username, err := middleware.Auth(w, r)

	if err != nil || username == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	_, err = AddHum(username, r)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
