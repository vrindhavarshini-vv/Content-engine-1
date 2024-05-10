import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./Pages/Firebase/firebase";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Generate/Dashboard";
import Template from "./Pages/Templates/index";

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const { adminLoginData, adminLogged, isAdmin } = useSelector(
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {adminLogged ? <Route path="/dashboard" element={<Dashboard />} />:null}
        {adminLogged ? <Route path="/template" element={<Template />} />:null}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
