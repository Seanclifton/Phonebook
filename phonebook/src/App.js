import { useState, useEffect } from 'react'
import axios from 'axios'
import Contact from './components/Contact'
import AddForm from './components/AddForm'
import SearchFilter from './components/SearchFilter'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [deleted, setDeleted] = useState(true)
    const [addedMessage, setAddedMessage] = useState(null)
    const [notificationType, setNotificationType] = useState(true)


    useEffect(() => {
        phonebookService
            .getAll()
            .then(initialPhonebook => {
                setPersons(initialPhonebook)
            })
    }, [deleted])

    const addPerson = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber,
        }
        if (JSON.stringify(persons).includes(JSON.stringify(personObject.name))) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                axios
                    .put(`/api/phonebook/${persons.find(obj => obj.name === newName).id}`, {name:newName, number: newNumber})
                    .then(
                        setDeleted(!deleted),
                        setNewName(''),
                        setNewNumber(''),
                        setAddedMessage(
                            `${personObject.name}'s number has been updated`
                        ),
                        setTimeout(() => {
                            setAddedMessage(null)
                        }, 5000))
                /* .catch(error => 
          setNotificationType(false),
          console.log(notificationType),
          setAddedMessage(
            `Information for ${personObject.name} has already been removed from the server`
          ),
          setTimeout(() => {
            setAddedMessage(null)
            setNotificationType(true)
          }, 5000)) */
                //this should throw error message if contact has already been removed from server but doesnt work. Compare to notes app to figure out.
                    .catch(error => {
                        errorMessage(error)
                    })
            } else {
                return
            }
        }else{
            phonebookService
                .create(personObject)
                .then(returnedPhonebook => {
                    setPersons(persons.concat(returnedPhonebook))
                    setNewName('')
                    setNewNumber('')
                    setAddedMessage(
                        `${personObject.name} added`
                    )
                    setTimeout(() => {
                        setAddedMessage(null)
                    }, 5000)
                })
            /*this is what i thought would work but didnt .catch(error => 
          console.log(error.response.data.error),
          setNotificationType(false),
          setAddedMessage(
            `gi`
          ),
          setTimeout(() => {
            setAddedMessage(null)
            setNotificationType(true)
          }, 5000)) */
                .catch(error => {
                    errorMessage(error)
                })
        }
    }

    //unsure why i had to put this in to a seperate function?
    function errorMessage(props) {
        setNotificationType(false)
        return(
            setNotificationType(false),
            setAddedMessage(
                `${props.response.data.error}`
            ),
            setTimeout(() => {
                setAddedMessage(null)
                setNotificationType(true)
            }, 5000))
    } 

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
    }

    const deleteContctOf = (person) => {
        if (window.confirm(`Do you really want to delete ${person.name}?`)) {
            axios
                .delete(`/api/phonebook/${person.id}`)
                .then(setDeleted(!deleted))
        } else {
            return
        }
    }

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={addedMessage} notificationType={notificationType} />
            <SearchFilter newFilter={newFilter} handleFilterChange={handleFilterChange} />
            <h2>add a new</h2>
            <AddForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <ul>
                {persons.map(person =>
                    <Contact key={person.name} person={person} newFilter={newFilter} deleteContact={() => deleteContctOf(person)} />
                )}
            </ul>
        </div>
    )
}

export default App
