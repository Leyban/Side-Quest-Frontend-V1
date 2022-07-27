import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { asset } from "../../assets/asset";
import ColorPicker from "../subcomponents/ColorPicker";
import Tag from "../subcomponents/Tag";
import { ALL_TAGS, USER, DELETE_TAG, CREATE_TAG, EDIT_TAG, ALL_ROOT_TASKS } from "../.././queries";


const ListedTag = ({tag, tagForColorPicker, handleTagClick, tagFilter, setTagFilter, setColorPickerMode}) => {
    const [editMode, setEditMode] = useState(false)
    const [editTagName, setEditTagName] = useState(tag.name)
    const [deleteTag] = useMutation(DELETE_TAG, {
        refetchQueries: [{ query: ALL_TAGS }, { query: USER }, {query: ALL_ROOT_TASKS}]
    })
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

    const handleEdit = () => {
        setEditMode(true)
    }
    const handleDelete = () => {
        deleteTag({variables: {id: tag.id}})
        setColorPickerMode(false)
        if(tagFilter===tag.id){
            return setTagFilter(null)
        }
    }
    const handleCancel = () => {
        setEditMode(false)
        setEditTagName(tag.name)
    }
    const handleSaveEdit = () => {
        setEditMode(false)
        editTag({
            variables: {...tag, name: editTagName},
            optimisticResponse: {
                editTag: {
                    ...tag,
                    name: editTagName,
                    __typename: 'Tag'
                }
            }
        })
    }
    const handleSelectTag = () => {
        if(tagFilter!==tag.id){
            return setTagFilter(tag.id)
        }
        setTagFilter(null)
    }

    useEffect(()=> {
        if(tagForColorPicker.id === tag.id){
            editTag({variables: {...tag, color: tagForColorPicker.color}})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagForColorPicker])

    const tagClassName = tagFilter===tag.id ? 'listed-tag selected' : 'listed-tag'

    return <div className={tagClassName}>
        <Tag tag={tag} onClick={()=>handleTagClick(tag)}/>
        {editMode 
            ?   <input 
                    type='text'
                    value={editTagName}
                    onChange={({target}) => setEditTagName(target.value)}
                />
            :   <span onClick={handleSelectTag}>{tag.name}</span>
        }

        {editMode 
            ?   <div className="options">
                    <img src={asset.trashCan} alt="trash can" onClick={handleDelete}/>
                    <img src={asset.redCross} alt="red cross" onClick={handleCancel}/>
                    <img src={asset.thickGreenCheck} alt="green check" onClick={handleSaveEdit}/>
                </div>
            :   <span className="edit" onClick={handleEdit}>
                    <img src={asset.edit} alt="pen on paper" onClick={handleEdit}/>
                </span>
        }
    </div>
}

const NewTag = () => {
    const defaultTag = { name: '', color: '#888888', favorite: false }
    const [newTag, setNewTag] = useState(defaultTag)

    const [createTag] = useMutation(CREATE_TAG, {
        refetchQueries: [{ query: ALL_TAGS }, { query: USER }]
    })

    const handleSave = () => {
        if(!newTag.name){
            return
        }
        setNewTag(defaultTag)
        createTag({variables: {...newTag}})
    }

    return <div className="new-tag-create-mode">
        <input
            type='text'
            value={newTag.name}
            onChange={({target}) => setNewTag({...newTag, name: target.value})}
            placeholder='New Tag'
        />
        <div className="options"  onClick={handleSave}>
            <span>Add</span>
        </div>
    </div>
    
}

const TagFilter = ({colorPickerMode, setColorPickerMode, tagFilter, setTagFilter}) => {
    const tags = useQuery(ALL_TAGS)
    const [tagForColorPicker, setTagForColorPicker] = useState({id:null})

    const handleTagClick = (tag) => {
        if(tagForColorPicker.id === tag.id){
            setColorPickerMode(!colorPickerMode)
        }
        setTagForColorPicker(tag)
    }

    if (tags.loading) {
        return <div className="tag-filter module">
            <h3>Tags</h3>
        </div>
    }

    return (<>
        {colorPickerMode && <ColorPicker 
                key={tagForColorPicker.id}
                tag={tagForColorPicker} 
                setTag={setTagForColorPicker} 
                show={colorPickerMode} 
                setShow={setColorPickerMode}
            />}
        <div className="tag-filter module">
            <h3>Tags</h3>
            <div className="container">
                {tags.data.allTags.map(tag => <ListedTag 
                    key={tag.id} 
                    tag={tag} 
                    handleTagClick={handleTagClick}
                    tagForColorPicker={tagForColorPicker}
                    tagFilter={tagFilter}
                    setTagFilter={setTagFilter}
                    setColorPickerMode={setColorPickerMode}
                />)}
                <NewTag />
            </div>
        </div>
    </>);
}
 
export default TagFilter;