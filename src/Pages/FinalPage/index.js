import React, { useEffect, useState } from "react";
import { setDatas, setSelectTemplate } from "../../Routes/Slices/templateSlice";
import { useDispatch, useSelector } from "react-redux";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button"; 
import Modal from "react-bootstrap/Modal";
import emailjs from "@emailjs/browser";
import ListExample from "../Navbar";

const FinalPage = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { id,user_id } = useParams();
  const { generateDatas, datas,selectTemplate } = useSelector((state) => state.template);
  const [formData, setFormData] = useState([]);
  const [show, setShow] = useState(false);
  const [template, setTemplate] = useState("");
  const [toEmail,setToEmail] = useState('')
  const [toEmailSubject,setEmailSubject] = useState('')
  const token=localStorage.getItem("__token")
  // const user_Id= localStorage.getItem("user_Id")

  const getData = async (id,u) => {
    const headers = { 'Authorization':`Bearer ${token}`};
    await axios
    .get(`https://balaramesh8265.pythonanywhere.com/getSelectedTemplate/${id}/${u}`,{headers})
      .then((res) => {
        // dispatch(setGenerateDatas(res.data));
        const parsedData = JSON.parse(res.data.datas);
        dispatch(setDatas(parsedData));
        console.log("parse", parsedData);
        dispatch(setSelectTemplate(res.data.templates))
        console.log("temp",res.data.templates)
      });
  };

  const handleValueChange = (index, event) => {
    const newFormData = [...formData];
    newFormData[index] = event.target.value;
    setFormData(newFormData);
  };
  console.log("formData", formData);

  const handleClose = () => {
    setShow(false);
  };

  const handleFormSave = async () => {
    setShow(true);
    // const headers = { 'Authorization':`Bearer ${token}`};
    //    await axios.get( `https://balaramesh8265.pythonanywhere.com/getSelectedTemplate/${id}/${user_id}`,{headers})
    //   .then((res) => {
    //     console.log('r',res.data)
    //     const dbTemplates = res.data.templates;
    //     const dbDatas = JSON.parse(res.data.datas);
    //       console.log('db',dbDatas)

        const valueArray = datas.map((pair) => pair.value);
        const keyArray = datas.map((pair) => pair.key);

        console.log("valueArray", valueArray);
        console.log("keyArray", keyArray);

        let newTemplates = selectTemplate;

        console.log("newTemplates",newTemplates)

        keyArray.forEach((key, index) => {
          if (newTemplates.includes(key)) {
            newTemplates = newTemplates.replace(
              new RegExp(`\\[Enter ${key}\\]`, "g"),
              `${formData[index]}`
            );
            setTemplate(newTemplates);
          }
        });
        console.log('template',selectTemplate)
      };
  


  useEffect(() => {
    getData(id,user_id);
  }, []);
  console.log("new gen", generateDatas);


  const sendEmil = ()=>{
    const data = {
      to_email:toEmail,
      subject:toEmailSubject,
      message:template
    } 
      emailjs
      .send('service_1mw2acd', 'template_4ri6k1g', data,'KdWIYkl5o-ZZ1K9nF')
      .then(
        (result) => {
          console.log('SUCCESS!',result.text);
          alert('Email send successfull✔️')
          setShow(false);
          navigate("/template")
        },
        (error) => {
          console.log('FAILED...', error.text);
          console.log('error',error)
          alert('Email send failed❌')

        },
        
      );
    }
    console.log('templateInFormPage',template)
    return (
      <>
      <ListExample />
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
              required
            >
              <Form.Control
                required
                placeholder={doc.key}
                onChange={(event) => handleValueChange(index, event)}
                style={{
                  textTransform: "capitalize",
                }}
              />            
              <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </FloatingLabel>
          ))}
          <Button type="button" variant="primary" onClick={handleFormSave}>
            Proceed
          </Button>
        </div>
  
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Preview Your Email!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <FloatingLabel 
  
              key={1}
              label='Enter email'
              className="mb-3"
            >
              <Form.Control
                placeholder='Enter email'
                name="to_email"
                value={toEmail}
                onChange={(e)=>setToEmail(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel 
  
              key={1}
              label='Enter the Subject'
              className="mb-3"
            >
              <Form.Control
                placeholder='Enter Subject'
                name="to_subject"
                value={toEmailSubject}
                onChange={(e)=>setEmailSubject(e.target.value)}
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

}
  export default FinalPage;