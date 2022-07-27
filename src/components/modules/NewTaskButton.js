import { asset } from "../../assets/asset";
import moment from "moment";

const NewTaskButton = ({setNewTask, setTask, userId}) => {
    const newTask = {
        title: '',
        description: '',
        completed: false,
        root: true,
        supertask:[],
        subtasks: [],
        scheduled: false,
        schedule:{
            category: 'hourly',
            start: moment().format(),
            end: {
                active: false,
                date: moment().add(1, 'h').format(),
            },
            reset:{
                active:false,
                date: moment().add(1, 'h').format(),
            }
        },
        tag: null,
        author: userId
    }
    const handleClick = () => {
        setTask({...newTask})
        setNewTask(true)
    }

    return (  
        <div className="new-task" onClick={handleClick}>
            New Task <img src={asset.greenPlus} alt="plus" />
        </div>
    );
}
 
export default NewTaskButton;