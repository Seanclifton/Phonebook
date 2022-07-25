const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

//If number contains - this validator is used to ensure it is either the third or fourth character

function validator (val) {
    if (val.includes('-')) {
        if (val[2] === '-' || val[3] === '-') {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: validator,
    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)