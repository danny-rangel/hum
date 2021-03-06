package hums

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/config"
	"github.com/danny-rangel/web/hum/backend/users"
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

func FetchHum(r *http.Request) (Hum, error) {
	vars := mux.Vars(r)
	humID := vars["humID"]

	rows, err := config.DB.Query("SELECT hums.id, hums.content, hums.likes, hums.posted, hums.user_id, hums.username FROM hums WHERE hums.id=$1", humID)
	if err != nil {
		return Hum{}, err
	}

	defer rows.Close()

	var hum Hum

	for rows.Next() {
		err := rows.Scan(&hum.ID, &hum.Content, &hum.Likes, &hum.Posted, &hum.UserID, &hum.Username)
		if err != nil {
			return Hum{}, err
		}
	}
	if err = rows.Err(); err != nil {
		return Hum{}, err
	}
	return hum, nil
}

// UserHums fetches all hums for specific user
func UserHums(r *http.Request) ([]Hum, error) {
	vars := mux.Vars(r)
	username := vars["username"]

	rows, err := config.DB.Query("SELECT hums.id, hums.content, hums.likes, hums.posted, users.ID, users.username FROM users INNER JOIN hums on users.id = hums.user_id WHERE users.username=$1 ORDER BY Posted DESC", username)
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
	rows, err := config.DB.Query("SELECT hums.id, hums.content, hums.likes, hums.posted, hums.user_id, hums.username FROM users INNER JOIN follow on users.id = follow.from_id INNER JOIN hums on follow.to_id = hums.user_id WHERE users.id = $1 UNION SELECT hums.id, hums.content, hums.likes, hums.posted, hums.user_id, hums.username from hums WHERE hums.user_id = $1 ORDER BY Posted DESC;", userID)

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

func AddHum(userID string, r *http.Request) (Hum, error) {
	d := json.NewDecoder(r.Body)
	h := Hum{}
	err := d.Decode(&h)

	if err != nil {
		panic(err)
	}

	if len(h.Content) > 50 {
		return Hum{}, errors.New("400. Bad Request. Too many characters")
	}

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

	_, err = config.DB.Exec("INSERT INTO hums (content, username, user_id) VALUES ($1, $2, $3)", h.Content, username, userID)

	if err != nil {
		return Hum{}, err
	}

	_, err = config.DB.Exec("UPDATE users SET numposts = numposts + 1 WHERE users.id = $1", userID)

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

	_, err = config.DB.Exec("UPDATE users SET numposts = numposts - 1 WHERE users.id = $1", userID)

	if err != nil {
		return err
	}

	return nil
}

func Like(r *http.Request, userID string) error {
	d := json.NewDecoder(r.Body)
	h := Hum{}
	err := d.Decode(&h)

	if err != nil {
		panic(err)
	}

	rows, err := config.DB.Query("SELECT user_id FROM hums WHERE hums.id=$1", h.ID)
	if err != nil {
		log.Fatal(err)
	}

	var humUserID string

	for rows.Next() {

		if err := rows.Scan(&humUserID); err != nil {
			log.Fatal(err)
		}

		if err != nil {
			return errors.New("400. Bad Request. Hum not found")
		}
	}

	rows, err = config.DB.Query("SELECT EXISTS(SELECT 1 FROM likes WHERE likes.from_id=$1 AND likes.hum_id=$2)", userID, h.ID)
	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var exists bool
		if err := rows.Scan(&exists); err != nil {
			log.Fatal(err)
		}

		if exists {
			return errors.New("400. Bad Request. Already liked")
		}
	}

	_, err = config.DB.Exec("INSERT INTO likes (FROM_ID, TO_ID, HUM_ID) VALUES ($1, $2, $3)", userID, humUserID, h.ID)
	if err != nil {
		return err
	}

	user, err := users.GetUserInfo(userID, "")

	_, err = config.DB.Exec("INSERT INTO notifications (KIND, FROM_ID, TO_ID, FROM_USERNAME, LINK) VALUES ($1, $2, $3, $4, $5)", "like", userID, humUserID, user.Username, h.ID)
	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE hums SET likes = likes + 1 WHERE hums.id = $1", h.ID)
	if err != nil {
		return err
	}

	return nil
}

func Unlike(r *http.Request, userID string) error {
	d := json.NewDecoder(r.Body)
	h := Hum{}
	err := d.Decode(&h)

	if err != nil {
		panic(err)
	}

	_, err = config.DB.Exec("DELETE FROM likes WHERE from_id = $1 AND hum_id = $2", userID, h.ID)

	if err != nil {
		return err
	}

	_, err = config.DB.Exec("DELETE FROM notifications WHERE from_id = $1 AND link = $2", userID, h.ID)

	if err != nil {
		return err
	}

	_, err = config.DB.Exec("UPDATE hums SET likes = likes - 1 WHERE hums.id = $1", h.ID)
	if err != nil {
		return err
	}

	return nil
}

func isLiked(r *http.Request, userID string) (bool, error) {
	vars := mux.Vars(r)
	humID := vars["humID"]

	rows, err := config.DB.Query("SELECT CASE WHEN EXISTS (SELECT  likes.id FROM likes WHERE likes.from_id=$1 and likes.hum_id=$2) THEN 1 ELSE 0 END", userID, humID)

	if err != nil {
		return false, err
	}
	defer rows.Close()

	var exists int

	for rows.Next() {
		if err := rows.Scan(&exists); err != nil {
			log.Fatal(err)
		}
	}

	if exists == 1 {
		return true, nil
	}

	return false, nil
}

func likeCount(r *http.Request) (int, error) {
	vars := mux.Vars(r)
	humID := vars["humID"]

	rows, err := config.DB.Query("SELECT COUNT(*) FROM likes WHERE likes.hum_id = $1", humID)

	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var numLikes int

	for rows.Next() {
		if err := rows.Scan(&numLikes); err != nil {
			log.Fatal(err)
		}
	}

	return numLikes, nil
}
