import axios from "axios";
import React, { useDebugValue, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

const SuperAdmin = () => {
  const [registerData, setRegisterData] = useState([]);
  const [isDisabled,setIsDisabled] = useState(false)

  const fetchRegistData = async () => {
    const getData = await axios.get(
        "https://balaramesh8265.pythonanywhere.com/getRegisterUsersData"
    );
    setRegisterData(getData.data);
  };
  console.log("registerData", registerData);

  useEffect(() => {
    fetchRegistData();
  }, []);

  const changeStatus = async (changeId) => {
    const formData = new FormData();
    const newchange = 'Approved'
    formData.append("status", newchange);
    const changeStat = await axios.put(
      `https://balaramesh8265.pythonanywhere.com/changeStatus/${changeId}`,
      formData
    ).then((res)=>{
      console.log('res',res.data)
    }).catch((error)=>{
      console.log('err',error)
    });
    fetchRegistData();
    setIsDisabled(true)
  };

 const handletoDelete = async (changeId) => {
    //   const formData = new FormData();
    // const newchange = 'Rejected'
    // formData.append("status", newchange);
    // const changeStat = await axios.put(
    //   `https://balaramesh8265.pythonanywhere.com/changeStatus/${changeId}`,
    //   formData
    // )
    const rejectedStat = await axios.delete(
      `https://balaramesh8265.pythonanywhere.com/deleteStatus/${changeId}`,
    )
    .then((res)=>{
      console.log('res',res.data) 
    })
    
  alert("The user registation rejected ")
  fetchRegistData();
  setIsDisabled(true)
 }



  return (
    <div>
      <center>
        <h2>Super Admin</h2>
      </center>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Status</th>
            <th>Approval</th>
            <th>Rejected</th>
          </tr>
        </thead>
        <tbody>
          {registerData.map((datas, index) => (
            <tr key={index}>
              <td>{datas.user_id}</td>
              <td>{datas.user_name}</td>
              <td>{datas.user_email}</td>
              <td>{datas.user_password}</td>
              <td>{datas.status}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => changeStatus(datas.user_id)}
                  disabled={isDisabled}
                >
                  Approved
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handletoDelete(datas.user_id)}
                  
                >
                 REJECTED
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SuperAdmin;
