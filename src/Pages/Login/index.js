import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import {
  setAdminLoginData,
  setAdminLogged,
  setIsAdmin,
  

} from "../../Routes/Slices/adminLogin";
import { setLoggedUserdata } from "../../Routes/Slices/settingsLogin";
import { useDispatch, useSelector } from "react-redux";
import { setIsPopUp } from "../../Routes/Slices/dashBoardSlice";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedUser=useSelector((state)=>state.settings)
  console.log("loggedUser",loggedUser.loggedUserData)
  const [regLogin, setRegLogin] = useState({
    email: "",
    password: "",
  });

const checkAdmin = async () => {
      const formData=new FormData();
      formData.append("loginEmail",regLogin.email);
      formData.append("loginPassword",regLogin.password);
      let getData= await axios.post("https://pavithrakrish95.pythonanywhere.com/loginData",formData)
      localStorage.setItem("token",getData.data[0].token)
      localStorage.setItem("uid",getData.data[0].uid)
      console.log(getData,"getData")

      dispatch(setLoggedUserdata({
                                uid:getData.data[0].uid,
                                username:getData.data[0].username,
                                email:getData.data[0].email,
                                }))
                    
      
      // // .then((res)=>{  
      // //    console.log("res",res.data)
      //    localStorage.setItem("token",res.data.token)
      //   //  alert(res.data)
      // })

    //       if (regLogin.email == user.email) {
            //dispatch(setAdminLoginData(user));
            console.log("getData",getData)
            dispatch(setAdminLogged(true));
            dispatch(setIsAdmin(true)); 
            alert("Admin login successfull!");
            navigate("/dashboard");
          // } else {
          //   alert("Admin purpose only");
          // }
        // })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       console.log(errorCode, errorMessage);
    //       alert("Admin login unsuccessfull!");
    //     });
    // }
  };

  const handleGoogleAuth = async (e) => {
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential.user;
      console.log("user", user);
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("uid", user.uid);
      navigate("/dashboard");
      dispatch(setIsPopUp(false));
    });
  };

  return (
    <center>
      <div>
        <h4>{JSON.stringify(regLogin)}</h4>
        <form>
          <h2>Admin Page</h2>

          <div>
            <label>Admin email:</label>
            <input
              placeholder="Enter email"
              type="email"
              onKeyUp={(e) =>
                setRegLogin({ ...regLogin, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              placeholder="Enter password"
              type="password"
              onKeyUp={(e) =>
                setRegLogin({ ...regLogin, password: e.target.value })
              }
            />
          </div>
          <div>
            <button type="button" onClick={checkAdmin}>
              Admin Login
            </button>
            
          </div>
        </form>
        <br />
        <button onClick={handleGoogleAuth}>
          <img src="google.svg" />
          continue with google
        </button>
      </div>
    </center>
  );
};

export default Login;
