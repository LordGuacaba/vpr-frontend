import './App.css';
import { useState } from 'react';
import axios from "axios";

function App() {

  const [outputName, setOutputName] = useState("")
  const [file, setFile] = useState()

  const handleAddFile = e => {
    setFile(e.target.files[0])
  }

  const handleNameChange = e => {
    setOutputName(e.target.value)
  }

  const handleFileSubmission = e => {
    const baseUrl = "http://localhost:8000";
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(`${baseUrl}/create?name=${outputName}`, formData, config)
    .then(response => console.log(response.data))
    .catch(error => console.error("Error: ", error))
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
    </div>
  );
}

export default App;
