import TaskList from "./subModules/TaskList";

const AllTasks = ({nameFilter, tagFilter, completeFilter, ongoingFilter, setTaskToPass, setView}) => {
    const handleTaskClick = (task) => {
        setTaskToPass(task)
        setView('workStation')
    }
    return (  
        <div className="all-task-list">
            <div className="title-box">
                <p>Task</p>
                <p>Ongoing</p>
                <p>Tag</p>
            </div>
            <div className="task-list-container">
                <TaskList
                    ongoingFilter={ongoingFilter} 
                    nameFilter={nameFilter} 
                    tagFilter={tagFilter}
                    completeFilter={completeFilter}
                    ongoingColumn={true}
                    setTask={handleTaskClick}
                    pickOneIfEmpty={false}
                />
            </div>
        </div>
    );
}
  
export default AllTasks;