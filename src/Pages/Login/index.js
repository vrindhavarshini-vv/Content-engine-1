import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  setAdminLoginData,
  setAdminLogged,
  setIsAdmin,
} from "../../Routes/Slices/adminLogin";
import { useDispatch } from "react-redux";
import { setIsPopUp } from "../../Routes/Slices/dashBoardSlice";
import { Button } from "react-bootstrap";
import axios from "axios";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
});


const handleLogin = async ()=> {
  if (loginData.Email === "" || loginData.Password === "") {
    alert("Please fill all Details");
  } 
  else {
  const data = new FormData();
  data.append("Emaildata",loginData.Email)
  data.append("Passworddata",loginData.Password)
  console.log('data',loginData)

  await axios.post("https://balaramesh8265.pythonanywhere.com/loginUserData",data).then((res)=>{
    console.log('res',res.data.status)
    if(res.data.status === 'Approved'){
      dispatch(setAdminLoginData(res.data));
      console.log('res',res.data.status)
      dispatch(setAdminLogged(true));
      dispatch(setIsAdmin(true)); 
      alert("Admin login successfull!");
      localStorage.setItem('__token',res.data.token)
      localStorage.setItem('user_Id', res.data.user_id)
      navigate("/dashboard");
    }
    else{
      alert('Enter valid email or password')
    }
  }).catch((err)=>{
    console.log('error',err)
    alert(err)
    
  })
  }}

  return (
    <>
    


          <div className="d-flex justify-content-center align-items-center vh-100" 
          style={{backgroundImage: "url('https://media.licdn.com/dms/image/D5612AQFc5Lh46qb8jA/article-cover_image-shrink_720_1280/0/1697855438149?e=2147483647&v=beta&t=v2yTtvgwxzPBWWFyQGgEGYWEURr7akMDAQpdokXSgBc')",
                                                                                          backgroundSize: "cover",
                                                                                          backgroundPosition: "center",
                                                                                          backgroundRepeat: "no-repeat"
          }} >
          <div className="container my-auto ">
          <div className="row">
            <div className="col-lg-4 col-md-8 col-12 mx-auto">
              <div className="card z-index-0 fadeIn3 fadeInBottom">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                    <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Sign in</h4>
                    <div className="row mt-3">
                      <div className="col-2 text-center ms-auto">
                        <a className="btn btn-link px-3" href="javascript:;">
                          <i className="fa fa-facebook text-white text-lg"></i>
                        </a>
                      </div>
                      <div className="col-2 text-center px-1">
                        <a className="btn btn-link px-3" href="javascript:;">
                          <i className="fa fa-github text-white text-lg"></i>
                        </a>
                      </div>
                      <div className="col-2 text-center me-auto">
                        <a className="btn btn-link px-3" href="javascript:;">
                          <i className="fa fa-google text-white text-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <form role="form" className="text-start">
                    <div className="input-group input-group-outline my-3">
                    <input type="email" placeholder="Enter Company Email" className="form-control" onChange={(e) =>
                          setLoginData({ ...loginData, Email: e.target.value })
                        } />
                    </div>
                    <div className="input-group input-group-outline mb-3">
                      
                      <input type="password" placeholder="Enter Company Password" className="form-control"  onChange={(e) =>
                          setLoginData({ ...loginData,Password: e.target.value })
                        } />
                    </div>
                  
                    <div className="text-center">
                      <button type="button" className="btn bg-gradient-primary w-100 my-4 mb-2"  onClick={()=>handleLogin()}>Sign in</button>
                    </div>
                    <p className="mt-4 text-sm text-center">
                      Don't have an account?
                      <Link to="/register" className="text-primary text-gradient font-weight-bold">Sign up</Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
</>
  );
};

export default Login