package hums

import (
	"net/http"
	"time"

	"github.com/danny-rangel/web/hum/backend/config"
	"github.com/gorilla/mux"
)

// Hum type defines a Hum Struct
type Hum struct {
	ID       string `json:"id"`
	Content  string `json:"content"`
	Likes    int    `json:"likes"`
	Posted   string `json:"posted"`
	UserID   string `json:"user_id"`
	Username string `json:"username"`
}

// UserHums fetches all hums for specific user
func UserHums(r *http.Request) ([]Hum, error) {
	vars := mux.Vars(r)
	username := vars["username"]

	rows, err := config.DB.Query("SELECT hums.id, hums.content, hums.likes, hums.posted, users.ID, users.username FROM users INNER JOIN hums on users.id = hums.user_id WHERE users.username=$1", username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	hums := make([]Hum, 0)
	for rows.Next() {
		hum := Hum{}
		err := rows.Scan(&hum.ID, &hum.Content, &hum.Likes, &hum.Posted, &hum.UserID, &hum.Username)
		if err != nil {
			return nil, err
		}
		hums = append(hums, hum)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return hums, nil
}

// FollowerHums fetches all hums for currently followed users
func FollowerHums(userID string) ([]Hum, error) {
	rows, err := config.DB.Query("SELECT hums.id, hums.content, hums.likes, hums.posted, hums.user_id, hums.username FROM users INNER JOIN follow on users.id = follow.follower_id INNER JOIN hums on hums.user_id = follow.following_id WHERE users.id = $1", userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	hums := make([]Hum, 0)
	for rows.Next() {
		hum := Hum{}
		err := rows.Scan(&hum.ID, &hum.Content, &hum.Likes, &hum.Posted, &hum.UserID, &hum.Username) // order matters
		if err != nil {
			return nil, err
		}
		hums = append(hums, hum)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return hums, nil
}

func AddHum(userID string, r *http.Request) (Hum, error) {
	content := r.FormValue("content")

	rows, err := config.DB.Query("SELECT users.username FROM users WHERE users.id = $1", userID)

	if err != nil {
		return Hum{}, err
	}

	defer rows.Close()

	var username string

	for rows.Next() {
		err := rows.Scan(&username)
		if err != nil {
			return Hum{}, err
		}
		break
	}

	_, err = config.DB.Exec("INSERT INTO hums (content, posted, username, user_id) VALUES ($1, $2, $3, $4)", content, time.Now(), username, userID)

	if err != nil {
		return Hum{}, err
	}

	return Hum{}, nil
}

func Delete(r *http.Request, userID string) error {
	vars := mux.Vars(r)
	humID := vars["humID"]

	_, err := config.DB.Exec("DELETE FROM hums WHERE hums.id = $1 AND hums.user_id = $2", humID, userID)

	if err != nil {
		panic(err)
	}

	return nil
}

func Like(r *http.Request, userID string) error {
	humID := r.FormValue("humID")

	_, err := config.DB.Exec("INSERT INTO likes (USER_ID,HUM_ID) VALUES ($1, $2)", userID, humID)
	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE hums SET likes = likes + 1 WHERE hums.id = $1", humID)
	if err != nil {
		return err
	}

	return nil
}

func Unlike(r *http.Request, userID string) error {
	humID := r.FormValue("humID")

	_, err := config.DB.Exec("DELETE FROM likes WHERE user_id = $1 AND hum_id = $2", userID, humID)

	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE hums SET likes = likes - 1 WHERE hums.id = $1", humID)
	if err != nil {
		return err
	}

	return nil
}
