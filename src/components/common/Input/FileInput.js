import React, { useState } from 'react'

const FileInput = ({accept,id,fileHandleFnc,text}) => {
  //accept is for which files to accept like their can be many forms like image,video etc
  const [fileSelected,setFileSelected] = useState("");

  const onChange=(e)=>{
    console.log(e.target.files)
    setFileSelected(e.target.files[0].name)
    fileHandleFnc(e.target.files[0])
  }
  return (
    <>
      <label htmlFor={id} className={`custom-input ${!fileSelected? "label-input" :"active"}`}>
        {fileSelected ? `The File ${fileSelected} was selected` : text}
      </label>
      <input 
      type='file' 
      accept={accept} 
      id={id} 
      style={{display:"none"}}
      onChange={onChange}
      />
    </>    
  )
}

export default FileInput