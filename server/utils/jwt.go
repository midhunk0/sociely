package utils

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)
// secret key for signing jwt tokens
var jwtSecret=[]byte("ababab")
// generates a new jwt token for an user
func GenerateJWT(userId string) (string, error) {
	// define token claims
	claims:=jwt.MapClaims{
		"user_id": userId,
		"exp": time.Now().Add(time.Hour*24).Unix(), // expires in 24 hours
	}
	// create a new token
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// sign and return the token
	return token.SignedString(jwtSecret)
}

// validates and parse a jwt token
func ValidateJWT(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// ensure the signing method is correct
		if _, ok:=token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})
}