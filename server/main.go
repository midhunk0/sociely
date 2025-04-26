// entry point
package main

import (
	"log"
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
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	// routes
	routes.Routes(router)
	// start server
	log.Println("Server running on port 8000...")
	router.Run(":8000")
}