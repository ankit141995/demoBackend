 const { google } = require("googleapis");

 
 const readGsheets = async(sheet)=>{
 let auth
 let spreadsheetId
 if(sheet=='Sheet1'||sheet=='Sheet2'){
  auth = new google.auth.GoogleAuth({
    keyFile: "./keys.json",
    // keyFile: "./keys3.json",
    // key:"AIzaSyCVa8F4k0RLDr0hgHm-LqjFLsTAC2SmfqM",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    
  });
 } else {
 auth = new google.auth.GoogleAuth({
    // keyFile: "./keys.json",
    keyFile: "./keys3.json",
    // key:"AIzaSyCVa8F4k0RLDr0hgHm-LqjFLsTAC2SmfqM",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    
  });

 }
  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });
if(sheet=='Sheet1'||sheet=='Sheet2'){

   spreadsheetId = "1H_s0g-5kKHFxyTKtilWQYSMSo0WifwDlXUN9afaQ85M";
}else {
  spreadsheetId = "1r4xDwwAEqKhlxYFjKwx6hBFKOUnleKFLAbCa-9vVVBg";
}
  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });
  // console.log(metaData.data)
  
  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    // range: "Sheet1!A:P",
    range: `${sheet}!A:P`,
  })
  // console.log(getRows.data)
return getRows
}



module.exports = {readGsheets}