import './App.css';
import { useState } from 'react';
import axios from "axios";
import { Link } from '@mui/material';

function App() {

  const [outputName, setOutputName] = useState("")
  const [file, setFile] = useState()
  const [link, setLink] = useState("")
  const baseUrl = "http://localhost:8000";

  const handleAddFile = e => {
    setFile(e.target.files[0])
  }

  const handleNameChange = e => {
    setOutputName(e.target.value)
  }

  const removeReferences = () => {
    URL.revokeObjectURL(link)
    setLink("")
  }

  const deleteFile = filename => {
    axios.delete(`${baseUrl}/presentation/${filename}`)
    .catch(error => console.error("GetError:", error))
  }

  const handleFileSubmission = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    console.log("test")
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(`${baseUrl}/create?name=${outputName}`, formData, config)
    .then(response => setLink(URL.createObjectURL(response.data)))
    .catch(error => console.error("Error: ", error))
    .finally(deleteFile(outputName || "expanded"))
  }

  return (
    <div className="App">
      <h1>Visual Packet Reader</h1>
      <form onSubmit={handleFileSubmission}>
        <h2>File submission</h2>
        <input type="file" onChange={handleAddFile} />
        <input type="text" onChange={handleNameChange} />
        <button type="submit">Create Powerpoint</button>
      </form>
      <Link href={link} download={`${outputName || "expanded"}.pptx`} onClick={removeReferences}>Download Result</Link>
    </div>
  );
}

export default App;
