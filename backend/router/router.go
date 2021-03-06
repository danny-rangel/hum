package router

import (
	"github.com/danny-rangel/web/hum/backend/hums"
	"github.com/danny-rangel/web/hum/backend/notifications"
	"github.com/danny-rangel/web/hum/backend/users"
	"github.com/gorilla/mux"
)

func Router() *mux.Router {

	r := mux.NewRouter()

	r.HandleFunc("/api/login", users.Login)
	r.HandleFunc("/api/logout", users.Logout)
	r.HandleFunc("/api/signup", users.SignUp)
	r.HandleFunc("/api/user", users.FetchUser)
	r.HandleFunc("/api/user/{username}", users.FetchProfile)
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
	r.HandleFunc("/api/notifications", notifications.GetUserNotifications)
	r.HandleFunc("/api/isfollowing/{id}", users.CheckIsFollowing)
	r.HandleFunc("/api/isliked/{humID}", hums.CheckIsLiked)
	r.HandleFunc("/api/likes/{humID}", hums.GetLikeCount)
	r.HandleFunc("/api/hum/{humID}", hums.GetHum)
	r.HandleFunc("/api/search", users.SearchUser)
	r.HandleFunc("/api/update", users.UpdateUser)

	return r
}
