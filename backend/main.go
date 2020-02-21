package main

import (
	"log"
	"net/http"

	"github.com/danny-rangel/web/hum/backend/hums"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/hums", hums.Index)

	log.Fatal(http.ListenAndServe(":8080", r))
}
