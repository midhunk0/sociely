// entry point
package main

import (
	"log"
	"os"
	"server/config"
	"server/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main(){
	// connect to mongodb
	config.ConnectDB()
	// create a gin router
	router:=gin.Default()
	// enable cors
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{os.Getenv("FRONTEND_URL")},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders: []string{"Set-Cookie"},
		AllowCredentials: true,
	}))
	// routes
	routes.Routes(router)
	// start server
	log.Println("Server running on port 8000...")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	router.Run(":" + port)
}