import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { asset } from "../../assets/asset";
import { ALL_ROOT_TASKS, APPEND_TASK, GET_TASK_TREE, ORPHAN_SAVED_TASKS, SAVE_TASK } from "../../queries";

const ListedTask = ({
    task, 
    appendMode, 
    handleTaskClick, 
    handleSave, 
    handleAppend, 
    savedTaskToAppend,
    setGreet,
    setNotification,
}) => {
    const [appendTask] = useMutation(APPEND_TASK, {
        refetchQueries: [
            {query: GET_TASK_TREE, variables: {id: task.id}},
            {query: ALL_ROOT_TASKS}
        ]
    })

    const handleAppendClick = () => {
        appendTask({variables:{savedTaskId: savedTaskToAppend.id, taskId: task.id}})
        setNotification(`Added: ${savedTaskToAppend.title.substring(0,18)} to: ${task.title.substring(0,18)}`)
        setGreet('Side Quest HQ')
        handleAppend()
    }

    let itemClass = 'listed-task'
    if(task.subtasks.length > 0){
        itemClass = 'listed-task supertask'
    }

    return <div className={itemClass}>
        <span onClick={() => handleTaskClick(task)}>{task.title}</span>
        {appendMode 
            ? <img onClick={handleAppendClick} src={asset.curvedArrow} alt='curved arrow' className="curved-arrow" />
            : <img onClick={()=>handleSave(task.id, task.title)} src={asset.save} alt='floppy disk' className="save" />
        }
    </div>
}
const SubtaskRender = ({
    appendMode, 
    handleTaskClick, 
    handleSave, 
    handleAppend, 
    subtasksOf, 
    savedTaskToAppend,
    setGreet,
    setNotification,
}) => {
    const taskTree = useQuery(GET_TASK_TREE, {variables: {id: subtasksOf.id}})
    let tasksToRender = []

    if (!taskTree.loading && taskTree.data ) {
        tasksToRender = taskTree.data.taskTree.subtasks
    }

    return <>
        {tasksToRender.map(task => <ListedTask 
            key={task.id} 
            task={task} 
            appendMode={appendMode} 
            handleTaskClick={handleTaskClick}
            handleSave={handleSave}
            handleAppend={handleAppend}
            savedTaskToAppend={savedTaskToAppend}
            setGreet={setGreet}
            setNotification={setNotification}
        />)}
    </>
}

const ActiveList = ({
    appendMode, 
    savedTaskToAppend, 
    setAppendMode, 
    setSavedTaskToAppend,
    setGreet,
    setNotification,
}) => {
    const [viewRootTasks, setViewRootTasks] = useState(true)
    const [subtasksOf, setSubtasksOf] = useState()
    const [location, setLocation] = useState([])
    const rootTasks = useQuery(ALL_ROOT_TASKS)
    const [saveTask] = useMutation(SAVE_TASK, {
        refetchQueries: [{query: ORPHAN_SAVED_TASKS}]
    })

    let tasksToRender = []

    if(viewRootTasks && !rootTasks.loading && rootTasks.data){
        tasksToRender = rootTasks.data.allRootTasks
    }

    const handleBackToRoot = () => {
        setLocation([])
        setViewRootTasks(true)
        setSubtasksOf(null)
    }
    const handleTaskClick = (task) => {
        if(task.subtasks.length > 0){
            setLocation(location.concat(task))
            setSubtasksOf(task)
            setViewRootTasks(false)
        }
    }
    const handleSave = (id, title) => {
        setNotification(`Saved: ${title.substring(0,40)}`)
        saveTask({variables: {id:id}})
    }
    const handleAppend = () => {
        setAppendMode(false)
        setSavedTaskToAppend(null)
    }

    const handleNavigateToTask = (task) => {
        if(task.subtasks.length > 0){
            const taskIndex = location.findIndex(taskIterate => taskIterate.id === task.id)
            setLocation(location.slice(0,taskIndex+1))
            setSubtasksOf(task)
        }
    }

    let moduleClass = "active-list module"
    if(appendMode){
        moduleClass = "active-list module highlighted"
    }

    return (  
        <div className={moduleClass}>
            <div className="title-box">
                <h3>Active Tasks</h3>
                {!viewRootTasks && <img onClick={handleBackToRoot} src={asset.arrowLeft} alt='left arrow'/>}
            </div>

            <p>{location.map(task => <span 
                key={task.id}
                onClick={()=>handleNavigateToTask(task)}>{`${task.title} > `}
            </span>)}</p>
            
            <div className="task-list">
                {viewRootTasks && tasksToRender.map(task=> <ListedTask 
                    key={task.id} 
                    task={task} 
                    appendMode={appendMode} 
                    handleTaskClick={handleTaskClick}
                    handleSave={handleSave}
                    handleAppend={handleAppend}
                    savedTaskToAppend={savedTaskToAppend}
                    setGreet={setGreet}
                    setNotification={setNotification}
                />)}
                {!viewRootTasks && <SubtaskRender
                    appendMode={appendMode} 
                    handleTaskClick={handleTaskClick}
                    handleSave={handleSave}
                    handleAppend={handleAppend}
                    subtasksOf={subtasksOf}
                    savedTaskToAppend={savedTaskToAppend}
                    setGreet={setGreet}
                    setNotification={setNotification}
                />}
            </div>
        </div>
    );
}
 
export default ActiveList;