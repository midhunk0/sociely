package middlewares

import (
	"net/http"
	"server/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

// checks jwt in the request header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get token from authorization header
		authHeader:=c.GetHeader("Authorization")
		if authHeader=="" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Authorization token required"})
			c.Abort()
			return
		}
		// split bearer token
		tokenString:=strings.Split(authHeader, " ")
		if len(tokenString)!=2 || tokenString[0]!="Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid token format"})
			c.Abort()
			return
		}
		// validate jwt
		token, err:=utils.ValidateJWT(tokenString[1])
		if err!=nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid or expired token"})
			c.Abort()
			return
		}
		// allow access to route
		c.Next()
	}
}