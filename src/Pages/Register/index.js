import axios from "axios";
import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {Link} from 'react-router-dom';
import emailjs from "@emailjs/browser";

const Register = () => {

  const [validated, setValidated] = useState(false);
  const [registerData,setRegisterData] = useState({
    userStatus:'Requested'
  })
   
  // const navigate = useNavigate()
  
  const handleSubmit = async (event) => {
    if (!registerData.reName || !registerData.reEmail || !registerData.rePassword){
      alert('Please Fill All Fields');
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
   
    const formData = new FormData()
    formData.append('reName',registerData.reName)
    formData.append('reEmail',registerData.reEmail)
    formData.append('rePassword',registerData.rePassword)
    formData.append('status',registerData.userStatus)

     await axios.post("https://balaramesh8265.pythonanywhere.com/registeruser",formData).then((res)=>{
      // console.log(res,"res")
      console.log('res',res.data.status)
      // alert(res.data.status)
      if(res.data.status === 'Requested'){
        const emaildata = {
          from_name : registerData.reName,
          from_email : registerData.reEmail,
          message: "Access to this AI-Content-engineis crucial for our company. Ensuring timely access will allow me to access our web application.",
          subject: "Request for Login Approval to AI-Content-Engine ",

        };
        emailjs
          .send("service_1mw2acd", "template_4ri6k1g", emaildata, "KdWIYkl5o-ZZ1K9nF")
          .then(
            (result) => {
              console.log("SUCCESS!", result.text);
              alert("Email send successfull, to approve the your registration");
              // navigate("/register");
            },
            (error) => {
              console.log("FAILED...", error.text);
              console.log("error", error);
              alert("Email send failed❌");
            }
          );
          setRegisterData({reName:'',reEmail:'',rePassword:'',userStatus:'Requested'})
      }

    })
  
  };
  


  return (
    <>
   <main className="main-content main-content-bg mt-0 d-flex align-items-center page-header align-items-start min-vh-100"  style={{backgroundImage: "url('https://img.freepik.com/premium-photo/person-using-ai-tool-job_23-2150714247.jpg?size=626&ext=jpg&ga=GA1.1.1141335507.1718236800&semt=ais_user)"}}>"  >
  <div className="container" >
    <div className="row justify-content-between align-items-center">
      
      <div className="col-lg-6 col-md-6 d-none d-md-flex align-items-center justify-content-center">
        <img src="Reg-Image.png" className="img-fluid w-100  mt-6" alt="Description of the image"/>
      </div>
     
      <div className="col-lg-5 col-md-6 mt-4 mt-md-0">
        <div className="card mt-8">
          <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
            <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1 text-center py-4">
              <h4 className="font-weight-bolder text-white mt-1">SIGN UP</h4>
              <p className="mb-1 text-white text-sm">Join us Team</p>
            </div>
          </div>
          <div className="card-body pb-3">
            <form role="form">
              <div className="input-group input-group-outline mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Company Name"
                  onChange={(e) =>
                    setRegisterData({ ...registerData, reName: e.target.value })
                  }
                />
              </div>
              <div className="input-group input-group-outline mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Company Email"
                  required
                  onChange={(e) =>
                    setRegisterData({ ...registerData, reEmail: e.target.value })
                  }
                />
              </div>
              <div className="input-group input-group-outline mb-3">
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Enter password"
                  onChange={(e) =>
                    setRegisterData({ ...registerData, rePassword: e.target.value })
                  }
                />
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn bg-gradient-primary w-100 mt-4 mb-0"
                  onClick={handleSubmit}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer text-center pt-0 px-sm-4 px-1">
            <p className="mb-4 mx-auto">
              Already have an account?
              <Link to="/" className="text-primary text-gradient font-weight-bold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

</>
  );
};

export default Register;
