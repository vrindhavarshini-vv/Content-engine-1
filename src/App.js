import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./Pages/Firebase/firebase";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Generate/Dashboard";
<<<<<<< HEAD
import Categories from "./Pages/Settings/setting";


=======
import Template from "./Pages/Templates/index";
>>>>>>> 51e6957adb71e9ad740b8387a2b0b991f7fdf49f

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
<<<<<<< HEAD
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element ={<Dashboard/>}/>
        <Route path="/user/setting" element ={<Categories/>}/>
        
        
=======
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/template" element={<Template />} />
>>>>>>> 51e6957adb71e9ad740b8387a2b0b991f7fdf49f
      </Routes>
    </BrowserRouter>
  );
}

export default App;
