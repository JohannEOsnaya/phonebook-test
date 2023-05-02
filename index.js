require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phone = require('./models/phone')

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path:   ', request.path)
    console.log('Body:   ', request.body)
    console.log('---')
    next()
}

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

/*
let persons = 

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
]*/

app.get('/', (request, response) => {
    response.send('<h1>Se esta lograndoooooo!</h1>')
})

app.get('/api/persons', (request, response) => {
    Phone.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/info', (request, response) => {
    Phone.find({}).then(contacts => {
        const time = new Date()
        response.send(`<p>Phonebook has info for ${contacts.length} people</p>
        <p>${time}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Phone.findById(request.params.id)
    .then(returnedContact => {
        console.log(returnedContact)
        if(returnedContact) {
            return response.json(returnedContact)
        } else {
            return response.status(404).end()
        }
    })
    .catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phone.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {
        next(error)
    })
})

const generateId = () => {
    const randId = persons.length > 0
    ? Math.floor(Math.random() * 1000)
    : 0
    return randId
} 

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const contactInfo = new Phone({
        name: body.name,
        number: body.number,
    })

    contactInfo.save().then(savedContact => {
        response.json(savedContact)
    }).catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Phone.findByIdAndUpdate(request.params.id,
         {name, number},
          {new: true, runValidators: true})
    .then(returnedContact => {
        response.json(returnedContact)
    })
    .catch(error => {
        next(error)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformated id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server runnig on port ${PORT}`)
})