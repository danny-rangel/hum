package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/danny-rangel/web/hum/backend/hums"
	"github.com/danny-rangel/web/hum/backend/notifications"
	"github.com/danny-rangel/web/hum/backend/users"

	"github.com/gorilla/mux"
)

func main() {

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

	srv := &http.Server{
		Handler:      r,
		Addr:         ":8080",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	// Configure Logging
	LOG_FILE_LOCATION := os.Getenv("LOG_FILE_LOCATION")
	if LOG_FILE_LOCATION != "" {
		fmt.Println(LOG_FILE_LOCATION)
	}

	// Start Server
	go func() {
		log.Println("Starting Server")
		if err := srv.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()

	// Graceful Shutdown
	waitForShutdown(srv)
}

func waitForShutdown(srv *http.Server) {
	interruptChan := make(chan os.Signal, 1)
	signal.Notify(interruptChan, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	// Block until we receive our signal.
	<-interruptChan

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	srv.Shutdown(ctx)

	log.Println("Shutting down")
	os.Exit(0)
}
