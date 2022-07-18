const Dropdown = ({options, value, setValue, padding='5px', borderRadius='5px', fontSize='16px', zero=true}) => {
    const style = {
        padding,
        borderRadius,
        fontSize,
        fontFamily:'Montserrat'
    }

    let dropdownOptions
    if(typeof options === 'number' && options===12){
        dropdownOptions = [...Array(12).keys()].map(h=>h+1)
    } else if (typeof options === 'number' && zero===false) {
        dropdownOptions = [...Array(options+1).keys()]
        dropdownOptions.shift()
    } else if (typeof options === 'number') {
        dropdownOptions = [...Array(options+1).keys()]
    } else {
        dropdownOptions = options
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (  
        <select value={value} onChange={handleChange} style={style}>
          {dropdownOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
    );
}
 
export default Dropdown;