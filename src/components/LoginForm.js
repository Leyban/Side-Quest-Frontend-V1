import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { asset } from "../assets/asset";
import { LOGIN } from "../queries";

const LoginForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalid, setInvalid] = useState(false)
    const [login, result] = useMutation(LOGIN, {
        onError: (error)=> {
            console.log(error.graphQLErrors[0].message);
            setInvalid(true)
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        login({ variables: { username, password } });
    };
    const handleSignup = () => {
        props.setView('signup')
    }

    useEffect(()=>{
        if (result.data) {
            const token = result.data.login.value;
            props.setToken(token);
            localStorage.setItem('SideQuest_HQ_Login_Info', token);
            setUsername('');
            setPassword('');
            setInvalid(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[result.data])

    return (  
        <div className="login">
            <div className="logo">
                <img src={asset.sideQuestFullLogo} alt="logo" />
            </div>
            <form onSubmit={handleSubmit}>
                <h3>Username</h3>
                <input 
                    type="text" 
                    value={username}
                    onChange={({target}) => setUsername(target.value)}
                    placeholder='Enter your username'
                />
                <h3>Password</h3>
                <input 
                    type="password" 
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    placeholder='Enter your password'
                />
                {invalid && <p>Incorrect username or password</p>}
                <div className="login-options">
                    <button onClick={handleSubmit}>Log in</button>
                    <button onClick={handleSignup}>Sign up</button>  
                </div>
                
            </form>
        </div>
    );
}
 
export default LoginForm;