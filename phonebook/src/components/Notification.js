const Notification = ({ message, notificationType }) => {
    if (message === null) {
        return null
    }

    if (notificationType === true) {
        return (
            <div className='error'>
                {message}
            </div>
        )
    }else{
        return (
            <div className='error2'>
                {message}
            </div>
        )
    }
}

export default Notification