package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/danny-rangel/web/hum/backend/router"
	"github.com/gorilla/handlers"
)

func main() {

	r := router.Router()
	fs := http.FileServer(http.Dir("./build"))
	http.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = ":8080"
	} else {
		port = ":" + port
	}

	fmt.Println("Listening on port ", port)
	log.Fatal(http.ListenAndServe(port, handlers.CORS(handlers.AllowCredentials(), handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS", "DELETE"}), handlers.AllowedOrigins([]string{"https://hum-frontend.herokuapp.com"}))(r)))
}
