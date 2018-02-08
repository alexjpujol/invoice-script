const XLSX = require('xlsx');
const fs = require('fs');

//take in various reports
const paymentData = XLSX.readFile('input-data.csv');
const contactData = XLSX.readFile('contact-data.xlsx');


const campaigns = workbook["Sheets"]["Sheet1"];
const jsonData = XLSX.utils.sheet_to_json(data);

//filter out non-invoiced campaigns
const invoicedRows = jsonData.filter(data => {
    if (data.payment_description === 'Invoice') {
        return data;
    }
})

const plusAdName = invoicedRows.map(data => {
    data.ad_name = "Insert add name here";
    //delete irrelevant properties?
    return data;
})

console.log(plusAdName);