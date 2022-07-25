const SearchFilter = (props) => {
    return <>
                filter shown with <input value={props.newFilter} onChange={props.handleFilterChange} />
    </>
}

export default SearchFilter