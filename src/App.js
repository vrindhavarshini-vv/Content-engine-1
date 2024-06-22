import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Dashboard from "./Pages/Generate";
import Categories from "./Pages/Settings";
import Login from "./Pages/Login";
import Template from "./Pages/Templates";
import FinalPage from "./Pages/FormPage";
import SuperAdmin from "./Pages/Admin";
import Register from "./Register";
import AdminLogin from "./Pages/AdminLogin";

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const { adminLoginData, adminLogged, isAdmin , superAdminLogged} = useSelector(
    (state) => state.adminLogin
  );

  useEffect(() => {
    if (!adminLogged) {
      if (localStorage.getItem("token")) {
        dispatch(setAdminLogged(true));
        // checkLoginAuth();
      }
    }
  }, []);


  return (
<BrowserRouter >
      <Routes>

        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/adminLogin" element={<AdminLogin/>} />
       
       
        {
          superAdminLogged &&  <Route path="/admin" element ={<SuperAdmin/>}/>
        }
        
        {adminLogged && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/template" element={<Template />} />
            <Route path="/finalPage/:id/:currentLoginUserId" element={<FinalPage />} />
            <Route path="/user/setting" element ={<Categories/>}/>
          </>
        )}
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
