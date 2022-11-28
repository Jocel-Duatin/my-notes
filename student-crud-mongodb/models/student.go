package models

import "time"

type Student struct {
	StudentId string `json:"student_id,omitempty" bson:"_id,omitempty"`
	CreatedAt time.Time
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}
