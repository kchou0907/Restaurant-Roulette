package main

import (
	"fmt"
	handler "ftb/authentication/handlers"
	"github.com/go-redis/redis/v8"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"log"
	"net/http"
	"os"
)

func main() {
	addr := os.Getenv("ADDR")

	if len(addr) == 0 {
		addr = ":80"
	}

	mux := http.NewServeMux()

	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	sess, err := mgo.Dial("127.0.0.1") //localhost
	// endpoint to do signup
	// endpoint to add to user history
	// endpoint to update rating (thumbs up or thumbs down)

	log.Printf("server is listening at %s...", addr)
	log.Fatal(http.ListenAndServe(addr, mux))

}
