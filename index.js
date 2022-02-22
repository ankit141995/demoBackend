const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
const port = 3030;
const csv = require('csv-parser');
const fs = require('fs');
const someObject = require('./updatedmenu.json')
const bodyParser = require('body-parser');
const { ReadExcel } = require('../src/components/ReadExcel');
var XLSX = require("xlsx");
const cookieParser = require("cookie-parser");
const { google } = require("googleapis");
const {readGsheets} = require('./controller/googleSheet')
const db = require('./db/data.js')
// const {ReeadExcel}= require('./controller/ReadExcel')
const {authUser, authRole} = require('./auth/basicAuth.js');
const { timeStamp } = require('console');
// const project = require('./projects.js')
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json'
const  qrcode = require('qrcode-terminal');





app.use(cors())
app.use(express.json())
app.use(cookieParser());
// app.use("/projects", project)
// let result = []
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

let array2 = []
let result = {}; //(1)

const admin = {id:'myself', username:'saurav', password:'test123'}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/result', async (req, res) => {
 let gsdata = await readGsheets('Form Responses 1')
//  let gsdata = await readGsheets('Sheet1')
 console.log(gsdata)
  res.send(gsdata.data)
})






// let sessionData;


// client.on('authenticated', (session) => {    
//     // Save the session object however you prefer.

//     // Convert it to json, save it to a file, store it in a database...
// });



// if(fs.existsSync(SESSION_FILE_PATH)) {
//   sessionData = require(SESSION_FILE_PATH);
// }

// // Use the saved values
// const client = new Client({
//     session: sessionData
// });

// client.on('qr', (qr) => {
//     // Generate and scan this code with your phone
//     console.log('QR RECEIVED', qr);
//     qrcode.generate(qr, {small:true})
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });



// // Load the session data if it has been previously saved


// // Save session values to the file upon successful auth
// client.on('authenticated', (session) => {
//     sessionData = session;
//     fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
//         if (err) {
//             console.error(err);
//           }
//         });
//       });
      
      

      
//       client.initialize();
      
      
      
      
      
      























app.get('/', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.json(someObject.menu)
  res.status(200)
  res.end
  console.log(req.body, 'hello world')
  console.log('hello from main')
})




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
        console.log('-----for each items ', foodName)
        let data1 = data.map((item) => { return item.ingredients })
        let data2 = realData[0].map((item, idx) => { return item[foodName] })
        let key = foodName
        json1[key] = json2
        // console.log('data 1 and data 2 ', data1 , data2)
  
        data1.map((val, idx) => {
          // console.log('val is here ', val)
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

const verifyJWT = (req, res, next)=>{
  console.log(req)
  const token = req.headers['x-access-token']
  if(!token){
    res.send('there is no-token')
  }
    else{
      jwt.verify(token, 'secret', (err, decoded)=>{
          if(err){
            console.log(err)
            res.json({auth:false, message:'authentication failed'})
          }   else{
            req.userId=decoded.id;
            next()
          }
      })
  }
}

const details =  {orderAdmin:admin}

// app.get('/login', verifyJWT, (req, res)=>{
// })

app.post('/login', authUser,(req, res)=>{
  console.log('--------------LOGIN request ')
  // res.setHeader('content-type', 'application/json');
  
  const user = {username:req.body.user, password:req.body.password}
  console.log(req.header)
  // console.log(db.users)
  
  const userRole = db.users.find((obj)=>{
    return obj.name===user.username
    })
  if(user.password==userRole.password){
 const role =userRole.role
 const name= userRole.name
 const id= userRole.id

    const token = jwt.sign({name, role}, 'secret', {
      expiresIn:600,
    })
    console.log('user role is here ' , userRole)
res.json({auth:true, token:token, role, name, id})
  }
 else{
    res.json({auth:false, messege:'you are not authenticated'}) 
  }


  res.status(200)
  // res.send(user)
})

app.get('/login',  (req, res)=>{
  console.log('--------------X-access-token request ')
  // res.setHeader('content-type', 'application/json');
  
  const user = {username:req.body.user, password:req.body.password}
  console.log(req.header)
  
    const tokenn = req.headers['x-access-token']
    const decoded = jwt.verify(tokenn, 'secret')
    console.log("decoded is here ",decoded)
    const userRole = db.users.find((obj)=>{
    // console.log(obj)
    return obj.name===user.username
    })
    console.log(userRole)
    if(decoded.user==userRole){
    
    res.json({auth:true, user:decoded.name, role:decoded.role})
  }
  else{
    res.json({auth:false, messege:'you are not authenticated'}) 
  }

  res.status(200)
  // res.send(user)
})




app.get('/api', (req, res) => {
  console.log('------------------------POST REQUEST')
  const checkItem = (item) => {
    return item.dishName.toLowerCase().includes(req.query.input)
  }
  const Filter = someObject.menu.filter(checkItem).slice(0 ,6)
  console.log('data sent ', Filter.map((item) => {
    return item.dishName
  }))
  
  res.send(Filter)
})




app.post('/form' , async(req, res)=>{
  // console.log(req.body.body)
  const {email, advancePaid, agent, guest, orderslot, dishes, location, servingTime, pickupTime, totalBill, addONs, costumerName, order, other, date} = req.body.body
  let timeStamp = new Date()
  
        //2021-12-17
        // console.log(date)
        var inputDate =  date
        var da = inputDate.slice(8)
        var mo = inputDate.slice(5,7)
        var ye = inputDate.slice(0,4)
        
        
        var h = timeStamp.getHours()+1
        var m = timeStamp.getMinutes()+1
        let d = timeStamp.toLocaleDateString('en-US')+' '+h+':'+m
       
       const splitintoline =(data)=>{
        var dishes2 = data && data.map((ele, idx)=>{
          let ele2= `${idx+1}.${ele}`
          // console.log(ele2)
          // ele2.replace(/,/g, '\n')
          return ele2
        })
        // console.log(dishes2)
        let dishes3 = JSON.stringify(dishes2)
        let dishes4 = dishes3.replace(/[\[\]'"]+/g,'')
        let dishes5=[]
        // dishes5[0]='Dishes'
        dishes5.push(dishes4)
        var dishes6 = dishes5.toString().replace(/,/g, '\n')
        // console.log(dishes5)
      return dishes6
      }
        let outputdate = `${da}/${mo}/${ye}`
        // console.log(outputdate)
        
        // addONs
        let addONsarr = []
        for (const [addons, value] of Object.entries(addONs)) {
  
          if (value && addons!='Others') {
    addONsarr.push(addons)
  } if(addons=='Others' && value){
    addONsarr.push(other)
  }
}

        let stringaddons = JSON.stringify(addONsarr)

  let outputArr = [d, '', order, agent, outputdate, costumerName, guest, splitintoline(dishes), splitintoline(addONsarr), orderslot, servingTime, pickupTime, location , totalBill, advancePaid, email]
  
  //auth google
  const auth = new google.auth.GoogleAuth({
    keyFile: "./keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1H_s0g-5kKHFxyTKtilWQYSMSo0WifwDlXUN9afaQ85M";

  const request = {
  spreadsheetId, 
   valueInputOption: "RAW",
   range: 'A20:A30',
   insertDataOption:'INSERT_ROWS',
   resource:{
    //  range: "A24:P25",
    majorDimension: "ROWS",
    
    values: [
    outputArr
  ]},
  auth:client
  }
  try {
    const response = (await googleSheets.spreadsheets.values.append(request)).data;
    console.log(response, outputArr)
    // TODO: Change code below to process the `response` object:
    // console.log(JSON.stringify(response, null, 2));
    res.send(response)
  } catch (err) {
    // console.log(err, outputArr)
    // console.error(err);
    res.send(err)
  }
  
  

})


const TotalIng = (data, guestCount) => {
  // console.log('total function', data, guestCount)
  result = {}
  data.forEach(basket => { //(2)
    for (let [key, value] of Object.entries(basket)) { //(3)
      let num = value * guestCount 
      if (result[key]) { //(4)
        console.log('num is here' ,num)
        result[key] += num; //(5)
      } else { //(6)
        console.log('num is here' ,num)
        result[key] = num;
      }
    }
  });
  // console.log('result is here ', result)
  return result; //(7)
}

const allTotalIng = (data, guestCount, items) => {
  // console.log('total function', "data, guestCount", items)
  result = {}
  // geustCount.forEach((dish)=>{

    data.forEach((basket, idx) => { //(2)
      // console.log('basket is here  -------------------------------------',basket)
      for (let [key, value] of Object.entries(basket)) { //(3)
        // console.log(key , value, guestCount[items[idx]], items[idx])
        let num = value * guestCount[items[idx].title]
        // console.log('result key is here', result)
        if (result[key]) { //(4)
          // console.log('num is here' , num)
          result[key] += num; //(5)
        } else { //(6)
          // console.log('num is here' , num)
          result[key] = num;
        }
      }
      console.log('result is here ', result)
    });
  // })
  return result; //(7)
}


app.post('/api', async (req, res) => {
  console.log(req.body)
  items = req.body.menu
  guestCount = req.body.guestCount
  console.log(items)
    console.log(guestCount)
  res.setHeader('content-type', 'application/json');
  ReeadExcel(items)
  TotalIng(array2, guestCount)
  res.send({
    ingredients: json1,
    total: result
  })
  res.status(200)
})



app.post('/api2', async (req, res) => {
  // console.log(req.body)
  items = req.body.menu
  guestCount = req.body.guestCount
  // console.log(items)
    // console.log(guestCount)
    let dishes = []
    req.body.menu.forEach(basket => { //(2)
    for (let [key, value] of Object.entries(basket)) { //(3)
    dishes.push(value)
    }
  });
  res.setHeader('content-type', 'application/json');
  ReeadExcel(dishes)
  allTotalIng(array2, guestCount, items)
  res.send({
    ingredients: json1,
    total: result
  })
  res.status(200)
})





app.post('/gen', (req, res)=>{
  console.log('--------GEN REQ')
  console.log(req.body.orders)
  TotalIng(array2, req.body.orders.guestCount)
  res.json(result)
})


app.post('/textarea', (req, res)=>{
  var input = req.body.body
  let split = input.toLowerCase().trim().split('\n').map((item)=>{ return item.replace(/^\d+\.\s*/, '').trim()})
  let str1
  let str2
  let str3 
  let matcharray = []
  let suggestions = []
  let suggested = []
  console.log('split is here ' , split)
  let matched
  const filterDishes = split.map((dish, idx)=>{
   
   console.log(dish, 'at ', (idx+1))
  str1 = dish.replace(/\s/g, '').trim();
  str2 = dish.substring(0,3)
  const calculateScore = (str = '') => {
    return str.split("").reduce((acc, val) => {
      return acc + val.charCodeAt(0);
    }, 0);
  };
  const compareASCII = (str1, str2) => {
    const firstScore = calculateScore(str1);
    const secondScore = calculateScore(str2);
    return Math.abs(firstScore - secondScore);
  };
  const checkItem = (item) => {
    // console.log('item is here, ',str2)
    return item.dishName.toLowerCase().includes(str2.toLowerCase())
  }
  const Filterr = someObject.menu.filter(checkItem)
  
  suggested= []
matched = Filterr.map(basket => { 
    for (let [key, value] of Object.entries(basket)) {
        if(key==='dishName'){
          // console.log(value)
        
        
        let value2 = value.replace(/\s/g, '').toLowerCase()
        let diff = compareASCII(str1, value2)
        // console.log(diff)
        // if(diff>3){
        //   console.log("value doesn't match" , diff , value)
        // return null}
          if (diff < 100) {
            // console.log('suggested is here ' ,suggested)
            suggested.push(value)
            if (diff < 5) {
              if(diff<3){

                // suggested=[]
              }
              console.log('value matched', diff, value)
              if (!matcharray.includes(value)) {
                matcharray.push(value)
                // suggested=[]

              }
              return value
            }
            // else { suggested.push(value) }
            return suggested
          }
        }
    
    }
  })
  suggestions.push(suggested)
})
console.log('matched is here ', matched)
console.log('suggestions is here ', suggestions)

// console.log(str2, Filterr)

  res.send({matcharray:matcharray, split:split, suggestions:suggestions})
})


app.post('/ac', async(req,res)=>{
   const {orderno, chefdetails} = req.body
   const date = new Date().getTime()

   const auth = new google.auth.GoogleAuth({
    keyFile: "./keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1H_s0g-5kKHFxyTKtilWQYSMSo0WifwDlXUN9afaQ85M";

  const request = {
  spreadsheetId, 
   valueInputOption: "RAW",
   range: 'Sheet2!A:C',
   insertDataOption:'INSERT_ROWS',
   resource:{
    //  range: "A24:P25",
    majorDimension: "ROWS",
    
    values: [
    [date, orderno, chefdetails]
  ]},
  auth:client
  }
  try {
    const response = (await googleSheets.spreadsheets.values.append(request)).data;
    console.log(response, outputArr)
   
    res.send(response)
  } catch (err) {

    res.send(err)
  }

 
})

app.post('/assignchef', async(req, res)=>{
  console.log('assignchef details are here ',req.body.orderNumber)
   let gsdata = await readGsheets('Sheet2')
  //  console.log(gsdata.data.values)
  let reqb = req.body.orderNumber
  const orderno = reqb.slice(2)
  let issAssigned=false 
  let time = new Date().getTime()
  let chefDetails  = gsdata.data.values
  let requiredDetails = []
  chefDetails.map((item, idx)=>{
    // console.log('details are here ', item[1], orderno)
    if(item[1].includes(orderno)){
      requiredDetails.push(item)
    }
  })
  console.log(requiredDetails)
   res.send(requiredDetails[requiredDetails.length-1])
})







//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, () => {
  console.log(`Server running at :${port}`);
});

// console.log(' this is the read stream ' , read)