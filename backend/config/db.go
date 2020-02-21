package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	host, _ := os.LookupEnv("HOST")
	port, _ := os.LookupEnv("PORT")
	intPort, _ := strconv.Atoi(port)
	dbuser, _ := os.LookupEnv("DBUSER")
	password, _ := os.LookupEnv("PASSWORD")
	dbname, _ := os.LookupEnv("DBNAME")

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, intPort, dbuser, password, dbname)

	var err error
	DB, err = sql.Open("postgres", psqlInfo)

	if err != nil {
		panic(err)
	}

	if err = DB.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("You connected to your database.")
}
