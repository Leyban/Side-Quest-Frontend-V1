import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { asset } from "../assets/asset";
import { USER } from "../queries";

const Sidebar = ({view, setView, handleLogout}) => {
    const user = useQuery(USER)

    const [fontColor, setFontColor] = useState({
        dashboard: 'white',
        taskList: 'white',
        savedTask: 'white',
        schedule: 'white',
        workStation: '#2B5A4F',
    })

    const handleClick = (navigate) => {
        setView(navigate)

        const allWhite = {
            dashboard: 'white',
            taskList: 'white',
            savedTask: 'white',
            schedule: 'white',
            workStation: 'white',
        }
        allWhite[navigate] = '#2B5A4F'
        setFontColor({...allWhite})
    }

    useEffect(()=>{
        handleClick(view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view])

    if(user.loading || !user.data || !user.data.me){
        return null
    }

    return (
        <div className="sidebar-container">
            <h1>SQ</h1>
            <ul>
                <li style={{color:fontColor.workStation}} onClick={()=> handleClick('workStation')}>
                    Work Station
                </li>
                <li style={{color:fontColor.taskList}} onClick={()=> handleClick('taskList')}>
                    Task List
                </li>
                <li style={{color:fontColor.savedTask}} onClick={()=> handleClick('savedTask')}>
                    Saved Task
                </li>
                <img src={asset.selected} alt="selected indicator" className={view}/>
            </ul>
            <div className="user-container">
                <div className="user">
                    <div className="profile-pic">
                        <img src={asset.user} alt='faceless person'/>
                    </div>
                    {(!user.loading && user.data) && <div className="credentials">
                        <h4>{user.data.me.username.substring(0,15)}</h4>
                        <p>{user.data.me.email.substring(0,20)}</p>
                    </div>}
                </div>
                    <div className="user-options">
                        <div className="logout" onClick={handleLogout}>
                            Logout
                            <img src={asset.power} alt="power logo" />    
                        </div>
                    </div>
            </div>
            
        </div>
    );
}
 
export default Sidebar;