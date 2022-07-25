const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url = `mongodb+srv://seanc:${password}@cluster0.el1wgyb.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)
if (process.argv[3]) {
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')
            const contact = new Contact({
                name: contactName,
                number: contactNumber
            })

            return contact.save()
        })
        .then(() => {
            console.log(`added ${contactName} number ${contactNumber} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
} else {
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')
        })
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}
