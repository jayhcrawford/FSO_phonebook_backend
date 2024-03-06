const express = require('express');
const app = express();

const cors = require('cors')

app.use(cors())


app.use(express.json());
var morgan = require('morgan');
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))





const phonebook = 
  [
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



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/info', (request, response) => {
  response.send(`
  <p>Phonebook has data for ${phonebook.length} people</p>
  <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find(person => person.id === id);

  if (person) {
  response.json(person);
  } else {
    return response.status(400).json({
      error: `phonebook entry is non existent at the id of ${id}`
    })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const newPhonebook = phonebook.filter(person => {
    person.id !== id
  })
  response.status(204).end();
})

const generateId = () => {
  const maxId = phonebook.length > 0
    ? Math.random() * phonebook.length
    : Math.random()
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const person = {
    ...request.body,
    id: generateId()
  };

  if (!person.name) {
    return response.status(400).json({
      error: 'The body of this POST request does not contain a contact name'
    })
  } else if (!person.number) {
    return response.status(400).json({
      error: 'The body of this POST request does not contain a contact number'
    })
  } else if (phonebook.find(entry => entry.name === person.name)) {
    return response.status(400).json({
      error: `${person.name} is already in the phonebook`
    })
  } else {
    return response.json(person);
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


