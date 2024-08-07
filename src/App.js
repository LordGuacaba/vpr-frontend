import './App.css';
import { useRef, useState } from 'react';
import axios from "axios";
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton'

function App() {

  const [outputName, setOutputName] = useState("")
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)
  const downloadLink = useRef("")
  const baseUrl = "http://localhost:8000";

  const handleAddFile = e => {
    setFile(e.target.files[0])
  }

  const handleNameChange = e => {
    setOutputName(e.target.value)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = downloadLink.current
    link.setAttribute('download', `${outputName || "expanded"}.pptx`)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadLink.current)
    downloadLink.current = ""
    setDownloadReady(false)
  }

  const getCaptions = filename => {
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink)
    }
    axios.get(`${baseUrl}/presentation/${filename}`, {responseType: 'blob'})
    .then(response => {
      if (response.status === 200) {
        downloadLink.current = URL.createObjectURL(response.data)
        setLoading(false)
        setDownloadReady(true)
        axios.delete(`${baseUrl}/presentation/${outputName || "expanded"}`)
        .catch(error => console.error("DeleteErr:", error))
      } else {
        setLoading(false)
      }
    })
    .catch(error => console.error("Error:", error))
  }

  const handleFileSubmission = e => {
    e.preventDefault();
    setLoading(true)
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
      <Typography variant={'h2'} sx={{fontFamily: 'serif', fontWeight: 'bold'}}>Visual Packet Reader</Typography>
      <Container maxWidth={'sm'}>
        <form onSubmit={handleFileSubmission}>
          <Stack spacing={2} sx={{mb: 3}}>
            <Typography variant='h6'>File Submission</Typography>
            <input type="file" onChange={handleAddFile} />
            <TextField label="Packet Name" onChange={handleNameChange} />
            <Button variant="contained" type="submit" sx={{color: 'primary'}}>Create Powerpoint</Button>
          </Stack>
        </form>
        </Container>
        <LoadingButton variant="outlined" loading={loading} disabled={!downloadReady} onClick={handleDownload}>Download</LoadingButton>
    </div>
  );
}

export default App;
