import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_ROOT_TASKS, ALL_TAGS, EDIT_TASK, GET_TASK_TREE, NEW_TASK, USER } from "../../queries"
import Dropdown from "../subcomponents/Dropdown"
import Scheduler from "./Scheduler"

const EditTask = ({
    task, 
    setTask, 
    location, 
    setFalseToExit, 
    creatingNewTask=false, 
    taskpadTask,
    setNotification,
}) => {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [scheduled, setScheduled] = useState(task.scheduled)
    const [schedule, setSchedule] = useState(task.schedule)
    const [tag, setTag] = useState('none')

    let tagsAvailable = ['none']
    let breadcrumbs =''

    const allTags = useQuery(ALL_TAGS)
    const [saveNewTask] = useMutation(NEW_TASK, 
        {
            refetchQueries: [
                { query: ALL_ROOT_TASKS }, 
                { query: USER }, 
                { query: GET_TASK_TREE, variables: {id:taskpadTask 
                    ? task.root
                        ? taskpadTask.id 
                        : task.supertask[task.supertask.length -1]
                    : null
                }}
            ]
        })
    const [saveEditedTask] = useMutation(EDIT_TASK,
        {
            refetchQueries: [{ query: ALL_ROOT_TASKS }]
        })

    if(location){   
        for (let i = 0; i < location.length; i++) {
            breadcrumbs.concat(location[i].title + ' > ')
        }
    }

    if(!allTags.loading && allTags.data.allTags){
        tagsAvailable = ['none']
        allTags.data.allTags.forEach(tagIterate => {
            tagsAvailable.push(tagIterate.name)
        })
    }
    useEffect(()=>{
        if(!allTags.loading && allTags.data.allTags){
            if(task.tag){
                setTag(allTags.data.allTags.find(t => t.id === task.tag).name)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[allTags.data])

    const handleCancel = () => {
        setTask()
        setFalseToExit(false)
    }

    const handleSave = () => {
        const {subtasks, ...newTask} = task
        newTask.title = title
        newTask.description = description
        newTask.scheduled = scheduled
        newTask.schedule = {
            category: schedule.category,
            start: schedule.start,
            end: {
                active: schedule.end.active,
                date: schedule.end.date
            },
            reset: {
                active: schedule.reset.active,
                date: schedule.reset.date
            }
        }
        newTask.tag = tag === 'none' 
            ? null
            : allTags.data.allTags.find(t => t.name === tag).id

        if(creatingNewTask){
            setNotification(`Added: ${newTask.title.substring(0,40)}`)
            saveNewTask({variables: {...newTask}})
            setTask()
        } else {
            setNotification(`Updated: ${newTask.title.substring(0,40)}`)
            saveEditedTask({variables: {...newTask}})
        }

        setFalseToExit(false)
    }

    return (  
        <div className="task-edit-container">
            <p className="title-label">Task Name</p>
            <input 
                type="text" 
                value={title} 
                onChange={({target})=>setTitle(target.value)}
                className='title-input'
                placeholder="Enter task name"
            />

            <p>Description</p>
            <input 
                type='text' 
                value={description} 
                onChange={({target})=>setDescription(target.value)}
                className='description-input'
                placeholder="Enter task description"
            />

            {!task.root && <div className="location">
                <p>Location</p>
                {location.map(t=> <span key={t.id}>{`${t.title} > `}</span>)}
            </div>}

            {task.root && <div className="tag-selector">
                <p>Tag</p>
                <Dropdown options={tagsAvailable} value={tag} setValue={setTag}/>
            </div>}

            <Scheduler 
                scheduled={scheduled}
                setScheduled={setScheduled}
                schedule={schedule} 
                setSchedule={setSchedule}
            />

            <div className="exit-buttons">
                <div className="cancel" onClick={handleCancel}>Cancel</div>
                <div className="save" onClick={handleSave}>Save</div>
            </div>
        </div>
    );
}
 
export default EditTask;