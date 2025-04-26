package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Response struct {
	Message string `json:"message"`
}

// user model
type User struct {
	ID primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	Name string `bson:"name" json:"name"`
	Username string `bson:"username" json:"username"`
	Email string `bson:"email" json:"email"`
	Password string `bson:"password" json:"-"` 
	Followings []Following `bson:"followings" json:"followings"`
	Followers []Follower `bson:"followers" json:"followers"`
	Posts []primitive.ObjectID `bson:"posts, omitempty" json:"posts"`
}
// following model
type Following struct {
	UserId primitive.ObjectID `bson:"userId" json:"userId"`
	CreatedAt primitive.DateTime `bson:"createdAt" json:"createdAt"`
}
// follower model
type Follower struct {
	UserId primitive.ObjectID `bson:"userId" json:"userId"`
	CreatedAt primitive.DateTime `bson:"createdAt" json:"createdAt"`
}
// post model
type Post struct {
	ID primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"userId" json:"userId"`
	Title string `bson:"title" json:"title"`
	Description string `bson:"description" json:"description"`
	Image string `bson:"image" json:"image"`
	LikeCount int `bson:"likesCount" json:"likesCount"`
	Likes []primitive.ObjectID `bson:"likes, omitempty" json:"likes"`
	CommentsCount int `bson:"commentsCount" json:"commentsCount"`
	Comments []Comment `bson:"comments, omitempty" json:"comments"`
	CreatedAt primitive.DateTime `bson:"createdAt, omitempty" json:"createdAt"`
}
// comment model
type Comment struct {
	ID primitive.ObjectID `bson:"_id, omitempty" json:"id"`
	UserId primitive.ObjectID `bson:"userId" json:"userId"`
	Comment string `bson:"comment" json:"comment"`
	Replies []Comment `bson:"replies, omitempty" json:"replies"`
	Likes []primitive.ObjectID `bson:"likes, omitempty" json:"likes"`
} 

// input requests
type RegisterRequest struct {
	Name string `json:"name" binding:"required"`
	Username string `json:"username" binding:"required"`
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginRequest struct {
	Credential string `json:"credential" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type PostRequest struct {
	Title string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Image string `json:"image" binding:"required"`
}

type FollowRequest struct {
	UserId string `json:"userId" binding:"required"`
}

type UnfollowRequest struct {
	UserId string `json:"userId" binding:"required"`
}
