import React, { useState } from 'react'

const UserLogin = () => {
    const [userLogin,setUserLogin] = useState(
        {
            email:'',
            password:''
        }
    )
    const login = () =>{
      alert('logged')
    }
  return (
    <div>
      <h2>User Login </h2>
      <h4>{JSON.stringify(userLogin)}</h4>
      <div>
        <label>
            User Email:
        </label>
        <input type='email' placeholder='Enter you email' 
        onKeyUp={(e)=>setUserLogin({...userLogin,email:e.target.value})}/>
      </div>
      <div>
        <label>
            User password:
        </label>
        <input type='password' placeholder='Enter you email' 
        onKeyUp={(e)=>setUserLogin({...userLogin,password:e.target.value})}/>
      </div>
      <div>
        <button type='button' onClick={login}>
          Login
        </button>
      </div>
    </div>
  )
}

export default UserLogin
