package hums

import (
	"github.com/danny-rangel/web/hum/backend/config"
)

type Hum struct {
	Username string `json:"username"`
	ID       string `json:"id"`
	Content  string `json:"content"`
	Likes    int    `json:"likes"`
	Posted   string `json:"posted"`
}

func AllHums() ([]Hum, error) {
	rows, err := config.DB.Query("SELECT users.username, hums.id, hums.content, hums.likes, hums.posted FROM users INNER JOIN hums on users.id = hums.user_id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	hums := make([]Hum, 0)
	for rows.Next() {
		hum := Hum{}
		err := rows.Scan(&hum.Username, &hum.ID, &hum.Content, &hum.Likes, &hum.Posted) // order matters
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
