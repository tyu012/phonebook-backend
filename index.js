require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('data', (req, res) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// Initial data

// To be removed
let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

const MAX_ID = 1000000

// Functions

// To be removed
const generateID = max => {
	let newID
	do {
		newID = Math.floor(Math.random() * max)
	} while (persons.find(p => p.id === newID))
	return newID
}

// Routes

app.get('/info', (req, res) => {
	const info = `Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}`
	const date = new Date().toString()
	res.send(`<p>${info}</p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
	Person
		.find({})
		.then(persons => { res.json(persons) })
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)

	res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	// handle errors
	if (!body.name) {
		return res.status(400).json({ error: 'name missing' })
	}
	if (!body.number) {
		return res.status(400).json({ error: 'number missing' })
	}

	// create entry
	const person = new Person({
		name: body.name,
		number: body.number,
	})

	// save entry to MongoDB
	person
		.save()
		.then(savedPerson => {
			console.log(`${savedPerson.name} saved`)
			response.json(savedPerson)
		})
})

// WIP: Overwriting existing entry

// Listen to HTTP requests

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})