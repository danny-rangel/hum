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

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	hums, err := FollowerHums(userID)

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

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	_, err = AddHum(userID, r)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteHum(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = Delete(r, userID)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func LikePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = Like(r, userID)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UnlikePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = Unlike(r, userID)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
