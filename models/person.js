const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})
	// eslint-disable-next-line no-unused-vars
	.then(res => {
		console.log('connected to MongoDB')
	})
	.catch(err => {
		console.log('error connecting to MongoDB', err.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		unique: true,
	},
	number: {
		type: String,
		required: true,
		minLength: 8,
	},
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)