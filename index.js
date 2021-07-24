require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
// eslint-disable-next-line no-unused-vars
morgan.token('data', (req, res) => {
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// Routes

app.get('/info', (req, res, next) => {
	Person
		.find({})
		.then(persons => {
			const info = `Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}`
			const date = new Date().toString()
			res.send(`<p>${info}</p><p>${date}</p>`)
		})
		.catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
	Person
		.find({})
		.then(persons => { res.json(persons) })
		.catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
	Person
		.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person
		.findByIdAndRemove(req.params.id)
		// eslint-disable-next-line no-unused-vars
		.then(result => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	// handle bad requests
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
			res.json(savedPerson)
		})
		.catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, {
		new: true,
		runValidators: true,
		context: 'query'
	}, error => {
		console.error(error)
	})
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(err => next(err))
})

// Listen to HTTP requests

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

// Error handling middleware

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	}
	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}

	next(err)
}
app.use(errorHandler)