import { useState } from "react";
import { asset } from "../assets/asset";
import ActiveList from "./modules/ActiveList";
import SavedTaskList from "./modules/subModules/SavedTaskList";

const SavedTaskView = ({setGreet, setNotification}) => {
    const [mainTaskNameFilter, setMainTaskNameFilter] = useState('')
    const [subTaskNameFilter, setSubTaskNameFilter] = useState('')

    const [appendMode, setAppendMode] = useState(false)
    const [savedTaskToAppend, setSavedTaskToAppend] = useState()

    const handleCancel = () => {
        setAppendMode(false)
        setSavedTaskToAppend(null)
        setGreet('Side Quest HQ')
    }

    return (  
        <div className="saved-tasks">
            <div className="main-task-list module">
                <div className="title-box">
                    <h3>Tasks</h3>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={mainTaskNameFilter}
                            onChange={({target})=>setMainTaskNameFilter(target.value)}
                            placeholder="Search"
                        />
                        <img src={asset.search} alt="magnifying glass" />
                    </div>
                </div>
                <SavedTaskList 
                    nameFilter={mainTaskNameFilter} 
                    rootTaskFilter={true}
                    setGreet={setGreet}
                    setNotification={setNotification}
                />
            </div>
            <div className="subtask-list module">
                <div className="title-box">
                    <h3>Subtasks</h3>
                    {appendMode && <div className="cancel-button" onClick={handleCancel}>cancel</div>}
                    {!appendMode && <div className="search-bar">
                        <input 
                            type="text" 
                            value={subTaskNameFilter}
                            onChange={({target})=>setSubTaskNameFilter(target.value)}
                            placeholder="Search"
                        />
                        <img src={asset.search} alt="magnifying glass" />
                    </div>}
                </div>
                <SavedTaskList 
                    savedTaskToAppend={savedTaskToAppend}
                    setSavedTaskToAppend={setSavedTaskToAppend}
                    nameFilter={subTaskNameFilter} 
                    rootTaskFilter={false}
                    setAppendMode={setAppendMode}
                    setGreet={setGreet}
                    setNotification={setNotification}
                />
            </div>
            
            <ActiveList 
                appendMode={appendMode} 
                savedTaskToAppend={savedTaskToAppend} 
                setAppendMode={setAppendMode}
                setSavedTaskToAppend={setSavedTaskToAppend}
                setGreet={setGreet}
                setNotification={setNotification}
            />
        </div>
    );
}
 
export default SavedTaskView;