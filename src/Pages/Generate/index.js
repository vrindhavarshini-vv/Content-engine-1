import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { setCategoryList,setTypesList,setSelectedCategory,setIsPopUp,setIsCategorySelected,setSelectedType,setIsTypeSelected,setAnswer,setSelectedCategoryName,setSelectedTypeName,setShow,setIsApiResponseReceived} from "../../Routes/Slices/dashBoardSlice"
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import axios from "axios";
import emailjs from '@emailjs/browser'
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import ListExample from '../Navbar';




function Dashboard() {
  // const adminSlice = useSelector((state) => state.adminLogin);
  const slice = useSelector(state => state.dashboardslice)
  // const templateSlice = useSelector((state) => state.template);
  const dispatch = useDispatch()
  const [pairs,setPairs] = useState([{key:'',value:''}])
  const [updatedContent,setUpdatedContent] = useState("")
  // const [toEmail,setToEmail] = useState('');
  // const [subject, setSubject] = useState('');
  // const navigate = useNavigate()

  

  const token=localStorage.getItem("__token")
  console.log(token)
  const userId = localStorage.getItem("user_Id")
  console.log('user',userId)

  // console.log("isApiResponseReceived",slice.isApiResponseReceived);

  //Key Value Pairs************************
  let keyValuePair = []
  for (let each of pairs){
    keyValuePair.push(each.key +":"+ each.value)
  }
  let stringedPairs = JSON.stringify(keyValuePair)
 
  
  const handleNavClose = () => dispatch(setShow(false));
  const handleNavShow = () => dispatch(setShow(true));

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

  const handleSave =async () =>{
   const formData = new FormData();
    {slice.isApiResponseReceived && 
      formData.append("categoryId",slice.selectedCategory);
      formData.append("typeId",slice.selectedType );
      formData.append("datas",JSON.stringify(pairs) );
      formData.append("templates",updatedContent);
      // console.log("updatedContent",updatedContent);
      formData.append("userId", userId);
      const headers = { 'Authorization':`Bearer ${token}`};
      await axios.post("https://balaramesh8265.pythonanywhere.com/postGeneratedDatas",formData,{headers})
                                  .then((res)=>{
                 console.log("res",res)
    }).catch((error)=>{
      alert(error)
      console.log('er',error)
    })
       dispatch(setIsPopUp(false));
    }
   };
   const handleClose = ()=>{
    dispatch(setIsPopUp(false))
    dispatch(setIsApiResponseReceived(false))
    dispatch(setIsTypeSelected(false))
    dispatch(setIsCategorySelected(false))
    setPairs([{key:'',value:''}])
    dispatch(setSelectedCategory(""))
    dispatch(setSelectedType(""))
    
  };
   
  const handleReGenerate = ()=>{
    dispatch(setIsPopUp(false))
    dispatch(setIsApiResponseReceived(false))
  };
  
  const getCategory = async () => {
    const headers = { 'Authorization':`Bearer ${token}`};
    await axios.get(`https://balaramesh8265.pythonanywhere.com/settingGetcategory/${userId}`,{ headers }).then((res)=>{
      console.log("res",res.data)
      dispatch(setCategoryList(res.data))
       }) 
  };
  console.log("dbCategoryList",slice.categoryList)

  useEffect(() => {
    getCategory();
    getTypes()
}, []); 

 const getTypes = async () => {
  const headers = { 'Authorization':`Bearer ${token}`};
  await axios.get('https://balaramesh8265.pythonanywhere.com/settingGettypeList',{ headers }).then((res)=>{
      dispatch(setTypesList(res.data));
      console.log('tys',res.data)
       }) 
      }
      console.log("dbTypeList",slice.typesList)



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
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Please give a "${slice.selectedTypeName}" to  "${slice.selectedCategoryName}" with these given datas only "${stringedPairs}" in a email format without subject and don't give empty placeholders`,
                },
              ],
            },
          ],
        },
      });
      dispatch(setAnswer(response["data"]["candidates"][0]["content"]["parts"][0]["text"]))
      dispatch(setIsApiResponseReceived(true))

      const paragraph = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      console.log("paragraph",paragraph);
      
      const valueArray = pairs.map((pair) => pair.value);
      const keyArray = pairs.map((pair) => pair.key);
       let newParagraph = paragraph;
       valueArray.forEach((value, index) => {
      if (newParagraph.includes(value)) {
        newParagraph = newParagraph.replace(
          new RegExp(value, "g"),
          `[Enter ${keyArray[index]}]`
        );
        setUpdatedContent(newParagraph);
      }
    });
  }

     const handleContentEdit = (e) => {
      dispatch(setAnswer(e.target.value));
    };

     const handleSendEmail = (e) => {
      e.preventDefault();
     
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=''&body=${encodeURIComponent(
        slice.answer
      )}`;
      window.open(gmailLink, "_blank");
      dispatch(setIsPopUp(true))
    };
    // const handleSendEmail = (e)=>{
    //   const data = {
    //     to_email:toEmail,
    //     subject:toEmailSubject,
    //     message:template
    //   } 
    //     emailjs
    //     .send('service_1mw2acd', 'template_4ri6k1g', data,'KdWIYkl5o-ZZ1K9nF')
    //     .then(
    //       (result) => {
    //         console.log('SUCCESS!',result.text);
    //         alert('Email send successfull✔️')
    //         setShow(false);
    //         navigate("/template")
    //       },
    //       (error) => {
    //         console.log('FAILED...', error.text);
    //         console.log('error',error)
    //         alert('Email send failed❌')
  
    //       },
          
    //     )
    //   }
  

     




return (
  <>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    integrity="sha384-DyZ88mC6Up2uqS1DVho8X8v50C6H3l8Nj+lsIX4rtZ3q/k1bsRjhR2KxAxhgjjvL"
    crossorigin="anonymous"
  />
  
  <div className='generatePageContainer' >
   <center>
    <header>
      <ListExample/>
    </header>
   <br/>
   <div>
     <br/>
     <div className="container">
        <div className="row justify-content-center border-dark rounded p-3">
          <div className="col-md-6 align-self-center text-center" style={{ position: 'relative' }}>
            <select
              className="form-control"
              name="choices-language"
              id="choices"
              onChange={(e) => {
                dispatch(setSelectedCategory(e.target.value));
                dispatch(setIsCategorySelected(true));
              }}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                paddingRight: '2rem',
                background: 'gainsboro',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                width: '100%',
              }}
            >
              <option disabled selected>
                      Select Email Recipient
              </option>
              {slice.categoryList.map((categories, i) => (
                <option key={i} value={categories.categoryId}>
                  {categories.categoryName}
                </option>
              ))}
            </select>
            <i
              className="fa fa-chevron-down"
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#333',
              }}
            />
          </div>
        </div>
      </div>
        <br />
     {slice.isCategorySelected &&
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 align-self-center text-center" style={{ position: 'relative' }}>
            <select
              className="form-control"
              name="choices-language"
              id="choices"
              onChange={(e) => {
                dispatch(setSelectedType(e.target.value));
                dispatch(setIsTypeSelected(true));
              }}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                paddingRight: '2rem',
                background: 'gainsboro',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                width: '100%',
              }}
            >
              <option disabled selected>
                Select Email Type
              </option>
              {slice.typesList.map((types) => (
                slice.selectedCategory == types.categoryId && (
                  <option key={types.typeId} value={types.typeId}>
                    {types.typeName}
                  </option>
                )
              ))}
            </select>
            <i
              className="fa fa-chevron-down"
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#333',
              }}
            />
          </div>
        </div>
      </div>
      }
      <br />
      </div>
      {slice.isTypeSelected &&
        <>
          <h2 style={{ color: 'black', fontFamily: 'Arial, sans-serif' }} >Add Your Email Datas</h2>
          <div className="container mt-4">
            <form onSubmit={handleGenerate}>
              {pairs.map((pair, i) => (
                <div key={i} className="mb-3">
                  <div className="row g-3 align-items-center justify-content-center">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Name"
                        value={pair.key}
                        onChange={(event) => handleKeyChange(i, event)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Varshini"
                        value={pair.value}
                        onChange={(event) => handleValueChange(i, event)}
                      />
                    </div>
                    <div className="col-md-1 text-center">
                      <button
                        type="button"
                        className="btn btn-danger mt-3"
                        onClick={() => handleRemoveInputBox(i)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mb-3 text-center mt-4">
                <button type="button" className="col-md-2 btn btn-primary" onClick={handleAddPair}>Add Data</button>
                <button type="submit" className="col-md-2 btn btn-success ms-2" onClick={generateAnswer}>Generate</button>
              </div>
            </form>
          </div>
        </>
      }
 
     <Modal show={slice.isPopUp} onHide={handleClose}>
       <center>
         <Modal.Header closeButton>
           <Modal.Title> {slice.selectedTypeName} to {slice.selectedCategoryName}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
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
                <Button variant="secondary" onClick={handleClose}>
                  Regenerate
                </Button>
                {slice.isApiResponseReceived ? (
                  <Button className="saveButton" onClick={handleSave}>
                    Save Template
                  </Button>
                ) : null}
                {slice.isApiResponseReceived ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSendEmail}
                  >
                    Send E-Mail
                  </Button>
                ) : null}
              </Modal.Footer>
            </center>
          </Modal>
 </center>
      </div>
    </>
  );
}
export default Dashboard;
