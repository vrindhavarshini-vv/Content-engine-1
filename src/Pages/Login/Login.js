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
import GoogleButton from 'react-google-button'
import { Button,Form } from "react-bootstrap";






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
          localStorage.setItem("uid", user.uid);
          

          if (regLogin.email == user.email) {
            if(regLogin.uid==user.UID){
            dispatch(setAdminLoginData(user));
            dispatch(setAdminLogged(true));
            dispatch(setIsAdmin(true));
            alert("Admin login successfull!");
            navigate("/dashboard");
          } else {  
            alert("Admin purpose only");
          }
        }})
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
  

  return (
    <center>
    <div>
      <h4>{JSON.stringify(regLogin)}</h4>
      <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label><h1>Admin Email:</h1></Form.Label>
            <Form.Control type="email" placeholder="Enter  the email" onKeyUp={(e) => setRegLogin({ ...regLogin, email: e.target.value })}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label><h1>Password:</h1></Form.Label>
            <Form.Control type="password" placeholder="Enter the Password"  onKeyUp={(e) =>setRegLogin({ ...regLogin, password: e.target.value })} />
          </Form.Group>
          <Button type="button" variant="primary" onClick={checkAdmin}>
            Admin Login
          </Button>
      </Form>
      <br/>
      <GoogleButton onClick={handleGoogleAuth} />
      </div>
    </center>
  );
};

export default Login;


 
  



