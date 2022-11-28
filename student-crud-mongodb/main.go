package main

import (
	"log"
	"student-crud-mongo/database"
	"student-crud-mongo/routes"

	"github.com/gofiber/fiber/v2"
)

func welcome(c *fiber.Ctx) error {
	return c.SendString("Welcome to an Awesome API")
}

func setupRoutes(app *fiber.App) {
	app.Get("/api/welcome", welcome)
	app.Post("/api/student", routes.RegisterStudent)
	app.Get("/api/student", routes.GetStudents)
	app.Get("/api/student/:id", routes.GetStudent)
	app.Put("/api/student/:id", routes.UpdateStudent)
	app.Delete("/api/student/:id", routes.DeleteStudent)
	

}
func main() {
	if err := database.Connect(); err != nil {
		log.Fatal(err)
	}
	app := fiber.New()
	setupRoutes(app)

	log.Fatal(app.Listen(":3000"))

}
