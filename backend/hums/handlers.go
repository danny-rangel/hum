package hums

import (
	"encoding/json"
	"net/http"
)

// Index runs the UserHums function
func Index(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(405), http.StatusMethodNotAllowed)
		return
	}

	hums, err := UserHums(r)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(hums)
}
