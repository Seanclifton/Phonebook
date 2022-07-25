const Contact = (props) => {
    if (props.person.name.toLowerCase().includes(props.newFilter.toLowerCase())) {
        return (
            <li>{props.person.name} {props.person.number}<button id={props.person.id} value={props.person.name} onClick={props.deleteContact}>delete</button></li>
        )
    }
}

export default Contact