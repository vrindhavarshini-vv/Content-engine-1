import Login from "./Routes/Admin/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Routes";
import RegUser from "./Routes/User/Register";
import Admin from "./Routes/Admin/AdminPage";
import { auth } from "./Routes/Firebase/firebase";
import {
  setAdminLoginData,
  setAdminLogged,
} from "./Routes/Store/Slice/adminLogin";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import UserPage from "./Routes/User/UserPage";
import UserLogin from "./Routes/User/UserLogin";
import UserLogOrReg from "./Routes/User/UserLogOrReg";

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const { adminLoginData, adminLogged } = useSelector(
    (state) => state.adminLogin
  );

  useEffect(() => {
    if (!adminLogged) {
      if (localStorage.getItem("token")) {
        checkLoginAuth();
      }
    }
  }, []);

  const checkLoginAuth = async () => {
    await onAuthStateChanged(auth, (currentUser) => {
      localStorage.setItem("token", currentUser.accessToken);
      dispatch(setAdminLoginData(currentUser));
      dispatch(setAdminLogged(true));
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
