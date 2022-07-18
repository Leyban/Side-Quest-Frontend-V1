import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import Sidebar from "./components/Sidebar";
import './App.css'
import Broadcaster from "./components/Broadcaster";
import WorkStation from "./components/WorkStation";
import { useApolloClient, useQuery } from "@apollo/client";
import { USER } from "./queries";
import TaskListView from "./components/TaskListView";
import SavedTaskView from "./components/SavedTaskView";
import SignupForm from "./components/SignupForm";

function App() {
  const [view, setView] = useState('login')
  const [token, setToken] = useState('')
  const [greet, setGreet] = useState('Side Quest HQ')
  const [notification, setNotification] = useState('')
  const user = useQuery(USER)
  const client = useApolloClient()

  const [taskToPass, setTaskToPass] = useState()

  const handleLogout = () => {
    localStorage.removeItem('SideQuest_HQ_Login_Info')
    client.resetStore()
    setToken(null)
    setNotification('')
    setGreet('Side Quest HQ')
    setView('login')
  }

  useEffect(()=>{
    if (token){
      return setView('workStation')
    }
    setToken(localStorage.getItem('SideQuest_HQ_Login_Info'));
  }, [token])

  useEffect(()=> {
    if(!user.loading || !user.data || !user.data.me){
      user.refetch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user.data, user.loading])
  
  if (view === 'login') {
    return (
      <div className="login-page">
        <LoginForm setView={setView} token={token} setToken={setToken}/>
      </div>
    );
  } else if (view === 'signup') {
    return (
      <div className="signup-page">
        <SignupForm setView={setView} />
      </div>
    );
  }

  return(
    <div className="SideQuestApp">
      <div className="sidebar">
        <Sidebar view={view} setView={setView} user={user} handleLogout={handleLogout}/>
      </div>
      <div className="content">
        <div className="content-container">
          <Broadcaster greet={greet} notification={notification} />
          {view==='workStation' && <WorkStation user={user} taskToPass={taskToPass} setTaskToPass={setTaskToPass} setGreet={setGreet} setNotification={setNotification}/>}
          {view==='taskList' && <TaskListView setTaskToPass={setTaskToPass} setView={setView} setGreet={setGreet} setNotification={setNotification}/>}
          {view==='savedTask' && <SavedTaskView setGreet={setGreet} setNotification={setNotification}/>}
        </div>
      </div>
    </div>
  )
  
}

export default App;
