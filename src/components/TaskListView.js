import { useState } from "react";
import { asset } from "../assets/asset";
import AllTasks from "./modules/AllTasks";
import TagFilter from "./modules/TagFilter";
import Radio from "./subcomponents/Radio";

const TaskListView = ({setTaskToPass, setView}) => {
    // Radio filters
    const [ongoingFilter, setOngoingFilter] = useState('All')
    const [completeFilter, setCompleteFilter] = useState('All')

    // tag filter states
    const [colorPickerMode, setColorPickerMode] = useState(false)
    const [tagFilter, setTagFilter] = useState(null)

    // search state
    const [nameFilter, setNameFilter] = useState('')

    return (  
        <div className="task-list-view">
            <div className="searchbar module">
                <div className="search-input">
                    <img src={asset.search} alt="magnifying glass" />
                    <input 
                        type="text" 
                        placeholder="Search"
                        value={nameFilter}
                        onChange={({target})=>setNameFilter(target.value)}
                    />
                </div>
            </div>

            <div className="task-list module">
                <AllTasks 
                    nameFilter={nameFilter} 
                    ongoingFilter={ongoingFilter} 
                    completeFilter={completeFilter} 
                    tagFilter={tagFilter} 
                    setTaskToPass={setTaskToPass}
                    setView={setView}
                />
            </div>
            
            <TagFilter colorPickerMode={colorPickerMode} setColorPickerMode={setColorPickerMode} tagFilter={tagFilter} setTagFilter={setTagFilter}/>

            {!colorPickerMode && <>
                <div className="ongoing-completed-filter module">
                    <h3>Ongoing</h3>
                    <Radio options={['All']} value={ongoingFilter} setValue={setOngoingFilter} padding={'6px calc(2.8vw - 15px)'} borderRadius={'7px'}/>
                    <h3>Complete</h3>
                    <Radio options={['All']} value={completeFilter} setValue={setCompleteFilter} padding={'6px calc(2.8vw - 15px)'} borderRadius={'7px'}/>
                </div>
            </>}
        </div>
    );
}
 
export default TaskListView;