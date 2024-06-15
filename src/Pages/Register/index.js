import axios from "axios";
import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

const Register =  () => {
    const [validated, setValidated] = useState(false);
    const [registerData,setRegisterData] = useState({
      userStatus:'Requested'
    })

    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setValidated(true);
      const formData = new FormData()
      formData.append('username',registerData.username)
      formData.append('email',registerData.email)
      formData.append('password',registerData.password)
      formData.append('status',registerData.userStatus)

      const newRegister = await axios.post('https://pavithrakrish95.pythonanywhere.com/register',formData).then((res)=>{
        console.log('res',res.data.status)
        if(res.data.status === 'Requested'){
          alert('Wait for the registration entry')
        }
      })

    };
  return (
    <div> 
        <h2>Register Here!</h2>
      <Form style={{width: "100%"}} noValidate validated={validated}>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter user name"
              onChange={(e)=>setRegisterData({...registerData,username:e.target.value})}
            />
            <Form.Control.Feedback type="invalid">
                User name Need
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              onChange={(e)=>setRegisterData({...registerData,email:e.target.value})}
            />
            <Form.Control.Feedback type="invalid">
                Email Need
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                aria-describedby="inputGroupPrepend"
                required
              onChange={(e)=>setRegisterData({...registerData,password:e.target.value})}

              />
              <Form.Control.Feedback type="invalid">
                Password Need
              </Form.Control.Feedback>
          </Form.Group>
        <Button type="button" onClick={handleSubmit}>Register</Button>
        <Link to="/login">Login</Link>
      </Form>
    </div>
  );
};

export default Register;

// import { auth } from "../Firebase/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// const Register = () => {
//     const navigate = useNavigate();
//     const [regData, setRegData] = useState({
//       username: "",
//       email: "",
//       password: "",
//     });
//     const handleRegister = async (e) => {
//         e.preventDefault();
//     try{
//         const userCredential = await createUserWithEmailAndPassword(
//             auth,
//             regData.username,
//             regData.email,
//             regData.password
//         )
//         const user = userCredential.user;
//         console.log("user", user);
//         const formData = new FormData();
//       formData.append("email", regData.email);
//       formData.append("uid", user.uid);
//       await axios.post("https://pavithrakrish95.pythonanywhere.com/registerUser", formData);
//       alert("Registration successful!");
//       navigate("/login");
//     } catch (error) {
//       console.error("Error during registration", error);
//       alert("Registration failed! Please try again.");
//     }
//   };

//   return (
//     <center>
//       <div>
//         <h2>Register Page</h2>
//         <form onSubmit={handleRegister}>
//           <div>
//             <label>username:</label>
//             <input
//               type="username"
//               placeholder="Enter username"
//               value={regData.username}
//               onChange={(e) => setRegData({ ...regData, username: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label>email:</label>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={regData.email}
//               onChange={(e) => setRegData({ ...regData, email: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={regData.password}
//               onChange={(e) => setRegData({ ...regData, password: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <button type="submit">Register</button>
//           </div>
//         </form>
//       </div>
//     </center>
//   );
// };


    