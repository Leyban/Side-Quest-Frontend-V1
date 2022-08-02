import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { asset } from "../../../assets/asset";
import { ADD_ONGOING, ALL_ROOT_TASKS, ALL_TAGS, REMOVE_ONGOING, USER } from "../../../queries";
import Tag from "../../subcomponents/Tag";


const ListedTask = ({task, selectedTask, setTask, tags, ongoingColumn}) => {
    const user = useQuery(USER)
    const [isOngoing, setIsOngoing] = useState(user.data.me.ongoing.includes(task.id))
    const [addToOngoingList] = useMutation(ADD_ONGOING, {
        update(cache){
            cache.modify({
                id: cache.identify(user.data.me),
                fields:{
                    ongoing(){return user.data.me.ongoing.concat(task.id)}
                }
            })
        }
    })
    const [removeFromOngoingList] = useMutation(REMOVE_ONGOING, {
        update(cache){
            cache.updateQuery({ query: USER }, data => ({
                me: {...data.me, ongoing: data.me.ongoing.filter(ongoingId => ongoingId !== task.id) }
            }))
        }
    })
    const highlightedStyle = {
        color: '#449884'
    }
    const renderTag = (tagId) => {
        const tagDetails = tags.data.allTags.find(tag => tag.id === tagId)
        if(tagDetails){
            return <Tag tag={{color:tagDetails.color}}/>
        }
    }
    const handleFlag = () => {
        if(user.data.me.ongoing.includes(task.id)){
            setIsOngoing(false)
            return removeFromOngoingList({
                variables: {id: task.id},
                optimisticResponse: {
                    removeOngoing:{}
                }
            })
        }
        setIsOngoing(true)
        return addToOngoingList({
            variables: {id: task.id},
            optimisticResponse: {
                addOngoing:{}
            }
        })
    }

    return <div className="listed-task">
        <div className="unclickable-checkbox">
            {task.id === 'temp-id' && <img className='loading' src={asset.loading} alt='loading' />}
            {task.completed && <img src={asset.check} alt='check' />}
        </div>
        <div className="task-details" >
            {selectedTask 
                ? task.id === selectedTask.id 
                    ? <span style={highlightedStyle}>{task.title}</span>
                    : <span onClick={()=>setTask(task)}>{task.title}</span>
                : <span onClick={()=>setTask(task)}>{task.title}</span>
            }

            {ongoingColumn && <div className={isOngoing? 'ongoing' : 'not-ongoing'}>
                <img src={asset.greenFlag} alt='green flag' onClick={handleFlag} />
            </div>}

            {task.tag && renderTag(task.tag)}
        </div>
    </div>
}


const TaskList = ({
    task : selectedTask,
    setTask = (()=>{}),
    ongoingColumn = false, 
    nameFilter, 
    tagFilter, 
    completeFilter, 
    ongoingFilter,
    pickOneIfEmpty = true
    }) => {
    const rootTasks = useQuery(ALL_ROOT_TASKS)
    const user = useQuery(USER)
    const tags = useQuery(ALL_TAGS)
    let tasksToRender = []

    const filterTasks = () => {
        const filterRegex = new RegExp(`${nameFilter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`)
        const userOngoingList = user.data.me.ongoing
        let filteredByTags = []

        // Filtering the list
        if (!tagFilter) {
            filteredByTags = rootTasks.data.allRootTasks
        } else {
            filteredByTags = rootTasks.data.allRootTasks.filter(task => task.tag === tagFilter)
        }
        tasksToRender = filteredByTags.filter(task => filterRegex.test(task.title))
        if (typeof ongoingFilter === 'boolean') {
            tasksToRender = tasksToRender.filter(task => userOngoingList.includes(task.id) === ongoingFilter)
        }
        if (typeof completeFilter === 'boolean') {
            tasksToRender = tasksToRender.filter(task => task.completed === completeFilter)
        }
    }

    if (!rootTasks.loading && rootTasks.data){
        filterTasks()
        if (!selectedTask && pickOneIfEmpty){
            setTimeout(() => {
                setTask(tasksToRender[0])
            }, 0);
        }
    }


    if (rootTasks.loading || user.loading || !user.data.me || tags.loading){
        return null
    }

    return (
        <div className="task-list">
            {tasksToRender.map(task => <ListedTask 
                key={task.id}
                task={task} 
                ongoingColumn={ongoingColumn}
                userOngoingList={user.data.me.ongoing}
                selectedTask={selectedTask} 
                setTask={setTask}
                tags={tags}
            />)}
        </div>
    );
}
 
export default TaskList;