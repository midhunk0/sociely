package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// global variable to hold the database connection
var DB *mongo.Database

func ConnectDB() {
	err:=godotenv.Load()
	if err!=nil {
		log.Fatal("Error loading .env file")
	}
	uri:=os.Getenv("MONGO_URI")
	dbName:=os.Getenv("DB_NAME")
	// set client options
	clientOptions:=options.Client().ApplyURI(uri)
	// connect to mongodb
	client, err:=mongo.Connect(context.TODO(), clientOptions)
	if err!=nil {
		log.Fatal("Error connecting to mongodb:", err)
	}
	// check connection
	err=client.Ping(context.TODO(), nil)
	if err!=nil {
		log.Fatal("Could not ping mongodb:", err)
	}
	fmt.Println("Connected to mongodb")
	DB=client.Database(dbName)
}
