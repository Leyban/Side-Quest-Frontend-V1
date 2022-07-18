import { useEffect, useState } from "react";
import Dropdown from "../../subcomponents/Dropdown";
import Radio from "../../subcomponents/Radio";
import moment from "moment";

const DailySetter = ({ schedule, setSchedule }) => {
    const [startHour, setStartHour] = useState(moment(schedule.start).format('h'));
    const [startMinute, setStartMinute] = useState(moment(schedule.start).format('m'));
    const [startMeridiem, setStartMeridiem] = useState(moment(schedule.start).format('A'));

    const [ends, setEnds] = useState(schedule.end.active);
    const [endHour, setEndHour] = useState(moment.duration(moment(schedule.end.date).diff(moment(schedule.start))).hours());
    const [endMinute, setEndMinute] = useState(moment.duration(moment(schedule.end.date).diff(moment(schedule.start))).minutes());
    const [endMeridiem, setEndMeridiem] = useState(moment(schedule.end.date).format('A'));

    const [resets, setReset] = useState(schedule.reset.active);
    
    useEffect(() => {
        const dateFormat = "YYYY-MM-DDTHH:mm:ss.SSS"
        const newSchedule = {
            category: 'daily',
            start: moment(`${startHour} ${startMinute} ${startMeridiem}`, 'hh mm A').format(dateFormat),
            end: {
                active: ends,
                date: moment(moment(`${startHour} ${startMinute} ${startMeridiem}`, 'hh mm A')).diff(moment(`${endHour} ${endMinute} ${endMeridiem}`, 'hh mm A')) > 0 
                    ? moment(`${endHour} ${endMinute} ${endMeridiem}`, 'hh mm A').add(1, 'd').format(dateFormat)
                    : moment(`${endHour} ${endMinute} ${endMeridiem}`, 'hh mm A').format(dateFormat)
            },
            reset: {
                active: resets,
                date: moment(`${startHour} ${startMinute} ${startMeridiem}`, 'hh mm A').add(1, 'd').format(dateFormat),
            }
        }
        if (moment.duration(moment().diff(moment(newSchedule.start))) > 0  
            && moment.duration(moment().diff(moment(newSchedule.end.date))) > 0) {
                newSchedule.start = moment(newSchedule.start).add(1, 'd').format(dateFormat)
                newSchedule.end = {
                    active: ends,
                    date: moment(newSchedule.end.date).add(1, 'd').format(dateFormat)
                }
                newSchedule.reset = {
                    active: resets,
                    date: moment(newSchedule.reset.date).add(1, 'd').format(dateFormat)
                }
        }
        setSchedule(newSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        startHour,
        startMinute,
        startMeridiem,
        ends,
        endHour,
        endMinute,
        endMeridiem,
        resets,
    ]);

    return (
        <div className="time-set-container">
            <div className="title">
                <p>start</p>
                <div className="set-time">
                    <Dropdown options={12} value={startHour} setValue={setStartHour} />
                    <span>:</span>
                    <Dropdown options={59} value={startMinute} setValue={setStartMinute} />
                    <Radio options={['AM', 'PM']} value={startMeridiem} setValue={setStartMeridiem} padding={'6px 10px'} />
                </div>
            </div>
            
            <div className="title">
                <p>end</p>
                <Radio value={ends} setValue={setEnds} />
            </div>
            {ends && (
                <div className="set-time">
                    <Dropdown options={12} value={endHour} setValue={setEndHour} />
                    <span>:</span>
                    <Dropdown options={59} value={endMinute} setValue={setEndMinute} />
                    <Radio options={['AM', 'PM']} value={endMeridiem} setValue={setEndMeridiem} padding={'6px 10px'} />
                </div>
            )}

            <div className="title">
               <p>reset</p>
                <Radio value={resets} setValue={setReset} /> 
            </div>
        </div>
    );
};
 
export default DailySetter;