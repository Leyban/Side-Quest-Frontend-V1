import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { asset } from '../../assets/asset';
import { DELETE_TASK, EDIT_TASK, GET_TASK_TREE, ORPHAN_SAVED_TASKS, SAVE_TASK, USER } from '../../queries';
import ReadTask from './taskRenderModes/ReadTask';
import moment from 'moment';

const TaskRender = ({
    task: propTask, 
    location = [], 
    schedules = [],
    setEditTask, 
    setNewTask,
    setTaskToEdit, 
    setTasktoEditLocation,
    taskpadTask, 
    setTaskpadTask,
    level = 1,
    setNotification,
}) => {
    // display states
    const [task, setTask] = useState(propTask)
    const [expand, setExpand] = useState(level<5 ? true : false)

    // temporal states
    const [started, setStarted] = useState(false)
    const [startTimeLeft, setStartTimeLeft] = useState('')
    const [endTimeLeft, setEndTimeLeft] = useState('')
    const [resetTimeLeft, setResetTimeLeft] = useState('')
    const dateFormat = "YYYY-MM-DDTHH:mm:ss.SSS"

    const currentLocation = location.length > 0
        ? location[location.length -1].id !== task.id 
            ? location.concat({...task})
            : location
        : location.concat({...task})
    const scheduleTree = task.scheduled 
        ? schedules.concat({...task.schedule})
        : schedules

    // apollo hooks
    const { cache } = useApolloClient();
    const [deleteTask] = useMutation(DELETE_TASK)
    const [saveTask] = useMutation(SAVE_TASK, {
        refetchQueries: [{query: ORPHAN_SAVED_TASKS}]
    })
    const [saveEditedTask] = useMutation(EDIT_TASK, {
        update(cache, {data: {updateTask}}) {
            cache.modify({
                id: cache.identify(task),
                fields: {
                    completed() { return updateTask.completed}
                }
            })
        }
    })
    const user = useQuery(USER)
    const taskTree = useQuery(GET_TASK_TREE, {variables: {id:task.id}})

    const renderSubtasks = (subtasks) => {
        if(!subtasks){
            return null
        }
        return <div className="subtask">
            {subtasks.map(subtask => <TaskRender
                key={subtask.id} 
                task={subtask} 
                location={[...currentLocation]}
                schedules={[...scheduleTree]}
                setEditTask={setEditTask}
                setTaskToEdit={setTaskToEdit}
                setTasktoEditLocation={setTasktoEditLocation}
                taskpadTask={taskpadTask}
                setTaskpadTask={setTaskpadTask}
                setNewTask={setNewTask}
                level={level+1}
                setNotification={setNotification}
            />)}
        </div>
    }

    const newTask = {
        title: '',
        description: '',
        completed: false,
        root: false,
        subtasks: [],
        supertask: task.supertask ? task.supertask.concat(task.id) : [task.id],
        scheduled: false,
        schedule:{
            category: 'hourly',
            start: moment().format(dateFormat),
            end: {
                active: false,
                date: moment().add(1, 'h').format(dateFormat),
            },
            reset:{
                active:false,
                date: moment().add(1, 'h').format(dateFormat),
            }
        },
        tag: null,
        author: user.data.me.id
    }
    const resetSchedule = (schedule) => {
        let scheduleToReset = schedule
        const endGap = (moment(scheduleToReset.end.date) - moment(scheduleToReset.start))
        const resetGap = (moment(scheduleToReset.reset.date) - moment(scheduleToReset.start))
        scheduleToReset.start = moment(scheduleToReset.reset.date).format(dateFormat)
        scheduleToReset.end = { 
            active: scheduleToReset.end.active, 
            date: moment(scheduleToReset.start).add(endGap, 'ms').format(dateFormat)
        }

        if (scheduleToReset.category === 'hourly'){
            scheduleToReset.reset = {
                active: scheduleToReset.reset.active,
                date: moment(scheduleToReset.start).add(resetGap, 'ms').format(dateFormat)
            }
        } else if (scheduleToReset.category === 'daily'){
            scheduleToReset.reset = {
                active: scheduleToReset.reset.active,
                date: moment(scheduleToReset.start).add(1, 'd').format(dateFormat)
            }
        } else if (scheduleToReset.category === 'weekly'){
            scheduleToReset.reset = {
                active: scheduleToReset.reset.active,
                date: moment(scheduleToReset.start).add(1, 'w').format(dateFormat)
            }
        } else if (scheduleToReset.category === 'monthly'){
            scheduleToReset.reset = {
                active: scheduleToReset.reset.active,
                date: moment(scheduleToReset.start).add(1, 'M').format(dateFormat)
            }
        }

        if ((moment() - moment(scheduleToReset.reset.date)) > 0){ 
            return resetSchedule(scheduleToReset) 
        }
        return scheduleToReset
    }

    const handleCheckPlease = () => {
        // Prevents sending requests if id is temporary id only
        if(task.id==='temp-id'){return}
        
        saveEditedTask({
            variables: {id: task.id, completed: !task.completed},
            optimisticResponse: {
                updateTask:{...task, completed: !task.completed}
            }
        },)
        cache.modify({
            id: `Task:${task.id}`,
            fields: {
                completed() {
                    return !task.completed
                },
            }
        })
    }

    const handleOptions = (option) => {
        // Prevents sending requests if id is temporary id only
        if(task.id==='temp-id'){return}

        if (option === 'delete') {
            // If task is a root task
            if(taskpadTask.id === task.id) {
                setTaskpadTask(null)

                if(task.root){
                    cache.updateQuery({query: USER}, data => ({
                        me: {...data.me, ongoing:data.me.ongoing.filter(ongoingId => ongoingId !== task.id)}
                    }))
                }
                
            // if task is a subtask
            } else {
                cache.modify({
                    id: `Task:${task.supertask.at(-1)}`,
                    fields: {
                      subtasks(existingSubtaskRefs, { readField }) {
                        return existingSubtaskRefs.filter(
                          subtaskRef => task.id !== readField('id', subtaskRef)
                        );
                      },
                    },
                })
            }

            // Deleting from the cache
            cache.evict({id:`Task:${task.id}`})
            cache.gc()

            // Sending delete request
            setNotification(`Deleted: ${task.title.substring(0,40)}`)
            deleteTask({variables: { id:task.id }})

        } else if (option === 'edit') {
            setTaskToEdit(task)
            setTasktoEditLocation(location)
            setEditTask(true)
        } else if (option === 'save') {
            setNotification(`Saved: ${task.title.substring(0,40)}`)
            saveTask({variables: { id: task.id }})
        } else if (option === 'add') {
            setTaskToEdit({...newTask})
            setTasktoEditLocation(currentLocation)
            setNewTask(true)
        }
    }

    const handleExpand = () => {
        if (level>4){
            setTaskpadTask(task, currentLocation)
        } else {
            setExpand(!expand)
        }
    }

    // auto-update render 
    useEffect(()=> {
        if (!taskTree.loading && taskTree.data && taskTree.data.taskTree !== task) {
            setTask({...taskTree.data.taskTree})

            if(level === 1){
                setTaskpadTask(taskTree.data.taskTree, currentLocation)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[taskTree.data])

    // workstation taskpad Listener
    useEffect(()=>{
        if(level===1 && task.id !== propTask.id){
            setTask(propTask)
        }
        if (task.id === taskpadTask.id) {
            setExpand(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[propTask, task])


    // temporal manager
    useEffect(()=>{
    if (task.scheduled){
        if (moment.duration(moment().diff(moment(task.schedule.start))) < 0 ){
            setStarted(false)
            setStartTimeLeft(`Starts ${moment(task.schedule.start).fromNow()}`)
        } else {
            setStarted(true)
            if (task.schedule.end.active) {
                if (moment.duration(moment().diff(moment(task.schedule.end.date))) < 0) {
                    setEndTimeLeft(`Ends ${moment(task.schedule.end.date).fromNow()}`)
                } else { setEndTimeLeft(`Ended ${moment(task.schedule.end.date).fromNow()}`) }
            }
            if (task.schedule.reset.active) {
                if (moment.duration(moment().diff(moment(task.schedule.reset.date))) < 0 ){
                    setResetTimeLeft(`Resets ${moment(task.schedule.reset.date).fromNow()}`)
                } else { 
                    const scheduleCopy = {
                        category: task.schedule.category,
                        start: task.schedule.start,
                        end: {
                            active: task.schedule.end.active,
                            date: task.schedule.end.date
                        },
                        reset: {
                            active: task.schedule.reset.active,
                            date: task.schedule.reset.date
                        },
                    }
                    const newSchedule = resetSchedule({...scheduleCopy}) 
                    saveEditedTask({variables: {id: task.id, schedule: newSchedule, completed: false}})
                    cache.modify({
                        id: `Task:${task.id}`,
                        fields: {
                            schedule() {return newSchedule},
                            completed() {return false}
                        }
                    })
                }
            }
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task.schedule, task.scheduled])

    return (
        <div className="task">
            <div className="check-and-line">
                <div className="checkbox" onClick={handleCheckPlease}>
                    {task.id === 'temp-id' && <img className='loading' src={asset.loading} alt='loading' />}
                    {task.completed && <img src={asset.check} alt="check" />}
                </div>
                {expand && task.subtasks && task.subtasks.length>0 ? <div className="line"></div> : null}
            </div>
            <div className="task-content">
                <ReadTask 
                    task={task} 
                    expand={expand} 
                    started={started}
                    startTimeLeft={startTimeLeft}
                    endTimeLeft={endTimeLeft}
                    resetTimeLeft={resetTimeLeft}
                    handleExpand={handleExpand}
                    handleOptions={handleOptions}
                />
            </div>
            {expand && renderSubtasks(task.subtasks)}
        </div>
    );
};

export default TaskRender;