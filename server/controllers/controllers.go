package controllers

import (
	"context"
	"net/http"
	"os"
	"server/config"
	"server/models"
	"server/utils"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getCookieSettings() (sameSite http.SameSite, secure bool) {
	if os.Getenv("MODE")=="production" {
		return http.SameSiteNoneMode, true
	}
	return http.SameSiteLaxMode, false
}

func Hello(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"Message": "Hello, go"})
}

func Goodbye(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"Message": "Goodbye"})
}

func RegisterUser(c *gin.Context) {
	var registerData models.RegisterRequest
	var user models.User

	if err:=c.ShouldBindJSON(&registerData); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	// validate required fields
	if registerData.Username=="" || registerData.Email=="" || registerData.Password=="" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username, email and password are required"})
		return
	}
	// check is username or email exists
	var existingUser models.User
	err:=config.DB.Collection("users").FindOne(context.TODO(), bson.M{"username": registerData.Username}).Decode(&existingUser)
	if err==nil {
		c.JSON(http.StatusConflict, gin.H{"message": "Username already exists"})
		return
	}
	err=config.DB.Collection("users").FindOne(context.TODO(), bson.M{"email": registerData.Email}).Decode(&existingUser)
	if err==nil {
		c.JSON(http.StatusConflict, gin.H{"message": "Email already exists"})
		return
	}
	hashedPassword, err:=utils.HashPassword(registerData.Password)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error while hashing"})
		return
	}
	user.Name=registerData.Name
	user.Username=registerData.Username
	user.Email=registerData.Email
	user.Password=hashedPassword
	// assign a new objectID
	user.ID=primitive.NewObjectID()
	// insert into mongodb
	ctx, cancel:=context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel() 
	_, err=config.DB.Collection("users").InsertOne(ctx, user)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	// generate jwt token
	token, err:=utils.GenerateJWT(user.ID.Hex())
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error generating token"})
		return
	}
	// set cookie
	// Replace your current cookie setting code with this:
	sameSite, secure := getCookieSettings()

	c.SetSameSite(sameSite) // This is the critical line you're missing
	c.SetCookie(
		"auth",
		token,
		86400,
		"/",
		"",
		secure,
		true,
	)
	// send token in response
	c.JSON(http.StatusOK, gin.H{"message": "Registration successful", "token": token})

}

func LoginUser(c *gin.Context) {
	var loginData models.LoginRequest
	var user models.User
	// bind json request
	if err:=c.ShouldBindJSON(&loginData); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON data"})
		return
	}
	if loginData.Credential=="" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username or email is required"})
	}
	if loginData.Password=="" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password is required"})
		return
	}
	// find user by email or username
	filter:=bson.M{"$or": []bson.M{
		{"email": loginData.Credential},
		{"username": loginData.Credential},
	}}
	err:=config.DB.Collection("users").FindOne(context.TODO(), filter).Decode(&user)
	if err!=nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "User not found"})
		return
	}
	if !utils.CheckPassword(user.Password, loginData.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Incorrect password"})
		return
	}
	// generate jwt token
	token, err:=utils.GenerateJWT(user.ID.Hex())
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error generating token"})
		return
	}
	// set token in httpOnly cookie
	// Replace your current cookie setting code with this:
	sameSite, secure := getCookieSettings()

	c.SetSameSite(sameSite) // This is the critical line you're missing
	c.SetCookie(
		"auth",
		token,
		86400,
		"/",
		"",
		secure,
		true,
	)
	
	// send token in response
	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": token})
}

func LogoutUser(c *gin.Context) {
	// Replace your current cookie setting code with this:
	sameSite, secure := getCookieSettings()

	c.SetSameSite(sameSite) // This is the critical line you're missing
	c.SetCookie(
		"auth",
		"",
		-1,
		"/",
		"",
		secure,
		true,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully", "success": true})
}

func FetchUsers(c *gin.Context) {
	// fetch users from mongodb
	var users []models.User
	ctx, cancel:=context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cursor, err:=config.DB.Collection("users").Find(ctx, bson.M{})
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user models.User
		if err:=cursor.Decode(&user); err!=nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding user data"})
			return
		}
		user.Password=""
		users=append(users, user)
	}
	c.JSON(http.StatusOK, users)
}

func FetchUser(c *gin.Context) {
	id:=c.Param("id")
	userId, err:=primitive.ObjectIDFromHex(id)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}	
	// define user variable
	var user models.User
	// fetch user from database
	err=config.DB.Collection("users").FindOne(context.TODO(), bson.M{"_id": userId}).Decode(&user)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	id:=c.Param("id")
	userId, err:=primitive.ObjectIDFromHex(id)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}

	var updateData bson.M
	if err:=c.ShouldBindJSON(&updateData); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	if len(updateData)==0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields provided for update"})
		return
	}

	ctx, cancel:=context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter:=bson.M{"_id": userId}
	update:=bson.M{"$set": updateData}

	result, err:=config.DB.Collection("users").UpdateOne(ctx, filter, update)
	if err!=nil || result.MatchedCount==0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found or update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"Message": "User updated successfully"})
}

func DeleteUser(c *gin.Context) {
	id:=c.Param("id")
	userId, err:=primitive.ObjectIDFromHex(id)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}

	ctx, cancel:=context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter:=bson.M{"_id": userId}
	result, err:=config.DB.Collection("users").DeleteOne(ctx, filter)
	if err!=nil || result.DeletedCount==0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found or delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User delete successfully"})
}

func AddPost(c *gin.Context) {
	// validate userID
	id:=c.Param("id")
	userId, err:=primitive.ObjectIDFromHex(id)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
	}

	var post models.Post
	var postData models.PostRequest
	// bind json request to post struct
	if err:=c.ShouldBindJSON(&postData); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	// validate required fields
	if postData.Title=="" || postData.Description=="" || postData.Image=="" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title, description and image is required"})
		return
	}
	// generate a new objectId for the post
	post.ID=primitive.NewObjectID()
	post.UserID=userId
	post.CreatedAt=primitive.NewDateTimeFromTime(time.Now())
	post.Title=postData.Title
	post.Description=postData.Description
	post.Image=postData.Image
	post.LikeCount=0
	post.Likes=[]primitive.ObjectID{}
	post.CommentsCount=0
	post.Comments=[]models.Comment{}
	// insert into mongodb posts collection
	posts:=config.DB.Collection("posts")
	_, err=posts.InsertOne(context.TODO(), post)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}
	// update user's posts array
	users:=config.DB.Collection("users")
	update:=bson.M{"$push": bson.M{"posts": post.ID}}
	_, err=users.UpdateOne(context.TODO(), bson.M{"_id": userId}, update)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user with new post"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Post created successfully"})
}

func FollowUnfollowUser(c *gin.Context) {
	id:=c.Param("id")
	userId, err:=primitive.ObjectIDFromHex(id)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userId"})
		return
	}	
	// define user variable
	var user models.User
	var followingUser models.User
	// fetch user from database
	err=config.DB.Collection("users").FindOne(context.TODO(), bson.M{"_id": userId}).Decode(&user)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	var followData models.FollowRequest
	if err:=c.ShouldBindJSON(&followData); err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}
	// convert followUserId
	followUserId, err:=primitive.ObjectIDFromHex(followData.UserId)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid follow userId"})
		return
	}
	err=config.DB.Collection("users").FindOne(context.TODO(), bson.M{"_id": followUserId}).Decode(&followingUser)
	if err!=nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Following User not found"})
		return
	}
	// check if already following
	isFollowing:=false

	for _, following:=range user.Followings {
		if following.UserId==followUserId {
			isFollowing=true
			break
		}
	}
	if isFollowing {
		// unfollow 
		_, err=config.DB.Collection("users").UpdateOne(
			context.TODO(), 
			bson.M{"_id": userId}, 
			bson.M{"$pull": bson.M{"followings": bson.M{"userId": followUserId}}},
		)
		if err!=nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unfollow"})
			return
		}

		_, err=config.DB.Collection("user").UpdateOne(
			context.TODO(),
			bson.M{"_id": followUserId},
			bson.M{"$pull": bson.M{"followers": bson.M{"userId": userId}}},
		)
		if err!=nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove follower"})
			return
		}
	}
	// follow 
	following:=models.Following {
		UserId: followUserId,
		CreatedAt: primitive.NewDateTimeFromTime(time.Now()),
	}
	follower:=models.Follower {
		UserId: userId,
		CreatedAt: primitive.NewDateTimeFromTime(time.Now()),
	}

	_, err=config.DB.Collection("users").UpdateOne(
		context.TODO(),
		bson.M{"_id": userId},
		bson.M{"$push": bson.M{"followings": following}},
	)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to follow user"})
		return
	}

	_, err=config.DB.Collection("users").UpdateOne(
		context.TODO(),
		bson.M{"_id": followUserId},
		bson.M{"$push": bson.M{"followers": follower}},
	)
	if err!=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add follower"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User followed"})
}