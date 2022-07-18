import moment from "moment";
import { useEffect, useState } from "react";
import Dropdown from "../../subcomponents/Dropdown";
import Radio from "../../subcomponents/Radio";

const MonthlySetter = ({ schedule, setSchedule }) => {
    // Extracting Saved Date from Miliseconds format
    const startDate = moment(schedule.start).format("YYYY-MM-DDTHH:mm:ss.SSS")
    const startDateNumber = startDate.substring(startDate.length -2)
    let startDayOfMonth = Number(startDateNumber)
    if(Number(startDateNumber) > 31) {
        startDayOfMonth = 31
    } else if(Number(startDateNumber) === 0) {
        startDayOfMonth = 1
    }

    // Extracting Saved Date from Miliseconds format
    const endDate = moment(schedule.end.date).format("YYYY-MM-DDTHH:mm:ss.SSS")
    const endDateNumber = endDate.substring(endDate.length -2)
    let endDayOfMonth = Number(endDateNumber)
    if(Number(endDateNumber) > 31) {
        endDayOfMonth = 31
    } else if(Number(endDateNumber) === 0) {
        endDayOfMonth = 1
    }

    const [startDay, setStartDay] = useState(startDayOfMonth)

    const [ends, setEnds] = useState(schedule.end.active);
    const [endDay, setEndDay] = useState(endDayOfMonth)

    const [resets, setReset] = useState(schedule.reset.active);

    useEffect(() => {
        const now = moment()
        const newSchedule = {
            category: 'monthly',
            start: moment([now.format('YYYY'),0,startDay,0,0,0,startDay]).month(Number(now.format('MM')) -1).format("YYYY-MM-DDTHH:mm:ss.SSS"),
            end: {
                active: ends,
                date: moment([now.format('YYYY'),0,endDay,23,59,59,Number(endDay)+900]).month(Number(now.format('MM')) -1).format("YYYY-MM-DDTHH:mm:ss.SSS"),
            },
            reset: {
                active: resets,
                date: moment([now.format('YYYY'),0,startDay,0,0,0,startDay]).month(Number(now.format('MM'))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
            }
        }
        if (moment.duration(moment().diff(moment(newSchedule.start))) > 0 
            && moment.duration(moment().diff(moment(newSchedule.end.date))) > 0) {
                newSchedule.start = moment([now.format('YYYY'),0,startDay,0,0,0,startDay]).month(Number(now.format('MM'))).format("YYYY-MM-DDTHH:mm:ss.SSS")
                newSchedule.end = {
                    active: ends,
                    date: moment([now.format('YYYY'),0,endDay,23,59,59,Number(endDay)+900]).month(Number(now.format('MM'))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                }
                newSchedule.reset = {
                    active: resets,
                    date: moment([now.format('YYYY'),0,startDay,0,0,0,startDay]).month(Number(now.format('MM')) +1).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                }
        }
        setSchedule(newSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        startDay,
        ends,
        endDay,
        resets,
    ]);

    return (
        <div className="time-set-container">
            <div className="title">
                <p>start</p>
                <div className="set-time">
                    <Dropdown options={31} value={startDay} setValue={setStartDay} zero={false}/>
                </div>
            </div>
            
            <div className="title">
                <p>end</p>
                <Radio value={ends} setValue={setEnds} />
            </div>
            {ends && (
                <div className="set-time">
                    <Dropdown options={31} value={endDay} setValue={setEndDay} zero={false}/>
                </div>
            )}

            <div className="title">
                <p>reset</p>
                <Radio value={resets} setValue={setReset} />
            </div>
        </div>
    );
};
 
export default MonthlySetter;