import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setAdminLoginData, setAdminLogged } from "../Store/Slice/adminLogin";
import { useDispatch } from "react-redux";

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
          dispatch(setAdminLoginData(user));
          dispatch(setAdminLogged(true));
          alert("Admin login successfull!");
          navigate("/admin");
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          alert("Admin login unsuccessfull!");
        });
    }
  };

  return (
    <div>
      <h4>{JSON.stringify(regLogin)}</h4>
      <form>
        <h2>Admin Page</h2>
        <div>
          <label>Admin email:</label>
          <input
            placeholder="Enter email"
            type="email"
            onKeyUp={(e) => setRegLogin({ ...regLogin, email: e.target.value })}
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
    </div>
  );
};

export default Login;
