import { useState } from "react";
import Dropdown from "../subcomponents/Dropdown";
import Radio from "../subcomponents/Radio";
import HourlySetter from "./schedulerModules/HourlySetter";
import DailySetter from "./schedulerModules/DailySetter";
import WeeklySetter from "./schedulerModules/WeeklySetter";
import MonthlySetter from "./schedulerModules/MonthlySetter";

const Scheduler = ({schedule, setSchedule, scheduled, setScheduled}) => {
    const [type, setType] = useState(schedule.category)

    return (  
        <div className="scheduler">
            <p>Scheduled</p>
            <Radio value={scheduled} setValue={setScheduled} />
            {scheduled && <>
                <p>type</p>
                <Dropdown options={['hourly', 'daily', 'weekly', 'monthly']} value={type} setValue={setType} />

                {type==='hourly' && <HourlySetter schedule={schedule} setSchedule={setSchedule} />}
                {type==='daily' && <DailySetter schedule={schedule} setSchedule={setSchedule} />}
                {type==='weekly' && <WeeklySetter schedule={schedule} setSchedule={setSchedule} />}
                {type==='monthly' && <MonthlySetter schedule={schedule} setSchedule={setSchedule} />}
            </>}
        </div>
    );
}
 
export default Scheduler;