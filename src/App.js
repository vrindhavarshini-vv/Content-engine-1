import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./Pages/Firebase/firebase";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Generate/Dashboard";


<<<<<<< HEAD
=======
import Template from "./Pages/Template/index";
>>>>>>> 551d34955461fe940db66823063e299404061fb5

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

        <Route path="/" element={<Login/>} />
        <Route path="/user/setting" element ={<Categories/>}/>
       
        {adminLogged ? <Route path="/dashboard" element={<Dashboard />} />:null}
        {adminLogged ? <Route path="/template" element={<Template />} />:null}

>>>>>>> 551d34955461fe940db66823063e299404061fb5
      </Routes>
    </BrowserRouter>
  );
}

export default App;
