package sessions

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

const idLength = 32
const InvalidSessionID SessionID = ""

type SessionID string

func CreateSessionID(key string) (SessionID, error) {
	if len(key) < 1 {
		return InvalidSessionID, fmt.Errorf("siging key may not be empty")
	}

	// create session id
	sessionID := make([]byte, idLength)
	_, err := rand.Read(sessionID)

	if err != nil {
		return InvalidSessionID, err
	}

	// create signature

	// creating the 2 keys using the ipad and opad constants + hashing
	h := hmac.New(sha256.New, []byte(key))
	_, writeErr := h.Write(sessionID)

	if writeErr != nil {
		return InvalidSessionID, writeErr
	}

	signature := h.Sum(sessionID)

	// convert bytes => string => url
	finalID := SessionID(base64.URLEncoding.EncodeToString(signature))

	return finalID, nil
}

func ValidateID(id string, key string) (SessionID, error) {
	if len(id) < 1 {
		return InvalidSessionID, fmt.Errorf("no id provided")
	}

	if len(key) < 1 {
		return InvalidSessionID, fmt.Errorf("no secret key provided")
	}

	decodedID, err := base64.URLEncoding.DecodeString(id)
	if err != nil {
		return InvalidSessionID, err
	}

	// verify that sessionID is valid
	sessionID := []byte(decodedID[0:idLength])
	expectedSignature := []byte(decodedID[idLength:])

	// creating the 2 keys using the ipad and opad constants + hashing
	h := hmac.New(sha256.New, []byte(key))
	_, writeErr := h.Write(sessionID)

	if writeErr != nil {
		return InvalidSessionID, writeErr
	}

	currSignature := h.Sum(nil)

	if !hmac.Equal(expectedSignature, currSignature) {
		return InvalidSessionID, fmt.Errorf("invalid session id")
	}

	return SessionID(sessionID), nil
}

//String returns a string representation of the sessionID
func (sid SessionID) String() string {
	return string(sid)
}
