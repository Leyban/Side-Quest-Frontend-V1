import { useMutation, useQuery } from "@apollo/client"
import { asset } from "../../../assets/asset"
import { ALL_ROOT_TASKS, DELETE_SAVED_TASK, MATERIALIZE_TASK, ORPHAN_SAVED_TASKS } from "../../../queries"


const ListedTask = ({
    task, 
    selectedTask, 
    setAppendMode, 
    rootTaskFilter, 
    setSavedTaskToAppend,
    setGreet,
    setNotification,
}) => {
    const [deleteSavedTask] = useMutation(DELETE_SAVED_TASK, {
        refetchQueries: [{query: ORPHAN_SAVED_TASKS}]
    })
    const [materializeTask] = useMutation(MATERIALIZE_TASK, {
        refetchQueries: [{ query: ALL_ROOT_TASKS}]
    })

    const handleDelete = () => {
        setNotification(`Deleted: ${task.title.substring(0,40)}`)
        deleteSavedTask({variables: {id: task.id}})
    }
    const handleMaterialize = () => {
        if(!rootTaskFilter){
            setAppendMode(true)
            setGreet('Select a task to add selected subtask')
            setSavedTaskToAppend(task)
        } else {
            setNotification(`Added: ${task.title.substring(0,40)}`)
            materializeTask({variables: {id: task.id}})
        }
    }
    
    const highlightedStyle = {
        color: '#449884'
    }
    
    return <div className="listed-task">
        <div className="task-details" >
            {selectedTask 
                ? task.id === selectedTask.id 
                    ? <span style={highlightedStyle}>{task.title}</span>
                    : <span>{task.title}</span>
                : <span>{task.title}</span>
            }
        </div>
        <div className="options">
            <img src={asset.redCross} alt="red cross" onClick={handleDelete}/>
            <img src={asset.curvedArrow} alt="curved arrow" onClick={handleMaterialize}/>
        </div>
    </div>
}

const SavedTaskList = ({
    savedTaskToAppend = null,
    setSavedTaskToAppend = ()=>{},
    nameFilter, 
    rootTaskFilter = true,
    setAppendMode,
    setGreet,
    setNotification,
}) => {
    const orphanTasks = useQuery(ORPHAN_SAVED_TASKS)
    let tasksToRender = []

    const filterTasks = () => {
        const filterRegex = new RegExp(`${nameFilter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`)
        let allTasks = orphanTasks.data.orphanSavedTasks
        tasksToRender = allTasks.filter(task => task.root === rootTaskFilter)
        if(nameFilter){
            tasksToRender = tasksToRender.filter(task => filterRegex.test(task.title))
        }
    }

    if (!orphanTasks.loading && orphanTasks.data){
        filterTasks()
    }

    if (orphanTasks.loading){
        return null
    }

    return (
        <div className="task-list">
            {tasksToRender.map(task => <ListedTask 
                key={task.id}
                task={task} 
                selectedTask={savedTaskToAppend} 
                setSavedTaskToAppend={setSavedTaskToAppend}
                setAppendMode={setAppendMode}
                rootTaskFilter={rootTaskFilter}
                setGreet={setGreet}
                setNotification={setNotification}
            />)}
        </div>
    );
}
 
export default SavedTaskList;