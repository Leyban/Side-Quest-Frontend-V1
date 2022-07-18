import { useState } from "react";
import { asset } from "../../assets/asset";
import TaskList from "./subModules/TaskList";

const OngoingList = ({task, setTask, tagFilter, completeFilter}) => {
    const [nameFilter, setNameFilter] = useState('')

    return (  
        <div className="ongoing-list module">
            <div className="title-box">
                <h3>Ongoing Tasks</h3>
                <div className="search-bar">
                    <input 
                        type="text" 
                        value={nameFilter}
                        onChange={({target})=>setNameFilter(target.value)}
                        placeholder='Search'
                    />
                    <img src={asset.search} alt="magnifying glass" />
                </div>
            </div>
            <div className="task-list-container">
                <TaskList
                    task = {task}
                    setTask = {setTask}
                    ongoingFilter={true} 
                    nameFilter={nameFilter} 
                    tagFilter={tagFilter}
                    completeFilter={completeFilter}
                />
            </div>
        </div>
    );
}
 
export default OngoingList;