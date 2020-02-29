package notifications

import (
	"net/http"

	"github.com/danny-rangel/web/hum/backend/config"
)

// Notification type defines a Notification Struct
type Notification struct {
	ID           string `json:"id"`
	Kind         string `json:"kind"`
	FromID       int    `json:"from_id"`
	ToID         int    `json:"to_id"`
	FromUsername string `json:"from_username"`
	Link         string `json:"link"`
	Created      string `json:"created"`
}

// UserNotifications fetches all notifications for specific user
func UserNotifications(r *http.Request, userID string) ([]Notification, error) {
	rows, err := config.DB.Query("SELECT id, kind, from_id, to_id, from_username, link, created FROM notifications WHERE to_id = $1 ORDER BY Created DESC", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	notifications := make([]Notification, 0)
	for rows.Next() {
		notification := Notification{}
		err := rows.Scan(&notification.ID, &notification.Kind, &notification.FromID, &notification.ToID, &notification.FromUsername, &notification.Link, &notification.Created)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return notifications, nil
}
