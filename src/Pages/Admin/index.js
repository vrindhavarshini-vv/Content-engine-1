import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

const SuperAdmin = () => {
  const [registerData, setRegisterData] = useState([]);
  const [isDisabled,setIsDisabled] = useState(false)

  const fetchRegistData = async () => {
    const getData = await axios.get(
      "https://virundhavarshini.pythonanywhere.com/getRegisteredUser"
    );
    setRegisterData(getData.data);
  };
  console.log("registerData", registerData);

  useEffect(() => {
    fetchRegistData();
  }, []);
  const changeStatus = async (approvedId) => {
    console.log("approvedId",approvedId);
    const formData = new FormData();
    const newchange = 'Approved'
    formData.append("userStatus", newchange);
    await axios.put(
      `https://virundhavarshini.pythonanywhere.com/editUserStatus/${approvedId}`,
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
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-12">
        <center>
          <h2>Super Admin</h2>
        </center>
        <div className="table-responsive">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registerData.map((datas, index) => (
                <tr key={index}>
                  <td>{datas.userId}</td>
                  <td>{datas.userName}</td>
                  <td>{datas.userEmail}</td>
                  <td>{datas.userPassword}</td>
                  <td>
                    <button
                      className={datas.userStatus === 'Requested' ? 'btn btn-danger' : 'btn btn-success'}
                      onClick={() => changeStatus(datas.userId)}
                      disabled={datas.userStatus === 'Approved'}
                    >
                      {datas.userStatus === 'Approved' ? 'Approved' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default SuperAdmin;
