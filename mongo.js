const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
	console.log('Usage:')
	console.log('To add an entry: node mongo.js <password> "<name>" <number>')
	console.log('To list all entries: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://timyu:${password}@cluster0.hiv78.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	console.log('phonebook:')
	Person
		.find({})
		.then(persons => {
			persons.forEach(person => console.log(`${person.name} ${person.number}`))
			mongoose.connection.close()
		})
} else if (process.argv.length === 5) {
	const newPerson = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})

	newPerson
		.save()
		.then(result => {
			console.log(`${newPerson.name} saved`)
			mongoose.connection.close()
		})
} else {
	mongoose.connection.close()
}