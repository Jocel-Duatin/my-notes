package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func welcome(c *fiber.Ctx) error {
	return c.SendString("Welcome to an Awesome API1312")
}

func setupRoutes(app *fiber.App) {
	app.Get("/api/welcome", welcome)
}
func main() {

	app := fiber.New()
	setupRoutes(app)

	log.Fatal(app.Listen(":3000"))

}
