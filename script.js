const XLSX = require('xlsx');
const fs = require('fs');

//take in various reports
const consumptionData = XLSX.readFile('self-serve-consumption-Jan2018.csv');
const consumptionJSON = XLSX.utils.sheet_to_json(consumptionData["Sheets"]["Sheet1"]);

const salesforceData = XLSX.readFile("Ad Studio Opportunities-2.8.18.xlsx");
const salesforceJSON = XLSX.utils.sheet_to_json(salesforceData["Sheets"]["Sheet1"]);

const tableauData = XLSX.readFile("tableau-data.csv");
const tableauJSON = XLSX.utils.sheet_to_json(tableauData["Sheets"]["Sheet1"]);



const regex = new RegExp(/[^A-Za-z0-9]+/g);


const normalizedSFName = salesforceJSON.map(campaign => {
    campaign["Opportunity Name"] = campaign["Opportunity Name"].replace(regex, '').toLowerCase().trim();
    return campaign;
});

console.log(normalizedSFName);


//filter out non-invoiced campaigns
const invoicedRows = consumptionJSON.filter(data => {
        if (data.invoiced === 'true') {
            return data;
        }
    })
    // Get the ad name from the Tableau report. Looks up ad ID in Tableau and returns the Ad Studio name 
    .map(data => {
        const match = tableauJSON.find(campaign => campaign["Ad Id"] === data.ad_id);
        if (!match) {
            data.ad_name = "Ad Name Not Found";
            return data
        }
        data.ad_name = match["Ad Studio Name"];
        return data;
    })

    //pull in the opp ID and acc
    .map(data => {
        const normalizedName = data.ad_name.replace(regex, '').toLowerCase().trim();
        const match = normalizedSFName.find(campaign => campaign["Opportunity Name"] === normalizedName);
        if (!match) {
            data.opportunity_code = "Opp code not found";
            data.account_code = "Acc code not found";
            return data;
        }
        data.opportunity_code = match["Opportunity Code"];
        data.account_code = match["Account code"];
        return data;
    });

    console.log(invoicedRows);


    const finalData = XLSX.utils.json_to_sheet(invoicedRows);
    const stream = XLSX.stream.to_csv(finalData);
    stream.pipe(fs.createWriteStream("output.csv"));