import React, { useState } from 'react';
import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";
import { Importer, ImporterField } from 'react-csv-importer';

// include the widget CSS file whichever way your bundler supports it
//import 'react-csv-importer/dist/index.css';

const host = API_DOMAIN;
const token = "123";//localStorage.getItem("token");
const sessionId = getCookie("sessionId");
const clientId = getCookie("storeId") || sessionId;
const headers = new Headers({
    "Content-Type": "application/json",
    "Session-Id": sessionId,
    "Client-Id": clientId,
    Authorization: `Bearer ${token}`,
  });

const InventoryBulk = () => {
    const [err, setErr] = useState('');
    let csvRowData = []
    function csvDataHandler(rows) {
        console.debug(rows)
        csvRowData.push(rows)
    }
    // in your component code:
    return (
        <>
            <Importer
                dataHandler={csvDataHandler}
                defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
                restartable={false} // optional, lets user choose to upload another file when import is complete
                onStart={({ file, preview, fields, columnFields }) => {
                    // optional, invoked when user has mapped columns and started import
                    //prepMyAppForIncomingData();
                }}
                onComplete={({ file, preview, fields, columnFields }) => {
                    // invoked right after import is done (but user did not dismiss/reset the widget yet)

                    // dedupe rows
                    csvRowData = csvRowData.filter((value, index) => {
                        const _value = JSON.stringify(value);
                        return index === csvRowData.findIndex(obj => {
                            return JSON.stringify(obj) === _value;
                        });
                    }).flat();
                    console.log(csvRowData)

                    // clean up data
                    csvRowData.forEach((row) => {
                        row.productId = Number(row.productId.trim())
                        row.qty = row.qty ? Number(row.qty.trim()) : 1
                        row.active = row.active ? row.active === 'TRUE' : true
                    })

                    // make REST call
                    const requestOptions = {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(csvRowData)
                    };
                    fetch(host + '/inventory', requestOptions)
                        .then(response => {
                            if (response.ok)
                                return response.json()
                            else
                                return response.text().then(text => { console.error(text); throw new Error(text) })
                        })
                        //.then(data => setErr(JSON.stringify(data)))
                        .catch(err => setErr(err.message))
                        // Note: it's important to handle errors here 
                        // instead of a catch() block so that we don't swallow
                        // exceptions from actual bugs in components
                        , err => { setErr(err.message) };

                }}
                onClose={({ file, preview, fields, columnFields }) => {
                    // optional, if this is specified the user will see a "Finish" button after import is done,
                    // which will call this when clicked
                    //goToMyAppNextPage();
                    alert('Succesfully imported ' + csvRowData.length + ' rows')
                }}

            // CSV options passed directly to PapaParse if specified:
            // delimiter={...}
            // newline={...}
            // quoteChar={...}
            // escapeChar={...}
            // comments={...}
            // skipEmptyLines={...}
            // delimitersToGuess={...}
            // chunkSize={...} // defaults to 10000
            // encoding={...} // defaults to utf-8, see FileReader API
            >
                <ImporterField name="productId" label="Product ID" />
                {/* <ImporterField name="name" label="Name" optional  /> */}
                <ImporterField name="price" label="Price" optional />
                <ImporterField name="qty" label="Quantity" optional />
                <ImporterField name="active" label="Active?" optional />
            </Importer>

            {err && <h3 className="error"> {err} </h3>}
        </>
    )
};

export default InventoryBulk;