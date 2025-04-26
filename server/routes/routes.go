package routes

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func Routes(router *gin.Engine){
	router.GET("/hello", controllers.Hello)
	router.GET("/goodbye", controllers.Goodbye)
	router.POST("/registerUser", controllers.RegisterUser)
	router.POST("/loginUser", controllers.LoginUser)
	router.POST("/logoutUser", controllers.LogoutUser)
	// protected routes
	protected:=router.Group("")
	protected.Use(middlewares.AuthMiddleware()) 
	{
		protected.GET("/fetchUsers", controllers.FetchUsers)
		protected.GET("/fetchUser/:id", controllers.FetchUser)
		protected.PUT("/updateUser/:id", controllers.UpdateUser)
		protected.DELETE("/deleteUser/:id", controllers.DeleteUser)
		protected.POST("/addPost/:id", controllers.AddPost)
		protected.POST("/followUser/:id", controllers.FollowUnfollowUser)
	}
}