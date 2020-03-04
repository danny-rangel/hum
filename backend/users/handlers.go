package users

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/danny-rangel/web/hum/backend/config"
	"github.com/danny-rangel/web/hum/backend/middleware"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func FetchUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	user, _ := CurrentUser(r)

	if user.ID == "" {
		return
	}

	json.NewEncoder(w).Encode(user)
}

func FetchProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	username := vars["username"]

	user, err := GetUserInfo("", username)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	_, err := RegisterUser(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	user, err := LoginUser(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	// Create a new random session token
	sessionToken := uuid.New().String()
	// Set the token in the redis cache, along with the user whom it represents
	err = config.Cache.Set(sessionToken, user.ID, 336*time.Hour).Err()
	if err != nil {
		// If there is an error in setting the cache, return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Set the client cookie for "session_token" as the session token we just generated
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(336 * time.Hour),
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	})

	json.NewEncoder(w).Encode(user)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	// Get the cookie
	c, err := r.Cookie("session_token")

	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Get the value within the cookie
	sessionToken := c.Value

	// Check and make sure the session is in the redis cache
	_, err = config.Cache.Get(sessionToken).Result()

	if err != nil {
		// If the session is not present in the cache, return an unauthorized error
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// We then delete the session from the cache
	res, err := config.Cache.Del(sessionToken).Result()

	// Return an error if we can't delete the key
	if res != 1 {
		panic(err)
	}

	// Send back an expired cookie
	http.SetCookie(w, &http.Cookie{
		Name:   "session_token",
		Value:  "",
		MaxAge: -1,
	})

	w.WriteHeader(http.StatusOK)
}

func FollowUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = Follow(r, userID)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UnfollowUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = Unfollow(r, userID)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetFollowers(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	users, err := Followers(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func GetFollowing(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	users, err := Following(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func GetLikers(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	users, err := Likers(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func CheckIsFollowing(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	isFollowing, err := isFollowing(r, userID)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(isFollowing)
}

func SearchUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	user, err := Search(r, userID)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" && r.Method != "OPTIONS" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	user, err := Update(w, r, userID)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}
