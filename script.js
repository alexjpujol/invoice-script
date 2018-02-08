const XLSX = require('xlsx');
const fs = require('fs');

//take in various reports
const paymentData = XLSX.readFile('input-data.csv');
const paymentJSON = XLSX.utils.sheet_to_json(paymentData["Sheets"]["Sheet1"]);

const contactData = XLSX.readFile('contact-data.xlsx');
const contactJSON = XLSX.utils.sheet_to_json(contactData["Sheets"]["Sheet1"]);

const campaignData = XLSX.readFile('campaign-data.csv');
const campaignJSON = XLSX.utils.sheet_to_json(campaignData["Sheets"]["campaign-data"]);

console.log(campaignJSON);


//filter out non-invoiced campaigns
const invoicedRows = paymentJSON.filter(data => {
        if (data.payment_description === 'Invoice') {
            return data;
        }
    })
    .map(data => {

        campaignJSON.forEach(campaign => {
            console.log(campaign);
            if (campaign["Ad\ Id"] === data.ad_id) {
                data.ad_name = campaign["Ad\ Studio\ Name"] || "NO AD NAME FOUND";
            }
        })

        // add in the contact and office
        contactJSON.forEach(contact =>  {
            if (contact.user_id === data.user_id) {
                data.contact = contact.contact || "NO CONTACT FOUND";
                data.company = contact.company_ln_office;
            }
        }
    );
        
        //delete irrelevant properties?
        return data;
    });

    //console.log(invoicedRows);

    //add data to a new sheet in excel
    paymentData.SheetNames.push("final_data");
    paymentData.Sheets["final_data"] = XLSX.utils.json_to_sheet(invoicedRows);


//export the final excel sheet
//XLSX.writeFile(paymentData, 'final-data.xlsx');