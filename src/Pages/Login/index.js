import React, { useState } from "react";
import { auth,db } from "../Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword,createUserWithEmailAndPassword} from "firebase/auth";
import {
  setAdminLoginData,
  setAdminLogged,
  setIsAdmin,
} from "../../Routes/Slices/adminLogin";
import { useDispatch } from "react-redux";
import { setIsPopUp } from "../../Routes/Slices/dashBoardSlice";
import { GoogleAuthProvider ,signInWithPopup} from "firebase/auth";
import { addDoc,collection } from 'firebase/firestore';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";

// import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";



 const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  //register
  const [register, setRegister] = useState({
    reEmail:"",
    reName: "",
    rePassword: "",
  });


   const checkRegister = async () => {             
        await addDoc(collection(db,'Users Registers'),{
        Email :register.reEmail,
        Password : register.rePassword,
        Name : register.reName
       })
    //    console.log(register)
            await createUserWithEmailAndPassword(auth, register.reEmail, register.rePassword)
            .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // console.log(user);
            alert("register success")            
            dispatch(setRegister(user))
            navigate("/") 
            }).catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
           console.log(errorCode, errorMessage);
           alert("register failed  ")
       });
           }




  // login
  const [regLogin, setRegLogin] = useState({
    email: "",
    password: "",
  });



  const [isLogin,setIsLogin] = useState("signin")
  const changeLoginMode = () => {
    setIsLogin(isLogin ==="signin" ? "signup" : "signin")
  }


  const checkAdmin = async () => {
    if (regLogin.email === "" || regLogin.password === "") {
      alert("Please fill all Details");
    } else {
      await signInWithEmailAndPassword(auth, regLogin.email, regLogin.password)
        .then((userCredential) => {
          const user = userCredential.user;
          localStorage.setItem("token", user.accessToken);
          localStorage.setItem("uid", user.uid);
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
  }


 
 

  const handleGoogleAuth = async (e) =>{
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential.user;
      console.log("user",user)
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("uid", user.uid);
        navigate("/dashboard")
        dispatch(setIsPopUp(false))
  })}
  
  return (
    <div  >
     {isLogin === "signin" ? (
    <div >
      <Form>
        <h3 className="text-center">SIGN IN</h3>
        <div >
          <label>Email address:</label>
          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setRegLogin({ ...regLogin, email: e.target.value })}
          />
        </div>
        <div className="form-group mt-3">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setRegLogin({ ...regLogin, password: e.target.value })}
          />
        </div>
        <div >
          <button type="button" className="btn btn-primary" onClick={checkAdmin}>
            Sign In
          </button>
        </div>
      </Form>
      <div className="text-center">
        Not registered yet?{" "}
        <span className="link-primary" onClick={changeLoginMode}>
          Sign Up
        </span>
      </div>
      <div >
      sign in with ?
      </div>
      <div>
        <button className="google-btn"onClick={handleGoogleAuth}><img src="google.svg" alt="Google Icon"/> Continue with Google</button>
      </div>

    </div> )
    :
    ( <div>
      <Form>
      <h3 className="text-center">SIGN UP</h3>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          
          placeholder="Enter name"
          onChange={(e) => setRegister({ ...register, reName: e.target.value })}
        />
      </div>
      <div >
        <label>Email address</label>
        <input
          type="email"
          
          placeholder="Enter email"
          onChange={(e) => setRegister({ ...register, reEmail: e.target.value })}
        />
      </div>
      <div >
        <label>Password</label>
        <input
          type="password"
          
          placeholder="Enter password"
          onChange={(e) => setRegister({ ...register, rePassword: e.target.value })}
        />
      </div>
      <div >
        <button type="button" className="btn btn-primary" onClick={checkRegister}>
          Submit
        </button>
      </div>
      </Form>
       <div className="text-center">
        Already registered?{" "}
          <span className="link-primary" onClick={changeLoginMode}>
          Sign In
          </span>
      </div>
    </div>)
    }
    </div>
  )}
       

export default Login;
