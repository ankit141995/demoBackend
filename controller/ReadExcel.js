var XLSX = require("xlsx");
let items = []
let realData = []
let headers = {}
let data = []
let guestCount
let row=[]
let col = []
let value=[]
let json1 = {}
let json2 = {}


const ReeadExcel = (items) => {
    json1 = {}
  
    array2 = []
    data = []
    realData = []
    console.log('ReeadExcel funciton is running')
    var workbook = XLSX.readFile("react.xlsx");
    var sheet_name_list = workbook.SheetNames;
    console.log('sheet name is here ', sheet_name_list); // getting as Sheet1
  
    sheet_name_list.forEach(function (y) {
      var worksheet = workbook.Sheets[y];
      //getting the complete sheet
      // console.log('work sheet ', worksheet);
  
  
  
      var headers = {};
      var data = [];
      for (cellname in worksheet) {
        // array2 = []
        if (cellname[0] === "!") continue;
        //parse out the column, row, and value
        var col = cellname.substring(0, 1);
        // colData.push(col)
        // console.log('column ', col, '  ||   z is value ', z[1]);
  
        var row = parseInt(cellname.substring(1));
       
        // console.log('row ', row);
  
        var value = worksheet[cellname].v
  
        if (row == 1) {
          
          // Dishes.push(value)
        }
        // }
  
  
        //store header names
        if (row == 1) {
          headers[col] = value;
          items.forEach((val) => {
            if (headers[col].includes(val)) {
              console.log('hi from headerCol')
              // colValue.push(col)
            }
            // console.log('hello from ', val)  
          })
          // console.log('header col ' , headers[col]);
          // storing the header names
          continue;
        }
  
        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
        // console.log('data ', '  header is here   ',[colData]);
  
        // colValue.forEach((val) => {
        //   if (col == val) {
  
        //     ingredients.push(value)
        //   }
          // console.log('ingredients  ', ingredients)
        // })
      }
  
  
      
  
      //drop those first two rows which are empty
      data.shift();
      data.shift();
      realData.push(data)
      items.forEach((foodName) => {
        // console.log('-----for each items ', foodName)
        let data1 = data.map((item) => { return item.ingredients })
        let data2 = realData[0].map((item, idx) => { return item[foodName] })
        let key = foodName
        json1[key] = json2
        // console.log('data 1 and data 2 ', data1 , data2)
  
        data1.map((val, idx) => {
          console.log('val is here ', val)
          if (!data2[idx] == 0
            // && !data1[idx]==undefined
            && val
            && !isNaN(data2[idx])
            && val !== ''
          ) {
  
            let key1 = val
            json2[key1] = {}
            json2[key1] = parseInt(data2[idx])
            // console.log('key1 is here ', key1)
            // console.log('=============')
          }
        });
        array2.push(json2);
        // console.log('json2 is here ', json2)
  
        json2 = {}
      });
    })
  }
 
module.exports = {ReeadExcel}