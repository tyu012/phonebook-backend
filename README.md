# Phonebook Backend
Full Stack Open

## Usage
**GET /info** Displays the number of entries in the phonebook and the current date.
**GET /api/persons** Displays all entries in the phonebook in the JSON format.
**GET /api/persons/:id** Displays a single entry in the phonebook corresponding to `id` if it can be found, or returns a 404 status code.
**DELETE /api/persons/:id** Deletes the entry in the phonebook corresponding to `id` if it can be found.
**POST /api/persons** Adds an entry to the phonebook in the JSON format with a randomized unique `id` property.

## Entry format
**Important:** The `id` property is automatically generated by the backend. Do not manually generate an `id`.
**Important:** Extraneous properties will be removed by the backend before the entry is added to the phonebook.

```json
{
	"id": 123456,
	"name": "Foo Bar",
	"number": "123-456-7890"
}
```

## Try it out
https://fso-phonebook-t.herokuapp.com/