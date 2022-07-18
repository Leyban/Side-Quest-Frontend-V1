import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { asset } from "../assets/asset";
import { SIGNUP } from "../queries";

const SignupForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [invalid, setInvalid] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [signup, result] = useMutation(SIGNUP, {
        onError: (error)=> {
            console.log(error.graphQLErrors);
            setErrorMessage('Username already exists')
            setInvalid(true)
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        setInvalid(true)
        if(!username){
            setErrorMessage('Username is required')
        } else if (username < 4){
            setErrorMessage('Username has to be at least 4 characters long')
        } else if (!name){
            setErrorMessage('Please enter your name')
        }else if (!password){
            setErrorMessage('Password is required')
        } else if (password.length < 6) {
            setErrorMessage('Password has to be at least 6 characters long')
        } else if (!email){
            setErrorMessage('Enter an email address')
        } else if (!emailRegexp.test(email)){
            setErrorMessage('Invalid email')
        } else {
            setInvalid(false)
            signup({ variables: { username, password, name, email } });
        }
    };
    const handleCancel = () => {
        setUsername('')
        setPassword('')
        setName('')
        setEmail('')
        setInvalid(false)
        props.setView('login')
    }

    useEffect(()=>{
        if (result.data) {
            props.setView('login')
            setUsername('')
            setPassword('')
            setName('')
            setEmail('')
            setInvalid(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[result.data])

    return (  
        <div className="signup">
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
                <h3>Name</h3>
                <input 
                    type="text" 
                    value={name}
                    onChange={({target}) => setName(target.value)}
                    placeholder='Enter your name'
                />
                <h3>Email</h3>
                <input 
                    type="email" 
                    value={email}
                    onChange={({target}) => setEmail(target.value)}
                    placeholder='Enter your email address'
                />
                <h3>Password</h3>
                <input 
                    type="password" 
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    placeholder='Enter your password'
                />
                {invalid && <p>{errorMessage}</p>}
                <div className="signup-options">
                    <button onClick={handleCancel}>Cancel</button>  
                    <button onClick={handleSubmit}>Sign up</button>  
                </div>
            </form>
        </div>
    );
}
 
export default SignupForm;