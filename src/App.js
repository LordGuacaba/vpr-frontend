import './App.css';
import { useState } from 'react';
import axios from "axios";
import { Button } from '@mui/material';

function App() {

  const [outputName, setOutputName] = useState("")
  const [file, setFile] = useState()
  const [downloadLink, setDownloadLink] = useState("")
  const [downloadReady, setDownloadReady] = useState(false)
  const baseUrl = "http://localhost:8000";

  const handleAddFile = e => {
    setFile(e.target.files[0])
  }

  const handleNameChange = e => {
    setOutputName(e.target.value)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = downloadLink
    link.setAttribute('download', `${outputName || "expanded"}.pptx`)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadLink)
    setDownloadLink("")
    setDownloadReady(false)
  }

  const getCaptions = filename => {
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink)
    }
    axios.get(`${baseUrl}/presentation/${filename}`, {responseType: 'blob'})
    .then(response => {
      if (response.status === 200) {
        setDownloadLink(URL.createObjectURL(response.data))
        setDownloadReady(true)
        axios.delete(`${baseUrl}/presentation/${outputName || "expanded"}`)
        .catch(error => console.error("DeleteErr:", error))
      }
    })
    .catch(error => console.error("Error:", error))
  }

  const handleFileSubmission = e => {
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
    .catch(error => console.error("Error: ", error))
    .finally(() => getCaptions(outputName || "expanded"))
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
      <Button disabled={!downloadReady} onClick={handleDownload}>Download</Button>
    </div>
  );
}

export default App;
