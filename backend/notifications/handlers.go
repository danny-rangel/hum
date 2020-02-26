package notifications

import (
	"encoding/json"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/middleware"
)

// GetUserNotifications runs the UserNotifications function
func GetUserNotifications(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	userID, err := middleware.Auth(w, r)

	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusUnauthorized)
		return
	}

	notis, err := UserNotifications(r, userID)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(notis)
}
