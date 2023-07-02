package handler

import (
	"net/http"

	"github.com/go-redis/redis/v8"
	"gopkg.in/mgo.v2"
)

type HandlerContext struct {
	SecretKey string
	Redis     *redis.Client
	Mongo     *mgo.Session
}

func NewHandlerContext(secretkey string, redis *redis.Client, mongo *mgo.Session) *HandlerContext {
	if redis == nil {
		panic("nil redis client!")
	}
	if mongo == nil {
		panic("nil mongo client!")
	}

	return &HandlerContext{SecretKey: secretkey, Redis: redis, Mongo: mongo}
}

func (ctx *HandlerContext) signUp(w http.ResponseWriter, r *http.Request) {
	if r.Method == "Post" {

	} else {
		http.Error(w, "Error: Method not allowed", http.StatusMethodNotAllowed)
	}
}
