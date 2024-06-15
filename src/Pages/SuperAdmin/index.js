import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";


const SuperAdmin = () => {
  const [registerData, setRegisterData] = useState([]);
  const [isDisabled,setIsDisabled] = useState(false)

  const fetchRegistData = async () => {
    const getData = await axios.get(
      "https://pavithrakrish95.pythonanywhere.com/getRegisterData"
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
      `https://pavithrakrish95.pythonanywhere.com/changeStatus/${changeId}`,
      formData
    ).then((res)=>{
      console.log('res',res.data)
    }).catch((error)=>{
      console.log('err',error)
    });
    fetchRegistData();
    setIsDisabled(true)
  };
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
          </tr>
        </thead>
        <tbody>
          {registerData.map((datas, index) => (
            <tr key={index}>
              <td>{datas.id}</td>
              <td>{datas.username}</td>
              <td>{datas.email}</td>
              <td>{datas.password}</td>
              <td>{datas.status}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => changeStatus(datas.id)}
                  disabled={isDisabled}
                >Approved
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
