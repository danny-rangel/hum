package middleware

import (
	"net/http"

	"github.com/danny-rangel/web/hum/backend/config"
)

func Auth(w http.ResponseWriter, r *http.Request) (string, error) {
	// We can obtain the session token from the requests cookies, which come with every request
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return "", err
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return "", err
	}

	// Get the value inside of the cookie
	sessionToken := c.Value

	// We then get the name of the user from our cache, where we set the session token
	userID, err := config.Cache.Get(sessionToken).Result()

	if err != nil {
		// If there is an error fetching from cache, return an internal server error status
		w.WriteHeader(http.StatusInternalServerError)
		return "", err
	}

	return userID, nil
}
