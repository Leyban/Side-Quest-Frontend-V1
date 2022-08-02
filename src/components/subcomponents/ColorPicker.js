import { useMutation } from "@apollo/client"
import { useState } from "react"
import { asset } from "../../assets/asset"
import { EDIT_TAG } from "../../queries"

const ColorSquare = ({color, tag, setTag}) => {
    const [editTag] = useMutation(EDIT_TAG, {
        update(
            cache,
            {
                data: { editTag }
            }
        ) {
            cache.modify({
                id: cache.identify(editTag),
                fields: {
                    color(){return editTag.color},
                    name(){return editTag.name}
                }
            })
        }
    })
    const handleClick = () => {
        setTag({...tag, color})
        editTag({
            variables: {...tag, color},
            optimisticResponse: {
                editTag: {
                    ...tag,
                    color,
                    __typename: 'Tag'
                }
            }
        })
    }

    return <svg style={{cursor:'pointer'}} onClick={handleClick} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="25" height="25" rx="5" fill={color}/>
    </svg>
}

const ColorPicker = ({tag, setTag, show, setShow}) => {
    const [customColor, setCustomColor] = useState(tag.color)
    const [customColorText, setCustomColorText] = useState(tag.color)
    const defaultColors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE']

    const handleChange = (value) => {
        const colorEvaluator = new RegExp(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
        const inputEvaluator = new RegExp(/^#(?:[0-9a-fA-F]{0,6})$/)

        // check if valid color characters
        if(inputEvaluator.test(value)){
            setCustomColorText(value)
        }

        // check if valid color code
        if(colorEvaluator.test(value)){
            setCustomColor(value)
        }
    }

    if (!show) {
        return null
    }

    return (  
        <div className="color-picker-container module" style={{border: `2px solid ${tag.color}`}}>
                <img 
                    src={asset.greyCross} 
                    alt="grey cross" 
                    onClick={()=>setShow(false)}
                    style={{position:'absolute', top:10, right:10, cursor:'pointer'}}
                />
            <div className="color-picker">
                <div className="colors">
                    {defaultColors.map(color=> <ColorSquare color={color} tag={tag} setTag={setTag} key={color}/>)}
                    <ColorSquare color={customColor} tag={tag} setTag={setTag} />
                </div>
                <div className="custom-color-input">
                    <div className="hash">#</div>
                    <input
                        type="text" 
                        value={customColorText.substr(1)}
                        onChange={({target})=> handleChange(`#${target.value}`)}
                    />
                </div>
            </div>
        </div>

    );
}
 
export default ColorPicker;