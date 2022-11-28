package routes

import (
	"student-crud-mongo/database"
	"student-crud-mongo/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Student struct {
	StudentId string `json:"student_id,omitempty" bson:"_id,omitempty"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

// act as serializer
func CreateResponseStudent(student models.Student) Student {
	return Student{StudentId: student.StudentId, FirstName: student.FirstName, LastName: student.LastName}
}

func RegisterStudent(c *fiber.Ctx) error {
	collection := database.Database.Db.Collection("students")

	student := new(Student)

	if err := c.BodyParser(student); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	student.StudentId = ""
	insertionResult, err := collection.InsertOne(c.Context(), student)

	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	//check it the record is inserted by querying it by the id
	filter := bson.D{{Key: "_id", Value: insertionResult.InsertedID}}
	createdRecord := collection.FindOne(c.Context(), filter)

	createdStudent := &Student{}
	createdRecord.Decode(createdStudent)

	return c.Status(201).JSON(createdStudent)
}
func GetStudents(c *fiber.Ctx) error {
	query := bson.D{{}}
	cursor, err := database.Database.Db.Collection("students").Find(c.Context(), query)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	var students []models.Student = make([]models.Student, 0)
	if err := cursor.All(c.Context(), &students); err != nil {
		return c.Status(500).SendString(err.Error())
	}
	responseStudents := []Student{}
	// mapping user model to user serializer
	for _, stud := range students {
		responseStudent := CreateResponseStudent(stud)
		responseStudents = append(responseStudents, responseStudent)
	}
	return c.JSON(responseStudents)
}

func UpdateStudent(c *fiber.Ctx) error {
	idParam := c.Params("id")

	studentID, err := primitive.ObjectIDFromHex(idParam)

	if err != nil {
		return c.SendStatus(400)
	}

	student := new(Student)

	if err := c.BodyParser(student); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	query := bson.D{{Key: "_id", Value: studentID}}
	update := bson.D{
		{Key: "$set",
			Value: bson.D{
				{Key: "FirstName", Value: student.FirstName},
				{Key: "LastName", Value: student.LastName},
			},
		},
	}

	err = database.Database.Db.Collection("students").FindOneAndUpdate(c.Context(), query, update).Err()

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.SendStatus(400)
		}
		return c.SendStatus(500)
	}

	student.StudentId = idParam

	return c.Status(200).JSON(student)

}

func DeleteStudent(c *fiber.Ctx) error {
	studentID, err := primitive.ObjectIDFromHex(c.Params("id"))

	if err != nil {
		return c.SendStatus(400)
	}

	query := bson.D{{Key: "_id", Value: studentID}}
	result, err := database.Database.Db.Collection("students").DeleteOne(c.Context(), &query)

	if err != nil {
		return c.SendStatus(500)
	}

	if result.DeletedCount < 1 {
		return c.SendStatus(404)
	}

	return c.Status(200).JSON("record deleted")

}

func GetStudent(c *fiber.Ctx) error {
	idParam := c.Params("id")

	studentID, err := primitive.ObjectIDFromHex(idParam)

	if err != nil {
		return c.SendStatus(400)
	}

	filter := bson.D{{Key: "_id", Value: studentID}}

	studentRecord := database.Database.Db.Collection("students").FindOne(c.Context(), filter)

	studentData := models.Student{}
	studentRecord.Decode(&studentData)
	ret := CreateResponseStudent(studentData)
	return c.Status(200).JSON(ret)

}
