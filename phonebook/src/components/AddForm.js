const AddForm = (props) => {
    return (
        <form onSubmit={props.addPerson}>
            <div>
                name: <input value={props.newName} onChange={props.handleNameChange} />
            </div>
            number: <input value={props.newNumber} onChange={props.handleNumberChange} />
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default AddForm