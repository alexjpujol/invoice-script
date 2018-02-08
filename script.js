const XLSX = require('xlsx');
const fs = require('fs');

//take in various reports
const paymentData = XLSX.readFile('input-data.csv');
const contactData = XLSX.readFile('contact-data.xlsx');


const campaigns = paymentData["Sheets"]["Sheet1"];
const campaignJSON = XLSX.utils.sheet_to_json(campaigns);

//filter out non-invoiced campaigns
const invoicedRows = campaignJSON.filter(data => {
        if (data.payment_description === 'Invoice') {
            return data;
        }
    })
    .map(data => {
        data.ad_name = "Insert ad name here";
        //delete irrelevant properties?
        return data;
    });


console.log(invoicedRows);