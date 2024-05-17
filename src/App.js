import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./Pages/Firebase/firebase";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Generate/Dashboard";
import Categories from './Pages/Settings/setting'
import Template from "./Pages/Template/index";
import EmailForm from "./Pages/Emailform/emailform";



function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const {adminLogged } = useSelector(
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
    await onAuthStateChanged(auth, (user) => {
      console.log('User',user)
      localStorage.setItem("token", user.accessToken);
      dispatch(setAdminLoginData(user));
      dispatch(setAdminLogged(true));
    });
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>} />
        <Route path="/emailform" element={<EmailForm/>} />
        {adminLogged ?<Route path="/user/setting" element ={<Categories/>}/>:null}
        {adminLogged ? <Route path="/dashboard" element={<Dashboard />} />:null}
        {adminLogged ? <Route path="/template" element={<Template />} />:null}

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;