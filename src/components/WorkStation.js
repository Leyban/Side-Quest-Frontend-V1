import { useState } from "react";
import NewTaskButton from "./modules/NewTaskButton";
import TaskRender from "./modules/TaskRender";
import EditTask from "./modules/EditTask";
import OngoingList from "./modules/OngoingList";
import TagFilter from "./modules/TagFilter";
import Radio from "./subcomponents/Radio";

const WorkStation = ({user, taskToPass, setTaskToPass, setGreet, setNotification}) => {
    // taskpad states
    const [task, setTask] = useState(taskToPass ? {...taskToPass} : null)
    const [taskLocation, setTaskLocation] = useState([])
    const [taskToEdit, setTaskToEdit] = useState()
    const [tasktoEditLocation, setTasktoEditLocation] = useState([])
    const [newTask, setNewTask] = useState(false)
    const [editTask, setEditTask] = useState(false)

    // tag filter states
    const [colorPickerMode, setColorPickerMode] = useState(false)
    const [tagFilter, setTagFilter] = useState(null)

    // complete filter states
    const [completeFilter, setCompleteFilter] = useState('All')

    // clear parent passed task
    setTimeout(() => {
        setTaskToPass(null)
    }, 0);

    const setTaskpadTask = (task, location = []) => {
        setTask(task)
        setTaskLocation(location)
    }

    const handleNavigateLocation = (taskNavigate) => {
        const taskIndex = taskLocation.findIndex(taskIterate => taskIterate.id === taskNavigate.id)
        setTaskLocation(taskLocation.slice(0,taskIndex+1))
        setTask(taskNavigate)
    }

    if (!user.data || !user.data.me){
        return null
    }

    return (
        <div className="work-station">
            <div className="taskpad module">
                {((!newTask && !editTask) && task ) && <>
                    {taskLocation.length>0 && <p>
                        {taskLocation.map(taskIterate=> <span key={taskIterate.id} onClick={()=>handleNavigateLocation(taskIterate)}>
                            {`${taskIterate.title} > `}
                        </span>)}
                    </p>}
                    
                    <TaskRender 
                        task={task} 
                        location={taskLocation} 
                        setEditTask={setEditTask} 
                        setTaskToEdit={setTaskToEdit}
                        setTasktoEditLocation={setTasktoEditLocation}
                        user={user} 
                        setTaskpadTask={setTaskpadTask}
                        taskpadTask={task}
                        setNewTask={setNewTask}
                        level={1}
                        setGreet={setGreet} 
                        setNotification={setNotification}
                    />
                </>}
                {editTask && <EditTask 
                    task={taskToEdit} 
                    setTask={setTaskToEdit} 
                    setFalseToExit={setEditTask} 
                    location={tasktoEditLocation}
                    user={user}
                    taskpadTask={task}
                    setNotification={setNotification}
                />}
                {newTask && <EditTask 
                    task={taskToEdit} 
                    setTask={setTaskToEdit} 
                    setFalseToExit={setNewTask} 
                    creatingNewTask={true} 
                    location={tasktoEditLocation}
                    user={user} 
                    taskpadTask={task}
                    setNotification={setNotification}
                />}
            </div>
            
            {!colorPickerMode && <>
                <div className="complete-filter module">
                    <h3>Complete</h3>
                    <Radio options={['All']} value={completeFilter} setValue={setCompleteFilter} padding={'6px calc(3vw - 15px)'} borderRadius={'7px'}/>
                </div>
                <div className="new-task-button module">
                    <NewTaskButton setTask={setTaskToEdit} userId={user.data.me.id} setNewTask={setNewTask} />
                </div>
            </>}
            
            <TagFilter colorPickerMode={colorPickerMode} setColorPickerMode={setColorPickerMode} tagFilter={tagFilter} setTagFilter={setTagFilter}/>

            <OngoingList task={task} setTask={setTaskpadTask} tagFilter={tagFilter} completeFilter={completeFilter}/>
        </div>
    );
}
 
export default WorkStation;