package models

import (
	"fmt"
	"net/mail"

	"golang.org/x/crypto/bcrypt"
)

// using MySQL
type User struct {
	ID        int    `json:"_id"`
	Email     string `json:"-"`
	FirstName string
	LastName  string
	PassHash  []byte `json:"-"`
}

type NewUser struct {
	Email                string `json:"email"`
	Password             string `json:"password"`
	PasswordConfirmation string `json:"passwordConfimation"`
	FirstName            string `json:"firstName"`
	LastName             string `json:"lastName"`
}

func (nu *NewUser) ConvertToUser() (*User, error) {
	err := nu.ValidateNewUser()

	if err != nil {
		return nil, err
	}

	newUser := &User{
		Email:     nu.Email,
		FirstName: nu.FirstName,
		LastName:  nu.LastName,
	}

	passHash, err := bcrypt.GenerateFromPassword([]byte(nu.Password), 13)

	if err != nil {
		return nil, err
	}

	newUser.PassHash = passHash

	return newUser, nil
}

func (u *User) ValidatePass(password string) error {
	if len(password) < 0 {
		return fmt.Errorf("password is empty")
	}

	err := bcrypt.CompareHashAndPassword(u.PassHash, []byte(password))

	if err != nil {
		return err
	}

	return nil
}

func (nu *NewUser) ValidateNewUser() error {
	_, err := mail.ParseAddress(nu.Email)

	if err != nil {
		return fmt.Errorf("invalid Email")
	}

	if len(nu.Password) < 10 {
		return fmt.Errorf("password length < 10")
	}

	if nu.Password != nu.PasswordConfirmation {
		return fmt.Errorf("password does not equal confimration")
	}

	if len(nu.FirstName) < 1 {
		return fmt.Errorf("no first name supplied")
	}

	if len(nu.LastName) < 1 {
		return fmt.Errorf("no last name not supplied")
	}

	return nil
}
