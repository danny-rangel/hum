package config

import (
	"errors"
	"log"
	"os"

	"github.com/go-redis/redis"
	"github.com/joho/godotenv"
)

// Cache contains the redis client as a package level variable
var Cache *redis.Client

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	host, ok := os.LookupEnv("REDISHOST")
	pass, ok := os.LookupEnv("REDISPASSWORD")

	if !ok {
		panic(errors.New("Error connecting to Redis"))
	}

	// Initialize the redis connection to a redis instance running on your local machine
	client := redis.NewClient(&redis.Options{
		Addr:     host,
		Password: pass, // no password set
		DB:       0,    // use default DB
	})

	// Assign the client to the package level `cache` variable
	Cache = client
}
