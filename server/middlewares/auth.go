package middlewares

import (
	"net/http"
	"server/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenStr string

		authHeader:=c.GetHeader("Authorization")
		if authHeader!="" {
			parts:=strings.Split(authHeader, " ")
			if len(parts)==2 && parts[0]=="Bearer" {
				tokenStr=parts[1]
			}
		}

		if tokenStr=="" {
			cookie, err:=c.Cookie("auth")
			if err==nil {
				tokenStr=cookie
			}
		}

		if tokenStr=="" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Authorization token required"})
			c.Abort()
			return
		}

		token, err:=utils.ValidateJWT(tokenStr)
		if err!=nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok:=token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid token claims"})
			c.Abort()
			return
		}

		userId, ok:=claims["user_id"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "User ID not found in token"})
			c.Abort()
			return
		}

		c.Set("userId", userId)
		c.Next()
	}
}

