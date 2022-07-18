import { asset } from "../../../assets/asset";

const ReadTask = ({task, handleExpand, expand, handleOptions, started, startTimeLeft, endTimeLeft, resetTimeLeft}) => {
    return (
        <div className="detail-container">
            <div className="title-box">
                <h3>{task.title}</h3>

                <div className="button-box">
                    <div className="options">
                        <img onClick={()=>handleOptions('delete')} src={asset.redCross} alt="red x" />
                        <img onClick={()=>handleOptions('edit')} src={asset.edit} alt="edit" />
                        <img onClick={()=>handleOptions('save')} src={asset.save} alt="floppy disc" />
                        <img onClick={()=>handleOptions('add')} src={asset.greenPlus} alt="green plus" />
                    </div>
                    {!task.root && task.subtasks && task.subtasks.length>0 ? <div className="expand">
                        <img 
                            className={expand ? 'up' : 'down' }
                            src={asset.arrow} 
                            alt="arrow" 
                            onClick={handleExpand}
                        />
                    </div> : null}
                </div>
            </div>
            <p>{task.description}</p>
            {task.scheduled && <div className="schedule">
                {!started && <p>{startTimeLeft}</p>}
                {started && <>
                    {task.schedule.end.active && !task.completed && <p>{endTimeLeft}</p>}
                    {task.schedule.reset.active && <p>{resetTimeLeft}</p>}
                </>}
            </div>}
        </div>
    );
}
 
export default ReadTask;