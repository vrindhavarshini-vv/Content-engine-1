import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setAnswer,setSelectedCategoryName,setSelectedTypeName,setShow,setIsApiResponseReceived} from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Navbar/index.css";
import "./index.css";
import axios from "axios";
import ListExample from '../Navbar';
import emailjs from '@emailjs/browser'
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";




function Dashboard() {
  const token = localStorage.getItem("token")
  const currentLoginUserId = localStorage.getItem("uid")
  
  
  const adminSlice = useSelector((state) => state.adminLogin);
  const slice = useSelector(state => state.dashboardslice);
  const templateSlice = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const headers = {'Authorization':`Bearer ${token}`}
   
    const [toEmail,setToEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [pairs,setPairs] = useState([{key:'',value:''}]);
    const [updatedContent,setUpdatedContent] = useState("");

    
    
    
    
    //Key Value Pairs************************
    let keyValuePair = []
    for (let each of pairs){
      keyValuePair.push(each.key +":"+ each.value)
    }
    let stringedPairs = JSON.stringify(keyValuePair)
 
  
    const handleKeyChange = (i, event) => {
      const newPair = [...pairs];
      newPair[i].key = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
      setPairs(newPair)
    };

    const handleRemoveInputBox = (i) => {
        const newArray = [...pairs];
        newArray.splice(i, 1);
        setPairs(newArray);
      };
    

    const handleValueChange = (i, event) => {
      const newPair = [...pairs];
      newPair[i].value = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
      setPairs(newPair)
    };

    const handleAddPair = () => {
    setPairs([...pairs, { key: '', value: '' }])
      
    };
    console.log("pairs",pairs);
    

    const handleGenerate =  (event) => {
      event.preventDefault();
      dispatch(setIsPopUp(true))
    };
  
    const formData = new FormData();
    const handleSave =async () =>{
      {slice.isApiResponseReceived && 
        
        formData.append("categoryId",slice.selectedCategory);
        formData.append("typeId",slice.selectedType );
        formData.append("datas",JSON.stringify(pairs) );
        formData.append("templates",updatedContent);
        formData.append("userId", currentLoginUserId);
        console.log("updatedContent",updatedContent);
        const postedGenerateData = await axios.post('https://pavithrakrish95.pythonanywhere.com/dataBasePostGeneratedDatas',formData)
                                    .then((res)=>{
                  console.log("res",res)
      })
        dispatch(setIsPopUp(false));
       
      }
    };


    const handleClose = ()=>{
      dispatch(setIsPopUp(false))
      dispatch(setIsApiResponseReceived(false))
      dispatch(setIsTypeSelected(false))
      dispatch(setIsCategorySelected(false))
    };
    
   
    
    const getCategory = async () => {
      await axios.get(`https://pavithrakrish95.pythonanywhere.com/settingGetList/${currentLoginUserId}`).then((res)=>{
        console.log("res",res.data)
        dispatch(setCategoryList(res.data))
        }) 
    };
    console.log("dbCategoryList",slice.categoryList)
    useEffect(() => {
        getCategory();
    }, []);   



    const getTypes = async () => {
      
      await axios.get("https://pavithrakrish95.pythonanywhere.com/settingGetAllType").then((res)=>{
        console.log("dataBaseType",currentLoginUserId);
          dispatch(setTypesList(res.data));
          }) 
          }
          console.log("dbTypeList",slice.typesList)
    

    useEffect(() => {
        if (slice.isCategorySelected) {
          getTypes();
        }
      }, [slice.selectedCategory])


    useEffect(() => {
      for (let each of slice.categoryList){
        if (each.categoryId == slice.selectedCategory){
          dispatch(setSelectedCategoryName(each.categoryName))
        }
      }
    }, [slice.selectedCategory]); 
    

    useEffect(() => {
      for (let each of slice.typesList){
        if (each.typeId == slice.selectedType){
          dispatch(setSelectedTypeName(each.typeName))
        }
      }
    }, [slice.selectedType]); 
  

    async function generateAnswer(){

          dispatch(setAnswer("Loading..."))
          const response = await axios({
            url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCdGe2K1tWu6hUcBGr5L-RbJ65Rd3L0iS0",
            method: "post",
            data: {contents:[{parts:[{text: `Please give a ${slice.selectedTypeName} to  ${slice.selectedCategoryName} with these given datas only ${stringedPairs} in a email format without subject and don't give empty placeholders `  }]}]}
          })
          dispatch(setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]))
          dispatch(setIsApiResponseReceived(true))
          
          const paragraph = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
          
          
            const valueArray = pairs.map((pair) => pair.value);
            const keyArray = pairs.map((pair) => pair.key);

            let newParagraph = paragraph;
            
            valueArray.forEach((value, index) => {
              if (newParagraph.includes(value)) {
                  newParagraph = newParagraph.replace(new RegExp(value, 'g'),`[Enter ${ keyArray[index]}]`);
                  setUpdatedContent(newParagraph)
              }});

    }

    const handleContentEdit = (e) => {
      dispatch(setAnswer(e.target.value));
    };


    const handleSendEmail = (e) => {
      const data = {
        to_email:toEmail,
        message:slice.answer,
        subject:subject
      } 
        emailjs
        .send('service_nfhpy6b', 'template_qtyoyvw',data, 'Z7BAUgnHnm_Ez8KjM')
        .then(
          (result) => {
            console.log('SUCCESS!',result.text);
            alert('Email send successfull✔️')
            
          },
          (error) => {
            console.log('FAILED...', error.text);
            console.log('error',error)
            alert('Email send failed❌')
          },)
    };



    
return (
     <>
     <div className='generatePageContainer'>
      <center>
      <header>
          <ListExample/>
      </header>
      <h1>Generate Page</h1>
        <br/>
        <div>
          <br/>
          <br/>
         <select onChange={(e) => {dispatch(setSelectedCategory(e.target.value)); dispatch(setIsCategorySelected(true))}}>
              <option  value={templateSlice.isNavigateFromTemplates ? templateSlice.selectedCategory : slice.selectedCategory}>Select a Category</option>
              {slice.categoryList
              // .filter((e) => e.uid === parsedUid)
              .map((categories) => (
                <option key={categories.categoryId} value={categories.categoryId}>
                  {categories.categoryName}
                </option>
                  ))}
              </select>
          
          <br/>
          <br/>
          
          {slice.isCategorySelected ? 
            <select value={slice.selectedType} onChange={(e) => {dispatch(setSelectedType(e.target.value)); dispatch(setIsTypeSelected(true))}}>
              <option value="">Select a Type</option>
              
              {slice.typesList
              // .filter((e)=> e.uid==parsedUid)
              .map((types) => (
               slice.selectedCategory == types.categoryId &&
                  <option key={types.typeId} value={types.typeId}>
                    {types.typeName}
                  </option>
              ))}
            </select> : null}
          <br/>
          <br/>
        </div>
    
        {slice.isTypeSelected ?
          <form onSubmit={handleGenerate}>
            {pairs.map((pair, i) => (
              <>
              <div key={i}>
                <label> Key:</label>
                <input  type="text" placeholder='eg. Name' value={pair.key} onChange={(event) => handleKeyChange(i, event)}/>
                <label>Value:</label>
                <input type="text" placeholder="eg. Varshini"  value={pair.value} onChange={(event) => handleValueChange(i, event)}/>
                <button type='button' onClick={() => handleRemoveInputBox(i)}>Delete</button>
              </div>
              <br/>
             
              </>
            ))}
             <button type="button" className='btn btn-primary' onClick={handleAddPair}>Add Another Data</button>
            <br/>
            <br/>
            <button type="submit" className='btn btn-success' onClick={generateAnswer}>Generate Template</button>
          </form> : null
        }
    
        <Modal show={slice.isPopUp} onHide={handleClose} size='lg'>
          <center>
            <Modal.Header closeButton>
              <Modal.Title> {slice.selectedTypeName} to {slice.selectedCategoryName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <FloatingLabel 

                key={1}
                label='Enter Recipients email'
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
              value={slice.answer}
              onChange={handleContentEdit}
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
              />
            </Modal.Body>
            <Modal.Footer>

              <Button variant="secondary"  onClick={handleClose}>
                Regenerate
              </Button>
              {slice.isApiResponseReceived ? <Button  className='saveButton' onClick={handleSave}>
                Save Template
              </Button> : null}
              {slice.isApiResponseReceived ?<Button type="button" variant="primary" onClick={handleSendEmail}>
               Send E-Mail
            </Button>: null}
              </Modal.Footer>
          </center>
        </Modal>
        </center>
        </div>
      </>
    );
    
}
export default Dashboard;























