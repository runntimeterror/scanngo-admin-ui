import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { useCSVReader } from 'react-papaparse'

export default function Home() {
  const { CSVReader } = useCSVReader();
  const [tableHead, setTableHead] = useState([]);
  const [rows, setRows] = useState([]);

  const submitData = (event) => {
    // console.log(fileRef.current.files)
    // if (!fileRef) {
    //   return
    // }
    event.preventDefault()
  }

  const onUploadCSV = (results) => {
    const { data, errors, meta } = results
    const [tableHead, ...rows] = data
    setTableHead(tableHead)
    setRows(rows)
  }

  return (
    <main className={styles.main}>
      <h1>Admin UI</h1>
      <CSVReader onUploadAccepted={onUploadCSV}>
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }) => (
          <>
            <div className={styles.csvReader}>
              <button type='button' {...getRootProps()} className={styles.browseFile}>
                Browse file
              </button>
              <div className={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button {...getRemoveFileProps()} className={styles.remove}>
                Remove
              </button>
            </div>
            <ProgressBar className={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      { tableHead.length > 0 && (
      <table>
        <tr>
          { tableHead.map((columnName, i) => (
            <th key={i}>{ columnName }</th>
          ))}
        </tr>
        { rows.length > 0 && rows.map((row, k) => (
          <tr key={k}>
            { row.map((item, j) => (
              <td key={j}>{ item }</td>
            ))}
          </tr>
        ))}
      </table>
      )}
    </main>
  )
}