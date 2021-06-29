const express = require('express')
const app = express()

app.use(express.json())

// Initial data

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

const generateID = max => {
	let newID
	do {
		newID = Math.floor(Math.random() * max)
	} while (persons.find(p => p.id === newID))
	return newID
}

// Requests

app.get('/info', (req, res) => {
	const info = `Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}`
	const date = new Date().toString()
	res.send(`<p>${info}</p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
	console.log('GET', persons)
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		console.log('GET', person)
		res.json(person)
	} else {
		console.log('GET', 'id', id, 'not found')
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)

	console.log('DELETE', 'id', id)
	res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	// handle errors
	if (!body.name) {
		console.log('name missing')
		return res.status(400).json({ error: 'name missing' })
	}
	if (!body.number) {
		console.log('number missing')
		return res.status(400).json({ error: 'number missing' })
	}
	if (persons.find(p => p.name === body.name)) {
		console.log('name must be unique')
		return res.status(400).json({ error: 'name must be unique' })
	}

	// create entry
	const person = {
		id: generateID(MAX_ID),
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)

	console.log('POST', person)
	res.json(person)
})

// Listen to HTTP requests

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})