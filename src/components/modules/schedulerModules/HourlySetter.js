import { useEffect, useState } from 'react';
import Dropdown from '../../subcomponents/Dropdown';
import Radio from '../../subcomponents/Radio';
import moment from 'moment';

const HourlySetter = ({ schedule, setSchedule }) => {
    const [startHour, setStartHour] = useState(moment(schedule.start).format('h'));
    const [startMinute, setStartMinute] = useState(moment(schedule.start).format('m'));
    const [startMeridiem, setStartMeridiem] = useState(moment(schedule.start).format('A'));

    const [ends, setEnds] = useState(schedule.end.active);
    const [endHour, setEndHour] = useState(moment.duration(moment(schedule.end.date).diff(moment(schedule.start))).hours());
    const [endMinute, setEndMinute] = useState(moment.duration(moment(schedule.end.date).diff(moment(schedule.start))).minutes());

    const [resets, setReset] = useState(schedule.reset.active);
    const [resetHour, setResetHour] = useState(moment.duration(moment(schedule.reset.date).diff(moment(schedule.start))).hours());
    const [resetMinute, setResetMinute] = useState(moment.duration(moment(schedule.reset.date).diff(moment(schedule.start))).minutes());

    useEffect(() => {
        const dateFormat = "YYYY-MM-DDTHH:mm:ss.SSS"
        const newSchedule = {
            category: 'hourly',
            start: moment(`${startHour} ${startMinute} ${startMeridiem}`, 'hh mm A').format(dateFormat),
            end: {
                active: ends,
                date: moment(`${startHour} ${startMinute} ${startMeridiem}`, 'hh mm A').add(endHour, 'h').add(endMinute, 'm').format(dateFormat),
            },
            reset: {
                active: resets,
                date: moment(`${startHour} ${startMinute} ${startMeridiem}`, 'hh mm A').add(resetHour, 'h').add(resetMinute, 'm').format(dateFormat),
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
        resets,
        resetHour,
        resetMinute,
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
                    <Dropdown options={24} value={endHour} setValue={setEndHour} /><span>hr</span>
                    
                    <Dropdown options={59} value={endMinute} setValue={setEndMinute} /><span>min</span>
                </div>
            )}

            <div className="title">
                <p>reset</p>
                <Radio value={resets} setValue={setReset} />
            </div>
            {resets && (
                <div className="set-time">
                    <Dropdown options={24} value={resetHour} setValue={setResetHour} /><span>hr</span>
                    
                    <Dropdown options={59} value={resetMinute} setValue={setResetMinute} /><span>min</span>
                </div>
            )}
        </div>
    );
};

export default HourlySetter;
