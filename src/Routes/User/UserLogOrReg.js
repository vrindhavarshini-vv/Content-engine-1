import React from 'react'
import { Link } from 'react-router-dom'

const UserLogOrReg = () => {
  return (
    <div>
      <h3>Login or Register</h3>
      <button><Link to={'/user/register'}>Register</Link></button>
      <button><Link to={'/user/login'}>Login</Link></button>
    </div>
  )
}

export default UserLogOrReg
