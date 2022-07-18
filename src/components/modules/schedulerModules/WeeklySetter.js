import moment from "moment";
import { useEffect, useState } from "react";
import Radio from "../../subcomponents/Radio";

const WeeklySetter = ({ schedule, setSchedule }) => {
    const weekdays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']
    const [startDay, setStartDay] = useState(moment(schedule.start).day())

    const [ends, setEnds] = useState(schedule.end.active);
    const [endDay, setEndDay] = useState(moment(schedule.end.date).day())

    const [resets, setReset] = useState(schedule.reset.active);

    useEffect(() => {
        const dateFormat = "YYYY-MM-DDTHH:mm:ss.SSS"
        const newSchedule = {
            category: 'weekly',
            start: moment().startOf('d').day(startDay).format(dateFormat),
            end: {
                active: ends,
                date: endDay < startDay
                    ? moment().endOf('d').day(endDay +7).format(dateFormat)
                    : moment().endOf('d').day(endDay).format(dateFormat)
            },
            reset: {
                active: resets,
                date: moment().startOf('d').day(startDay +7).format(dateFormat),
            }
        }
        if (moment.duration(moment().diff(moment(newSchedule.start))) > 0 
            && moment.duration(moment().diff(moment(newSchedule.end.date))) > 0) {
                newSchedule.start = moment().startOf('d').day(startDay +7).format(dateFormat)
                newSchedule.end = {
                    active: ends,
                    date: endDay < startDay
                        ? moment().endOf('d').day(endDay +14).format(dateFormat)
                        : moment().endOf('d').day(endDay +7).format(dateFormat)
                }
                newSchedule.reset = {
                    active: resets,
                    date: moment().startOf('d').day(startDay +14).format(dateFormat),
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
                <div className="set-week">
                    <Radio options={weekdays} value={weekdays[startDay]} setValue={(day)=>setStartDay(weekdays.indexOf(day))} padding={'6px 10px'} />
                </div>
            </div>
            
            <div className="title">
                <p>end</p>
                <Radio value={ends} setValue={setEnds} />
            </div>
            {ends && (
                <div className="set-week">
                    <Radio options={weekdays} value={weekdays[endDay]} setValue={(day)=>setEndDay(weekdays.indexOf(day))} padding={'6px 10px'} />
                </div>
            )}

            <div className="title">
                <p>reset</p>
                <Radio value={resets} setValue={setReset} />
            </div>
        </div>
    );
};
 
export default WeeklySetter;