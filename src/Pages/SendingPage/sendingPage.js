import React from 'react'
import { useSelector } from 'react-redux'

const SendingPage = () => {
  const{editTemplate}=useSelector((state)=>state.template)
  console.log(editTemplate)
  return (
    <div>
      {JSON.stringify(editTemplate)}
    </div>
  )
}

export default SendingPage
