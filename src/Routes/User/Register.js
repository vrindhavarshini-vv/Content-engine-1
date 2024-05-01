import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";

const RegUser = () => {
  const navigate = useNavigate();
  const [userRegister, setUserRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerData = async () => {
    if (
      userRegister.name === "" ||
      userRegister.email === "" ||
      userRegister.password === ""
    ) {
      alert("please fill all fields!");
    } else {
      await createUserWithEmailAndPassword(
        auth,
        userRegister.email,
        userRegister.password
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          alert("Register successfull");
          navigate('/userpage')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          alert('please enter valid email or password')
          // ..
        });
    }
  };
  return (
    <>
      <h2>User Register</h2>
      <h5>{JSON.stringify(userRegister)}</h5>
      <div>
        <label>User Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          onKeyUp={(e) =>
            setUserRegister({ ...userRegister, name: e.target.value })
          }
        />
      </div>
      <div>
        <label>User Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          onKeyUp={(e) =>
            setUserRegister({ ...userRegister, email: e.target.value })
          }
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          onKeyUp={(e) =>
            setUserRegister({ ...userRegister, password: e.target.value })
          }
        />
      </div>
      <div>
        <button type="button" onClick={registerData}>
          Register User
        </button>
      </div>
    </>
  );
};

export default RegUser;
