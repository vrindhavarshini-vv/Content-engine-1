import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  setAdminLoginData,
  setAdminLogged,
  setIsAdmin,
} from "../../Routes/Slices/adminLogin";
import { useDispatch } from "react-redux";
import { GoogleAuthProvider ,signInWithPopup} from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css"
import "./login.css"



const Login = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [regLogin, setRegLogin] = useState({
    email: "",
    password: "",
  });


 

  const checkAdmin = async () => {
    if (regLogin.email === "" || regLogin.password === "") {
      alert("Please fill all fields");
    } else {
      await signInWithEmailAndPassword(auth, regLogin.email, regLogin.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          localStorage.setItem("token", user.accessToken);
          localStorage.setItem("uid", user.uid)
            dispatch(setAdminLoginData(user));
            dispatch(setAdminLogged(true));
            dispatch(setIsAdmin(true));
            alert("Admin login successfull!");
            navigate("/dashboard");
          })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          alert("Admin login unsuccessfull!");
        });
    }
  };

  const handleGoogleAuth = async (e) =>{
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential.user;
      console.log("user",user)
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("uid", user.uid);
        navigate("/dashboard")
  })}


  let [registerMode, setRegisterMode] = useState("signin")

  const changesetRegisterMode = () => {
    setRegisterMode(registerMode === "signin" ? "signup" : "signin")
  }

  if (registerMode === "signin") {
    return (
      <div className="form-container">
        <form className="form">
          <div className="form-content">
            {/* <h4>{JSON.stringify(regLogin)}</h4> */}
            <center><h2>SIGN UP</h2></center> 
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
               
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary"   >
                Submit
              </button>
            </div>
            <div className="text-center">
              Already registered?{" "}
              <span className="link-primary" onClick={changesetRegisterMode}>
                Sign In
              </span>
            </div>  
          </div>
        </form>
        
      </div>
    )
  }

  return (
    <div className="form-container">
      <form className="form">
        <div className="form-content">
          {/* <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
            />
          </div> */}
           {/* <h4>{JSON.stringify(regLogin)}</h4> */}
          <center><h2>SIGN IN</h2></center> 
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              onKeyUp={(e) => setRegLogin({ ...regLogin, email: e.target.value })}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onKeyUp={(e) =>setRegLogin({ ...regLogin, password: e.target.value })}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={checkAdmin}>
              Submit
            </button>
          </div>
          <div className="text-center">
              Or Login With ?
          </div>
        <div  className="d-grid gap-2 mt-3">
            <button  className="google-btn" onClick={handleGoogleAuth}><img className="google-img" src="google.svg"/>signin with google</button>
        </div>
        <div className="text-center">
            Not registered yet?{" "}
            <span className="link-primary" onClick={changesetRegisterMode}>
              Sign Up
            </span>
          </div>
        </div>
      </form>
    </div>
  )
};

export default Login;
