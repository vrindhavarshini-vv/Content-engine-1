import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Generate";
import Categories from './Pages/Settings';
import Template from "./Pages/Template/index";
import Register from "./Pages/Register";
import FinalPage from "./Pages/FinalPage";
import SuperAdmin from "./Pages/SuperAdmin";




function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const {adminLogged } = useSelector(
    (state) => state.adminLogin
  );

  useEffect(() => {
    if (!adminLogged) {
      if (localStorage.getItem("__token")) {
        dispatch(setAdminLogged(true));
      }
    }
  }, []);

  // const checkLoginAuth = async () => {
  //   await onAuthStateChanged(auth, (user) => {
  //     // console.log('User',user)
  //     localStorage.setItem("token", user.accessToken);
  //     dispatch(setAdminLoginData(user));
  // dispatch(setAdminLogged(true));
  //   });
  // };

  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Login/>} />
        <Route  path="/register" element = {<Register/>}/>
        <Route path="SuperAdmin" element={<SuperAdmin />}/>

        {adminLogged ? 
          <>
            <Route path="/user/setting" element ={<Categories/>}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/template" element={<Template />} />
            <Route path="/finalPage/:id/:user_id" element={<FinalPage/>}/>
          </>
          : null
        }
     </Routes>
    </BrowserRouter>
  );
}

export default App;
