import { asset } from "../../assets/asset";

const RadioOption = ({value, option, display, handleClick, style, highlightedStyle}) => {
    return <>
        {value===option 
            ? <div style={highlightedStyle} >{display}</div> 
            : <div style={style} onClick={()=> handleClick(option)} >{display}</div>
        }
    </>
}

const Radio = ({ value,  setValue, options = [false, true], padding='5px 10px', borderRadius='5px', border='1px solid #333' }) => {
    const containerStyle = {
        overflow: 'hidden',
        border,
        borderRadius,
        display: 'inline-block',
        cursor:'pointer',
        minWidth:'fit-content'
    }

    const styleRight = {
        padding,
        display: 'inline-block'
    }
    const highlightedStyleRight = {
        ...styleRight,
        backgroundColor:'#9FE4D4'
    }
    
    const style = {
        borderRight: border,
        padding,
        display: 'inline-block',
    }
    const highlightedStyle = {
        ...style,
        backgroundColor:'#9FE4D4'
    }

    if(options.length===1){
        options = [options[0], false, true]
    }

    const cross = <img src={asset.greyCross} alt="grey cross" />
    const check = <img src={asset.greyCheck} alt="grey check" />

    const handleClick = (option) => {
        setValue(option)
    }

    return (
        <div className="radio" style={containerStyle}>
            {options.map(option=>{
                let display
                if(option === true){
                    display = check
                } else if (option === false){
                    display = cross
                } else {
                    display = option
                }

                if(option===options[options.length-1]){
                    return <RadioOption 
                        key={option}
                        value={value}
                        option={option}
                        display={display}
                        handleClick={handleClick}
                        style={styleRight}
                        highlightedStyle={highlightedStyleRight}
                    />
                }

                return <RadioOption 
                        key={option}
                        value={value}
                        option={option}
                        display={display}
                        handleClick={handleClick}
                        style={style}
                        highlightedStyle={highlightedStyle}
                />
            })}
        </div>
    );
}
 
export default Radio;