//imported express and morgan after installing them as dependencies

require('dotenv').config()
// const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Contact = require('./models/contact')


//told app to use express json parser and morgan ('tiny'). Morgan is used to log messages to console

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

//configure morgan to show data sent in http request

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body'))

//dummy contacts
/* let contacts = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
] */

//display information to host page
/* app.get('/', (request, response) => {
    response.send(`<h1>Phonebook has info for ${contacts.length} people</h1><h1>${Date()}</h1>`)
}) */

//set up api/phonebook url to show all contacts
/* prev challenge app.get('/api/phonebook', (request, response) => {
    response.json(contacts)
  }) */

app.get('/api/phonebook', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

// app told to use port 3001 and then log message to console. port can be changed
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//set up api/phonebook/{chosen id} url to display contact with that id
/* prev challenge app.get('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
  }) */

/* app.get('/api/phonebook/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
      response.json(contact)
    })
  }) */

app.get('/api/phonebook/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

//set up delete function to delete chosen id using http request
/* app.delete('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
  }) */

app.delete('/api/phonebook/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


//generate a random id. commented out version picks unused id and works better but this was for a task in which using random id was requested by task setter
/* const generateId = () => {
    const maxId = contacts.length > 0
      ? Math.max(...contacts.map(n => n.id))
      : 0
    return maxId + 1
    newId = Math.floor(Math.random() * 9999)
    return newId
} */

//functionality to post new contact using http post
/* prev challenge app.post('/api/phonebook', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }

    if (contacts.some(e => e.name === body.name)) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }

    const contact = {
      name: body.name,
      number: body.number,
      //important: body.important || false,
      //date: new Date(),
      id: generateId(),
    }

    contacts = contacts.concat(contact)

    response.json(contact)
  }) */


app.post('/api/phonebook', (request, response, next) => {
    console.log('test')
    const body = request.body
    console.log('contact')

    /* if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    } */

    /*  if (contacts.some(e => e.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    } */
    console.log('contact')
    const contact = new Contact({
        name: body.name,
        number: body.number,
        //important: body.important || false,
        //date: new Date(),
        //id: generateId(),
    })

    console.log(contact)

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
        .catch(error => next(error))
})

app.put('/api/phonebook/:id', (request, response, next) => {
    /* const body = request.body

    const contact = {
      number: body.number,
    } */

    const { name, number } = request.body

    Contact.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


/*  start app with npm start or use nodemon so server restarts on saving changes using npm run dev
  visual studio code rest client in .rest file used to trial http requests */