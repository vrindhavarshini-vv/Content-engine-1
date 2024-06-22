import React, { useEffect, useRef, useState } from "react";
import { setDatas, setGenerateDatas, setSelectTemplate } from "../../Routes/Slices/templateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { json, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { setIsPopUp } from "../../Routes/Slices/dashBoardSlice";
import emailjs from '@emailjs/browser'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Navbar/index.css";
import NavComponent from "../Navbar";


const FinalPage = () => {
  const token = localStorage.getItem("token")
  const currentLoginUserId = localStorage.getItem("userId")
  const headers = {'Authorization':`Bearer ${token}`}
  const form = useRef()
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate()
  const { generateDatas, datas ,selectTemplate} = useSelector((state) => state.template);
  console.log("id", id);
  const [formData, setFormData] = useState([]);
  const [show, setShow] = useState(false);
  const [template, setTemplate] = useState("");
  const [toEmail,setToEmail] = useState('');
  const [subject, setSubject] = useState('');
 

  const getData = async (i) => {
    const currentLoginUserId = localStorage.getItem("userId")
    const dbTemplate = await axios
      .get(`https://virundhavarshini.pythonanywhere.com/getSelectedTemplate/${i}/${currentLoginUserId}`,{headers})
      .then((res) => {
       
        const parsedData = JSON.parse(res.data.datas);
        dispatch(setDatas(parsedData));
        dispatch(setSelectTemplate(res.data.templates))
       
      });
  };

  const handleValueChange = (index, event) => {
    const newFormData = [...formData];
    newFormData[index] = event.target.value;
    setFormData(newFormData);
  };
  // console.log("formData", formData);

  const handleClose = () => {
    setShow(false);
    setFormData([])
  };
  
  const handleGoBackToTemplates = () => {
    navigate('/template')
  };

  const handleFormSave = async () => {
    setShow(true);
    

        const valueArray = datas.map((pair) => pair.value);
        const keyArray = datas.map((pair) => pair.key);

        // console.log("valueArray", valueArray);
        // console.log("keyArray", keyArray);

        let newTemplates = selectTemplate;

        // console.log("paragraph",paragraph);

        keyArray.forEach((key, index) => {
          if (newTemplates.includes(key)) {
            newTemplates = newTemplates.replace(
              new RegExp(`\\[Enter ${key}\\]`, "g"),
              `${formData[index]}`
            );
            setTemplate(newTemplates);
          }
        });
      }
  

  useEffect(() => {
    getData(id);
  }, []);
  // console.log("new gen", generateDatas);
    const sendEmil = ()=>{
    const data = {
      to_email:toEmail,
      message:template,
      subject:subject
    } 
      emailjs
      .send('service_nfhpy6b', 'template_lv60rn9',data, 'Z7BAUgnHnm_Ez8KjM')
      .then(
        (result) => {
          console.log('SUCCESS!',result.text);

          alert('Email send successfull✔️')
        },
        (error) => {
          console.log('FAILED...', error.text);
          console.log('error',error)
          alert('Email send failed❌')
        },
      );
    }

  return (
    <>
     <header>
              <NavComponent/>
          </header>
    
         
      <center>
         
        <h2>Add Your Details Here!</h2>
      </center>
      <div
        style={{
          width: "700px",
          margin: "100px auto",
        }}
      >
        {datas.map((doc, index) => (
          <FloatingLabel 
            controlId={`floatingInput${index}`}
            key={index}
            label={doc.key}
            className="mb-3"
            style={{
              textTransform: "capitalize",
              margin: "34px 0",
            }}
          >
            <Form.Control
              placeholder={doc.key}
              onChange={(event) => handleValueChange(index, event)}
            />
          </FloatingLabel>
        ))}
              <div style={{ textAlign: 'center' }}> {/* Center the div if needed */}
    <div className="d-flex justify-content-around" style={{ maxWidth: '300px', margin: '0 auto' }}>
      {/* Use Bootstrap flex classes */}
      <Button type="button" variant="primary" onClick={handleGoBackToTemplates}>
        Back
      </Button>
      <Button type="button" variant="primary" onClick={handleFormSave}>
        Proceed
      </Button>
    </div>
  </div>
      </div>

      <Modal  size="lg" show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title><center>Email</center></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <FloatingLabel 

            key={1}
            label='Enter email'
            className="mb-3"
          >
            <Form.Control
              placeholder='Enter Recipients email'
              name="to_email"
              value={toEmail}
              onChange={(e)=>setToEmail(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel 

                key={1}
                label='Enter Subject'
                className="mb-3"
                >
                <Form.Control
                  placeholder='Enter Subject'
                  name="subject"
                  value={subject}
                  onChange={(e)=>setSubject(e.target.value)}
                />
            </FloatingLabel>
          <textarea 
            value={template}
            style={{
            width: "100%",
            height: "60vh",
            border: "none",
            padding: "10px",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
            backgroundColor: "#f9f9f9",
            resize: "none",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            boxSizing: "border-box",
          }}
          onChange={(e)=>setTemplate(e.target.value)}
          name="message"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>sendEmil()}>
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FinalPage;