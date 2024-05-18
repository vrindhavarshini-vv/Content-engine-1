import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAdminLoginData, setAdminLogged, setIsAdmin } from "../../Routes/Slices/adminLogin";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [regLogin, setRegLogin] = useState({
    email: "",
    password: "",
  });

  const checkAdmin = async () => {
    try {
      if (regLogin.email === "" || regLogin.password === "") {
        alert("Please fill all fields");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, regLogin.email, regLogin.password);
        const user = userCredential.user;
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("uid", user.uid);
        dispatch(setAdminLoginData(user));
        dispatch(setAdminLogged(true));
        dispatch(setIsAdmin(true));
        alert("Admin login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Admin login unsuccessful:", error.message);
      alert("Admin login unsuccessful!");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("uid", user.uid);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-in unsuccessful:", error.message);
      alert("Google sign-in unsuccessful!");
    }
  };

  const [registerMode, setRegisterMode] = useState("signin");

  const changeRegisterMode = () => {
    setRegisterMode(registerMode === "signin" ? "signup" : "signin");
  };

  return (
    <div className="form-container">
      <form className="form">
        <div className="form-content">
          <center>
            <h2>{registerMode === "signin" ? "SIGN IN" : "SIGN UP"}</h2>
          </center>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={(e) => setRegLogin({ ...regLogin, email: e.target.value })}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(e) => setRegLogin({ ...regLogin, password: e.target.value })}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="button" className="btn btn-primary" onClick={registerMode === "signin" ? checkAdmin : null}>
              {registerMode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </div>
          {registerMode === "signin" && (
            <div>
              <div className="text-center">Or Login With:</div>
              <div className="d-grid gap-2 mt-3">
                <button className="google-btn" onClick={handleGoogleAuth}>
                  <img className="google-img" src="google.svg" alt="Google Logo" />
                  Sign in with Google
                </button>
              </div>
              <div className="text-center">
                Not registered yet?{" "}
                <span className="link-primary" onClick={changeRegisterMode}>
                  Sign Up
                </span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
