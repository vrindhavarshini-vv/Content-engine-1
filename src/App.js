import { BrowserRouter, Routes, Route } from "react-router-dom";
import { auth } from "./Pages/Firebase/firebase";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Generate";
import Categories from './Pages/Settings/index'
import Template from "./Pages/Template/index";



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
      // console.log('User',user)
      localStorage.setItem("token", user.accessToken);
      dispatch(setAdminLoginData(user));
      dispatch(setAdminLogged(true));
    });
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>} />
        {adminLogged ? 
          <>
            <Route path="/user/setting" element ={<Categories/>}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/template" element={<Template />} />
          </>
          : null
        }
     </Routes>
    </BrowserRouter>
  );
}

export default App;
