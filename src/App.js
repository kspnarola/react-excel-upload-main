import { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file'
import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';

function App() {
  const [uploadFile, setUploadFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (uploadFile) {
      readXlsxFile(uploadFile).then(rows => {
        setTableData(rows);
      })
    }
  }, [uploadFile])


  const handleChangeUploadFile = (file) => {
    setUploadFile(file)
  }

  return (
    <div className="App">
      <FileUploader handleChangeUploadFile={handleChangeUploadFile} />
      <DataTable tableData={tableData} />
    </div>
  );
}

export default App;
