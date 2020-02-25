package main

import (
	"log"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/hums"
	"github.com/danny-rangel/web/hum/backend/users"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/login", users.Login)
	r.HandleFunc("/logout", users.Logout)
	r.HandleFunc("/signup", users.SignUp)
	r.HandleFunc("/api/hums/{username}", hums.GetUserHums)
	r.HandleFunc("/api/hums", hums.GetFollowerHums)
	r.HandleFunc("/api/new/hums", hums.NewHum)
	r.HandleFunc("/api/delete/hums/{humID}", hums.DeleteHum)
	r.HandleFunc("/api/follow/{username}", users.FollowUser)
	r.HandleFunc("/api/unfollow/{username}", users.UnfollowUser)
	r.HandleFunc("/api/followers/{id}", users.GetFollowers)
	r.HandleFunc("/api/following/{id}", users.GetFollowing)
	r.HandleFunc("/api/like", hums.LikePost)
	r.HandleFunc("/api/unlike", hums.UnlikePost)
	r.HandleFunc("/api/likers/{humID}", users.GetLikers)

	log.Fatal(http.ListenAndServe(":8080", r))
}
