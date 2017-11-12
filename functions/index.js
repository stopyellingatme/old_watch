const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });
// const express = require('express');
const parseurl = require('parseurl');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
// const Cookies = require('cookies');
const cookie = require('cookie');
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);
const sessionStoreRef = admin.initializeApp({
    credential: admin.credential.cert('./WatchTower_Test-1a502e556547.json'),
    databaseURL: 'https://watchtower-test-60111.firebaseio.com/'
});
const request = require('request');
const qs = require('querystring');
const moment = require('moment');
let currentYear = moment().format("YYYY");
var companyKey = '';


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
// const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailEmail = "watchtowerhelp@gmail.com";
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});



// QUICKBOOKS VARIABLE CONFIGS:
// var tools = require('./tools/tools.js'),
//       config = require('./config.json'),
//       request = require('request'),
//       jwt = require('./tools/jwt.js'),
//       url = require('url'),
//       Tokens = require('csrf'),
//       csrf = new Tokens(),
//       ClientOAuth2 = require('client-oauth2'),
//       session = require('express-session');
var tools = require('./tools/tools.js');
var path = require('path');
var config = require('./config.json');
var express = require('express');
var app = express();



app.use(cors);
// app.use(moment);

// app.use(cookieSession({
//   name: 'sess',
//   keys: ['secret'],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))
// app.use(cookie)
// app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({secret: 'secret', resave: 'false', saveUninitialized: 'true', cookie: { secure: true, maxAge: 4 * 60 * 60 * 1000 }}));
app.use(session({
    store: new FirebaseStore({
        database: sessionStoreRef.database()
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
        // cookie: { secure: true }
}));

// app.use(cookieParser('secret', secret))

// Initial view - loads Connect To QuickBooks Button
app.get('/', function(req, res) {
    res.render('home', config);
});

// Sign In With Intuit, Connect To QuickBooks, or Get App Now
// These calls will redirect to Intuit's authorization flow
app.use('/sign_in_with_intuit', require('./routes/sign_in_with_intuit.js'));
app.use('/connect_to_quickbooks', require('./routes/connect_to_quickbooks.js'));
app.use('/connect_handler', require('./routes/connect_handler.js'));

// Callback - called via redirect_uri after authorization
app.use('/callback', require('./routes/callback.js'));

// Connected - call OpenID and render connected view
app.use('/connected', require('./routes/connected.js'));

// Call an example API over OAuth2
app.use('/api_call', require('./routes/api_call.js'));
// app.options('/', cors())


// Start server on HTTP (will use ngrok for HTTPS forwarding)
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })

exports.quickbooksIntegrate = functions.https.onRequest(app);

// exports.connect_QB = functions.https.onRequest((req, res) => {
//     console.log(req.body);
//     companyKey = req.body.companyKey;
//     var start_Q1 = '-01-01',
//         end_Q1 = '-03-31',
//         start_Q2 = '-04-01',
//         end_Q2 = '-06-30',
//         start_Q3 = '-07-01',
//         end_Q3 = '-09-30',
//         start_Q4 = '-10-01',
//         end_Q4 = '-12-31';
//     var token = tools.getToken(req.session);
//     if (!token) return res.json({ error: 'Not authorized' });
//     if (!req.session.realmId) return res.json({
//         error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
//     });

//     var BS_URL_ARRAY = [];
//     var IS_URL_ARRAY = [];
//     var CF_URL_ARRAY = [];
//     // Iterate through all quarters and years between 2000 and the current year(i)/quarter(j)
//     for (i = 2000; currentYear >= i; i++) {
//         for (j = 1; 4 >= j; j++) {
//             if (j == 1) {
//                 var IS_url_0 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q1 + '&end_date=' + i + end_Q1;
//                 var BS_url_0 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q1 + '&end_date=' + i + end_Q1;
//                 var CF_url_0 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q1 + '&end_date=' + i + end_Q1;
//                 var IS_requestObj_0 = {
//                     url: IS_url_0,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var BS_requestObj_0 = {
//                     url: BS_url_0,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var CF_requestObj_0 = {
//                     url: CF_url_0,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 IS_URL_ARRAY.push(IS_requestObj_0);
//                 BS_URL_ARRAY.push(BS_requestObj_0);
//                 CF_URL_ARRAY.push(CF_requestObj_0);

//             } else if (j == 2) {
//                 var IS_url_1 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q2 + '&end_date=' + i + end_Q2;
//                 var BS_url_1 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q2 + '&end_date=' + i + end_Q2;
//                 var CF_url_1 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q2 + '&end_date=' + i + end_Q2;
//                 var IS_requestObj_1 = {
//                     url: IS_url_1,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var BS_requestObj_1 = {
//                     url: BS_url_1,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var CF_requestObj_1 = {
//                     url: CF_url_1,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 IS_URL_ARRAY.push(IS_requestObj_1);
//                 BS_URL_ARRAY.push(BS_requestObj_1);
//                 CF_URL_ARRAY.push(CF_requestObj_1);
//             } else if (j == 3) {
//                 var IS_url_2 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q3 + '&end_date=' + i + end_Q3;
//                 var BS_url_2 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q3 + '&end_date=' + i + end_Q3;
//                 var CF_url_2 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q3 + '&end_date=' + i + end_Q3;
//                 var IS_requestObj_2 = {
//                     url: IS_url_2,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var BS_requestObj_2 = {
//                     url: BS_url_2,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var CF_requestObj_2 = {
//                     url: CF_url_2,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 IS_URL_ARRAY.push(IS_requestObj_2);
//                 BS_URL_ARRAY.push(BS_requestObj_2);
//                 CF_URL_ARRAY.push(CF_requestObj_2);
//             } else if (j == 4) {
//                 var IS_url_3 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q4 + '&end_date=' + i + end_Q4;
//                 var BS_url_3 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q4 + '&end_date=' + i + end_Q4;
//                 var CF_url_3 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q4 + '&end_date=' + i + end_Q4;
//                 var IS_requestObj_3 = {
//                     url: IS_url_3,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var BS_requestObj_3 = {
//                     url: BS_url_3,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 var CF_requestObj_3 = {
//                     url: CF_url_3,
//                     headers: {
//                         'Authorization': 'Bearer ' + token.accessToken,
//                         'Accept': 'application/json'
//                     }
//                 }
//                 IS_URL_ARRAY.push(IS_requestObj_3);
//                 BS_URL_ARRAY.push(BS_requestObj_3);
//                 CF_URL_ARRAY.push(CF_requestObj_3);
//             }
//         }
//     }
//     setTimeout(function () {
//         // INCOME STATEMENT - Iterate over the IS_URL_ARRAY; Check if data is present; If so, parse the data and store to database.
//         for (var x = 0; IS_URL_ARRAY.length - 1 >= x; x++) {
//             var requester_IS = IS_URL_ARRAY[x];
//             request(requester_IS, function (err, response) {
//                 // Check if 401 response was returned - refresh tokens if so!
//                 tools.checkForUnauthorized(req, requester_IS, err, response).then(function ({ err, response }) {
//                     if (err || response.statusCode != 200) {
//                         return res.json({ error: err, statusCode: response.statusCode });
//                     }
//                     var resObj = JSON.parse(response.body);
//                     var HeaderOptions = resObj.Header.Option;
//                     // console.log('Income Statement Data Header: ' + HeaderOptions[1].Name);
//                     // THIS WILL TELL YOU IF THE REPORT HAS DATA!
//                     for (var i = 0; HeaderOptions.length - 1 >= i; i++) {
//                         if ((HeaderOptions[i].Value) == 'false') {
//                             var Date_Quarter_Year = moment(resObj.Header.StartPeriod, 'YYYY-MM-DD').format('Q-YYYY');
//                             var Date_QuarterOnly = moment(Date_Quarter_Year, 'Q-YYYY').format('Q');
//                             if (Date_QuarterOnly == 1) {
//                                 parseIncomeStatement(resObj, Date_Quarter_Year);
//                             } else if (Date_QuarterOnly == 2) {
//                                 parseIncomeStatement(resObj, Date_Quarter_Year);
//                             } else if (Date_QuarterOnly == 3) {
//                                 parseIncomeStatement(resObj, Date_Quarter_Year);
//                             } else if (Date_QuarterOnly == 4) {
//                                 parseIncomeStatement(resObj, Date_Quarter_Year);
//                             }
//                             // Report contains data! Parse that shit!
//                             // console.log('Income Statement - Made it to the parsing area... '+ HeaderOptions[i].Value);


//                         } else {
//                             // ITS THE ACCOUNTING STANDARD SHIT && NO REPORT DATA... Forget about that iteration!
//                             // console.log('Income Statement Data Header value: ' + HeaderOptions[i].Value);
//                             // console.log('Doesnt seem to be any report data for given quarter/year');
//                         }
//                     }
//                     // res.write(JSON.stringify(response.body));
//                 }, function (err) {
//                     console.log(err);
//                     return res.json(err);
//                 });
//             });
//         }
//         // BALANCE SHEET - Iterate over the BS_URL_ARRAY; Check if data is present; If so, parse the data and store to database.
//         // for (var y = 0; BS_URL_ARRAY.length - 1 >= y; y++) {
//         //     var requester_BS = BS_URL_ARRAY[y];
//         //     request(requester_BS, function(err, response) {
//         //         // Check if 401 response was returned - refresh tokens if so!
//         //         tools.checkForUnauthorized(req, requester_BS, err, response).then(function({ err, response }) {
//         //             if (err || response.statusCode != 200) {
//         //                 return res.json({ error: err, statusCode: response.statusCode });
//         //             }
//         //             var resObj = JSON.parse(response.body);
//         //             var HeaderOptions = resObj.Header.Option;

//         //             // THIS WILL TELL YOU IF THE REPORT HAS DATA!
//         //             for (var i = 0; HeaderOptions.length - 1 >= i; i++) {
//         //                 if ((HeaderOptions[i].Value) == 'false') {
//         //                     // Report contains data! Parse that shit!
//         //                     parseBalanceSheet(resObj);
//         //                 } else {
//         //                     // ITS THE ACCOUNTING STANDARD SHIT && NO REPORT DATA... Forget about that iteration!
//         //                     // console.log('Balance Sheet Data Header: '+ (resObj.Header.Option[i].Value).value);
//         //                     // console.log('Doesnt seem to be any report data for given quarter/year');
//         //                 }
//         //             }
//         //             // res.write(JSON.stringify(response.body));
//         //         }, function(err) {
//         //             console.log(err);
//         //             return res.json(err);
//         //         });
//         //     });
//         // }
//         // CASH FLOWS STATEMENT - Iterate over the CF_URL_ARRAY; Check if data is present; If so, parse the data and store to database.
//         // for (var z = 0; CF_URL_ARRAY.length - 1 >= z; z++) {
//         //     var requester_CF = CF_URL_ARRAY[z];
//         //     request(requester_CF, function(err, response) {
//         //         // Check if 401 response was returned - refresh tokens if so!
//         //         tools.checkForUnauthorized(req, requester_CF, err, response).then(function({ err, response }) {
//         //             if (err || response.statusCode != 200) {
//         //                 return res.json({ error: err, statusCode: response.statusCode });
//         //             }
//         //             var resObj = JSON.parse(response.body);
//         //             var HeaderOptions = resObj.Header.Option;
//         //             console.log((resObj.Header.Option[0].Value).value);
//         //             // THIS WILL TELL YOU IF THE REPORT HAS DATA!
//         //             for (var i = 0; HeaderOptions.length - 1 >= i; i++) {
//         //                 if (((HeaderOptions[i].Name).value == 'NoReportData') && ((HeaderOptions[i].Value).value == false)) {
//         //                     // Report contains data! Parse that shit!
//         //                     parseCashFlows(resObj);
//         //                 } else {
//         //                     // ITS THE ACCOUNTING STANDARD SHIT && NO REPORT DATA... Forget about that iteration!
//         //                     console.log('Doesnt seem to be any report data for given quarter/year');
//         //                 }
//         //             }
//         //             res.write(JSON.stringify(response.body));
//         //         }, function(err) {
//         //             console.log(err);
//         //             return res.json(err);
//         //         });
//         //     });
//         // }
//     }, 1000);
//     // res.end();

// });




// function parseIncomeStatement(parseObj, date) {
//     var resObj = parseObj;
//     var topLevel = resObj.Rows.Row;
//     var Q_YYYY_Data = date;
//     dbEntryCreation(Q_YYYY_Data);

//     for (var i = 0; topLevel.length - 1 >= i; i++) {
//         // console.log(topLevel[i]);
//         // console.log(topLevel[i].Summary);
//         var itemName = (topLevel[i].Summary.ColData[0]).value;
//         var itemVal = 0;
//         // console.log('Date: ' + resObj.Header.StartPeriod + ' -- ' + itemName + ' : ' + itemVal);
//         if (topLevel[i].Summary.ColData[1] == undefined) {
//             itemVal = 0;
//             console.log(topLevel[i].Summary.ColData[1].value);
//             console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + '-- $$$ --' + itemName + ' : ' + itemVal);
//             storeToDB(itemName, itemVal, Q_YYYY_Data);
//         } else {
//             itemVal = topLevel[i].Summary.ColData[1].value;
//             console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + '-- $$$ --' + itemName + ' : ' + itemVal);
//             storeToDB(itemName, itemVal, Q_YYYY_Data);
//         }
//     }
// }

// function parseBalanceSheet(parseObj) {
//     var resObj = parseObj;
//     var companyKey = document.getElementById('companyKeyIdItem').value;

//     var totalAssetsValue = 0,
//         totalLib_Value = 0,
//         totalEQ_Value = 0;
//     var totalBankAccountsValue = 0;
//     var inventoryAsset = 0;
//     var totalOtherCurrentAssets_Value = 0;
//     var longTermDebt_Value = 0;
//     var totalAccountsReceivable_Value = 0,
//         totalAccountsPayable_Value = 0,
//         otherPayable_Value = 0,
//         notesPayable_Value = 0;
//     var CCE = 0,
//         netAssets_currentQ_Value = 0;


//     // TOTAL ASSETS
//     if (resObj.Rows.Row[0].Summary.ColData != undefined) {
//         totalAssetsValue = resObj.Rows.Row[0].Summary.ColData[1].value;
//     }
//     // TOTAL LIABILITIES
//     if (resObj.Rows.Row[1].Rows.Row[0].Summary.ColData != undefined) {
//         totalLib_Value = resObj.Rows.Row[1].Rows.Row[0].Summary.ColData[1].value;
//     }
//     // TOTAL EQUITY
//     if (resObj.Rows.Row[1].Rows.Row[1].Summary.ColData != undefined) {
//         totalEQ_Value = resObj.Rows.Row[1].Rows.Row[1].Summary.ColData[1].value;
//     }
//     if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[0].Summary.ColData != undefined) {
//         totalBankAccountsValue = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[0].Summary.ColData[1].value;
//     }
//     for (var i = 0; 10 >= i; i++) {
//         // ITERATING THROUGH ASSETS OBJECT
//         if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i] != undefined) {
//             //GRAB THE TOTAL ACCOUNTS RECEIVABLES
//             if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[0].value == 'Total Accounts Receivable') {
//                 totalAccountsReceivable_Value = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[1].value;
//             }
//             // GRAB THE TOTAL OTHER CURRENT ASSETS
//             if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[0].value == 'Total Other Current Assets') {
//                 totalOtherCurrentAssets_Value = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[1].value;
//             }
//             // GRAB INVENTORY ASSET VALUE -- MUST BE SUBTRACTED FROM CCE FOR ACCURACY
//             for (var j = 0;
//                 (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row).length - 1 >= j; j++) {
//                 if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row[j] != undefined) {

//                     if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row[j].ColData[0].value == 'Inventory Asset') {
//                         inventoryAsset = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row[j].ColData[1].value;
//                     }
//                 }

//             }
//         }
//         // ITERATING THROUGH LIABILITIES OBJECT
//         if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i] != undefined) {
//             // GRAB LONG TERM LIABILITIES OBJECT
//             if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Summary.ColData[0].value == 'Total Long-Term Liabilities') {
//                 longTermDebt_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Summary.ColData[1].value;
//             }

//             for (var k = 0; 8 >= k; k++) {
//                 if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k] != undefined) {
//                     // GRAB NOTES PAYABLE VALUE - CHECK THIS FIRST SO ERROR ISN'T THROWN
//                     if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].ColData != undefined) {
//                         notesPayable_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].ColData[1].value;
//                     }
//                     //  THEN GRAB OTHER PAYABLE ITEMS AFTER CHECKING FOR NOTES PAYABLE
//                     else if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData != undefined) {
//                         if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[0].value == 'Total Accounts Payable') {
//                             totalAccountsPayable_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[1].value;
//                         }
//                         if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[0].value == 'Total Other Current Liabilities') {
//                             otherPayable_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[1].value;
//                         }
//                     }

//                 }
//             }
//         }
//     }
//     // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Accounts Payable Value: '+totalAccountsPayable_Value);
//     // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Long-Term Liabilities: '+longTermDebt_Value);
//     // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Other Current Liabilities Value: '+otherPayable_Value);
//     // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Other Current Assets Value: '+totalOtherCurrentAssets_Value);
//     // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Inventory Asset Value: '+inventoryAsset);
//     CCE = ((Number(totalBankAccountsValue) + Number(totalOtherCurrentAssets_Value)) - Number(inventoryAsset));
//     netAssets_currentQ_Value = (Number(totalAssetsValue) - Number(totalLib_Value));
//     // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+totalBankAccountsValue +' PLUS '+ totalOtherCurrentAssets_Value + ' MINUS '+ inventoryAsset +' EQUALS '+ CCE);
//     console.log(' -------------------------- ');

//     // RESET ITEM VALUES
//     totalAssetsValue = 0;
//     totalLib_Value = 0;
//     totalEQ_Value = 0;
//     totalBankAccountsValue = 0;
//     totalOtherCurrentAssets_Value = 0;
//     inventoryAsset = 0;
//     totalAccountsReceivable_Value = 0;
//     longTermDebt_Value = 0;
//     totalAccountsPayable_Value = 0;
//     otherPayable_Value = 0;
//     notesPayable_Value = 0;
//     netAssets_currentQ_Value = 0;




// }

// function parseCashFlows(parseObj) {
//     var resObj = parseObj;
//     var topLevel = resObj.Rows.Row;
// }

// function storeToDB(itemName, itemVal, date) {
//     var name = itemName,
//         val = itemVal;
//     // var companyKey = document.getElementById('companyKeyIdItem').value;
//     var Q_YYYY_Data = date;

//     var hsdRef = admin.database().ref('/health-score-data/' + companyKey + '/' + Q_YYYY_Data),
//         fadRef = admin.database().ref('/formal-accounting-data/' + companyKey + '/' + Q_YYYY_Data);

//     switch (itemName) {
//         // TAKEN FROM INCOME STATEMENT (PROFIT/LOSS) =>
//     case 'Total Income':
//         hsdRef.child('netSales').update(itemVal);
//         break;
//     case 'Total Cost of Goods Sold':
//         hsdRef.child('costOGS').update(itemVal);
//         break;
//     case 'Gross Profit':
//         fadRef.child('grossOpProfit').update(itemVal);
//         break;
//     case 'Total Expenses':
//         hsdRef.child('TotalExpenses').update(itemVal);
//         break;
//     case 'Net Operating Income':
//         fadRef.child('EBITDA').update(itemVal);
//         break;
//     case 'Net Other Income':
//         hsdRef.child('otherNonOp').update(itemVal);
//         break;
//     case 'Net Income':
//         hsdRef.child('netIncome').update(itemVal);
//         break;
//         // TAKEN FROM BALANCE SHEET =>
//         /*
//          *
//          * GOTTA FIND A WAY TO DETECT IF THERE ARE A PREVIOUS QUARTER TOTAL ASSETS/LIABILITIES TO FIND THE DELTA
//          *
//          */
//         // case 'TOTAL ASSETS':
//         //     fadRef.child('totalAssets').update(itemVal);
//         //     break;
//         // case 'Total Liabilities':
//         //     fadRef.child('totalLiabilities').update(itemVal);
//         //     break;
//         /*
//          *
//          * GOTTA FIND A WAY TO DETECT IF THERE ARE A PREVIOUS QUARTER TOTAL ASSETS/LIABILITIES TO FIND THE DELTA
//          *
//          */
//         // case 'Total Equity':
//         //     fadRef.child('totalEquity').update(itemVal);
//         //     break;
//         // case 'Total Bank Accounts':
//         // case 'Undeposited Funds':
//         //     var previousVal = 0;
//         //     hsdRef.child('cashAndCashEq').once("value").then(function(snap){
//         //         if (snap.val() != 0){
//         //             previousVal = snap.val();
//         //         } else {
//         //             previousVal = 0;
//         //         } 
//         //     });
//         //     var aggregateTotal = itemVal + previousVal;
//         //     hsdRef.child('cashAndCashEq').update(aggregateTotal);
//         //     break;
//         // case 'Inventory Asset':
//         //     fadRef.child('inventory').update(itemVal);
//         //     break;
//         // case 'Total Fixed Assets':
//         //     fadRef.child('property').update(itemVal);
//         //     break;
//         // case 'Total Accounts Receivable':
//         //     fadRef.child('accntsReceivable').update(itemVal);
//         //     break;
//         // case 'Total Long-Term Liabilities':
//         //     hsdRef.child('LongTermDebt').update(itemVal);
//         //     break;
//         // case 'Total Accounts Payable':
//         //     fadRef.child('acctsPayable').update(itemVal);
//         //     break;
//     default:
//         console.log('Couldnt parse data => Name:' + itemName + ' Value: ' + itemVal);
//     }
// }

// function dbEntryCreation(Q_Date) {
//     var qData = Q_Date;
//     // var companyKey = document.getElementById('companyKeyIdItem').value;
//     var HSDref = admin.database().ref().child('health-score-data/' + companyKey + "/" + qData);
//     var FADref = admin.database().ref().child('formal-accounting-data/' + companyKey + "/" + qData);
//     var DYWref = admin.database().ref().child('data-you-want/' + companyKey + "/" + qData);
//     var SECTref = admin.database().ref().child('sector-data/' + companyKey + "/" + qData);

//     HSDref.set({
//         'TotalExpenses': 0.0,
//         'LongTermDebt': 0.0,
//         'deltaNetAssets': 0.0,
//         'primaryReserveRatio': 0.0,
//         'viabilityRatio': 0.0,
//         'returnOnNetAssetsRatio': 0.0,
//         'netOperatingRevenuesRatio': 0.0,
//         'HealthScore': 0.0,
//         'cashAndCashEq': 0.0,
//         'costOGS': 0.0,
//         'sellingAndAdmin': 0.0,
//         'depAndAmort': 0.0,
//         'otherNonOp': 0.0,
//         'incomeTaxExp': 0.0,
//         'prevQnetAssets': 0.0,
//         'currQnetAssets': 0.0,
//         'netIncome': 0.0,
//         'netSales': 0.0,
//         'interestExp': 0.0,
//     });
//     FADref.set({
//         'grossOpProfit': 0.0,
//         'EBITDA': 0.0,
//         'totalAssets': 0.0,
//         'totalLiabilities': 0.0,
//         'totalEquity': 0.0,
//         'EBIT': 0.0,
//         'opActivites': 0.0,
//         'investActivites': 0.0,
//         'financeActivites': 0.0,
//         'netInDeInCash': 0.0,
//         'property': 0.0,
//         'inventory': 0.0,
//         'otherAssets': 0.0,
//         'acctsPayable': 0.0,
//         'accntsReceivable': 0.0,
//         'interestPayable': 0.0,
//         'taxesPayable': 0.0,
//         'otherPayable': 0.0,
//         'currentRatio': 0.0,
//         'quickRatio': 0.0,
//         'interestCoverageRatio': 0.0,
//         'timesEarnedRatio': 0.0,
//         'debtVsEquityRatio': 0.0,
//         'equityMultiplier': 0.0,
//         'grossProfitMargin': 0.0,
//         'operatingProfitMargin': 0.0,
//         'netProfitMargin': 0.0,
//         'returnOnAssetsRatio': 0.0,
//         'returnOnEquityRatio': 0.0,
//         'dsi': 0.0,
//         'dso': 0.0,
//         'dpo': 0.0,
//         'cashCycle': 0.0,
//         'inventoryTO': 0.0,
//         'receivablesTO': 0.0,
//         'payablesTO': 0.0,
//         'totalAssetsTO': 0.0,
//     });
//     DYWref.set({
//         'acquisitionCostAvg': 0.0,
//         'acquisitionRevAvg': 0.0,
//         'businessDevExpenditure': 0.0,
//         'travelAndEntertainment': 0.0,
//         'revChannelMain': "",
//         'revChannelMainAmt': 0.0,
//         'fixedCostMain': "",
//         'fixedCostMainAmt': 0.0,
//         'dynamicCostMain': "",
//         'dynamicCostMainAmt': 0.0,
//     });
//     SECTref.set({
//         'item0': "",
//         'item1': "",
//         'item2': "",
//         'item3': "",
//         'item4': "",
//         'item0Amt': 0.0,
//         'item1Amt': 0.0,
//         'item2Amt': 0.0,
//         'item3Amt': 0.0,
//         'item4Amt': 0.0,
//     });
// }




































// exports.checkSub = functions.https.onRequest((req, res) => {
//   // Grab all that bullshit from the JSON file.
//   const original = req.body;
//   var jsonObj = original;
//   // console.log(original);
//   // Check if a subscription is being created.
//   if (jsonObj.event_type != "subscription_created"){
//     res.redirect(200, "https://watchtower.ltd");
//   }else{
//     admin.database().ref().child('/user-payment-info/'+jsonObj.content.subscription.customer_id).set(original).then(snapshot => {
//     var email = jsonObj.content.customer.email;
//     var tempPass = jsonObj.content.subscription.id;

//     if (jsonObj.content.subscription.plan_id == "entreprenuer-monthly"){
//       admin.auth().createUser({
//         email: email,
//         emailVerified: true,
//         password: tempPass
//       }).then(function(user) {
//           signUpDBHelper(email, "Entrepreneur", (user.uid));
//         }).catch(function(error) {
//           console.log("Error creating new user:", error);
//         });
//         welcomeEmail(email, tempPass);
//         res.redirect(200, "https://watchtower.ltd/success.html");
//     }
//     else if (jsonObj.content.subscription.plan_id == "finance-pro-monthly"){
//       admin.auth().createUser({
//               email: email,
//               emailVerified: true,
//               password: tempPass
//             }).then(function(user) {

//                 console.log("Successfully created new user:", user.uid);
//                 signUpDBHelper(email, "Accountant", (user.uid));
//               }).catch(function(error) {
//                 console.log("Error creating new user:", error);
//               });
//               welcomeEmail(email, tempPass);
//               res.redirect(200, "https://watchtower.ltd/success.html");
//     }
//     else if (jsonObj.content.subscription.plan_id == "investor-monthly"){
//       admin.auth().createUser({
//               email: email,
//               emailVerified: true,
//               password: tempPass
//             }).then(function(user) {

//                 console.log("Successfully created new user:", user.uid);
//                 signUpDBHelper(email, "Investor", (user.uid));
//               }).catch(function(error) {
//                 console.log("Error creating new user:", error);
//               });
//               welcomeEmail(email, tempPass);
//               res.redirect(200, "https://watchtower.ltd/success.html");
//           }
//         });
//       }
// });
// // CREATE USER REF IN DATABASE. STRUCT: root/uid/{Email, Type}
// function signUpDBHelper(email, type, uid) {
//     // Create References and push email and type to DB.
//     var dbRefObject = admin.database().ref('users/' + uid);
//     dbRefObject.set({
//         email: email,
//         type: type
//     });
//     // Link Default Company
//     admin.database().ref().child('users/' + uid + '/linked-companies/-KmCywWCZrV5pBv2CR6n').set(true);
// }

// function welcomeEmail(UserEmail, TempPassword){
//   console.log(mailTransport);
//   const email = UserEmail;
//   const password = TempPassword;
//   const mailOptions = {
//     from: '"WatchTower Support" <watchtowerhelp@gmail.com>',
//     to: email
//   };
//   mailOptions.subject = 'Welcome to WatchTower!';
//   mailOptions.html = '<label style="font-size:18px;">Thank you for signing up with WatchTower!</label><br> We really hope you enjoy using our platform. Your login details are shown below.<br><br><br> <strong>Login/Username</strong>: '+ email + '<br><strong>Password</strong>: '+password+ '<br><br>This is a <strong>temporary password</strong>. Please use it to log in and change your password.<br><br>Feel free to contact us any time at <a href="support@watchtower.ltd">WatchTower support</a>! <br>Sincerely, Your WatchTower Team<br><strong> Keep Watch!</strong>';
//   return mailTransport.sendMail(mailOptions).then(() => {
//     console.log('New subscription confirmation email sent to: ', email);
//   }).catch(error => {
//     console.error('There was an error while sending the email: ', error);  
//   });
// }


// exports.watchersLink = functions.database.ref('/users/{userID}/linked-companies/{companyKey}')
//    .onWrite(event => {  
//      const dataGrab = event.data;
//      const watcherLink = event.data.ref.root.child('/company-description-data/'+event.data.key+'/linked-users/'+event.params.userID);

//      admin.database().ref('/users/'+event.params.userID+'/email').once('value', function(emailSnap){
//        return watcherLink.set(emailSnap.val());
//      }).catch(function(error){
//        console.log(error);
//      });
//    });



// exports.checkSub = functions.https.onRequest((req, res) => {
//   const original = req.body;
//   var jsonObj = original;
//   console.log(original);
//   if (jsonObj.event_type != "subscription_created"){
//     res.redirect(200, "https://watchtower.ltd");
//   }
//   else if (req.statusCode >= 400) {
//       res.redirect(req.statusCode, "https://watchtower.ltd/404.html");
//   }
//   else{
//       admin.database().ref('/user-payment-info/'+jsonObj.content.subscription.id).set(original).then(snapshot => {
//       if (jsonObj.content.subscription.plan_id == "entreprenuer-monthly"){
//         res.redirect(200, "https://watchtower.ltd/zrp89xklodw3qy65ns.html");
//       }
//       else if (jsonObj.content.subscription.plan_id == "finance-pro-monthly"){
//         res.redirect(200, "https://watchtower.ltd/7fd8xpwybs3satoqs.html");
//       }
//       else if (jsonObj.content.subscription.plan_id == "investor-monthly"){
//         res.redirect(200, "https://watchtower.ltd/hjkk43j143b23v.html");
//       }
//     });
//     }
// });






/**
 *[START] HS RATIO COMPONENTS
 **/
// exports.totalExpensesCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	var dataSnapShot = event.data;

//     	//TOTAL EXPENSES (PARTS)
//     	var COGS = event.data.ref.child('/costOGS');
//     	var SAAC = event.data.child('/sellingAndAdmin');
//     	var DEPAMORT = event.data.child('/depAndAmort');
//     	var INTEXP = event.data.child('/interestExp');
//     	var ONOEXP = event.data.child('/otherNonOp');
//     	var ITEXP = event.data.child('/incomeTaxExp');

// 	// Add all Total Expense Components
// 	if (COGS.changed() || SAAC.changed() || DEPAMORT.changed() || INTEXP.changed() || ONOEXP.changed() || ITEXP.changed()) {    
//     	var agrregate = (COGS.val() + SAAC.val() + DEPAMORT.val() + INTEXP.val() + ONOEXP.val() + ITEXP.val());
//     	dataSnapShot.ref.update({ 'TotalExpenses': agrregate });
// 	}
// 	else{
// 		return;
// 	}
// });

// exports.deltaNetAssetsCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	var dataSnapShot = event.data;

//     	//DELTA NET ASSETS (PARTS)
//     	var PrevNA = event.data.child('/prevQnetAssets');
//     	var CurrNA = event.data.child('/currQnetAssets');

// 	// Change in Net Assets
// 	if (PrevNA.changed() || CurrNA.changed()) {
// 	 	var agrregate = (CurrNA.val() - PrevNA.val());
// 	   	dataSnapShot.ref.update({ 'deltaNetAssets': agrregate });
// 	}
// 	else{
// 		return;
// 	}
// });




/**
 *[END] HS RATIO COMPONENTS
 **/

/**
 *[START] HS RATIOS
 **/


// PRIMARY RESERVE RATIO
// exports.prRatioCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	var dataSnapShot = event.data;
//     	var ENA = event.data.child('cashAndCashEq');
//     	var TotalExp = event.data.child('TotalExpenses');

//     	// console.log('Total Expenses', TotalExp);
//     	// console.log('Expendable Net Assets', ENA);

//       if (ENA.changed() || TotalExp.changed()) {
// 		var primaryResRatio = (ENA.val()/TotalExp.val());
// 		if (primaryResRatio < 3){
// 		    var ratioSTR = primaryResRatio / .133;
// 		    return dataSnapShot.ref.update({'primaryReserveRatio': ratioSTR});
// 		}
// 		else if (primaryResRatio >= 3 && primaryResRatio < 10){
// 		    var ratioSTR = primaryResRatio / .4;
// 		    return dataSnapShot.ref.update({'primaryReserveRatio': ratioSTR});
// 		}
// 		else if (primaryResRatio >= 10) {
// 		    var ratioSTR = primaryResRatio / .133;
// 		    return dataSnapShot.ref.update({'primaryReserveRatio': ratioSTR});
// 		}
//     }
//     else{
//     	return;
//     }
// });


// VIABILITY RATIO
// exports.viabilityRatioCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	var dataSnapShot = event.data;
//     	var ENA = event.data.child('cashAndCashEq');
//     	var LTD = event.data.child('LongTermDebt');

//     	// console.log('Expendable Net Assets', ENA);
//     	// console.log('Long Term Debt', LTD);

//       if (ENA.changed() || LTD.changed()) {
//       	var viabilityRatio = (ENA.val()/LTD.val());
//       	if (viabilityRatio < 3){
//       	    var ratioSTR = viabilityRatio / .417;
//       	    return dataSnapShot.ref.update({'viabilityRatio': ratioSTR});
//       	}
//       	else if (viabilityRatio >= 3 && viabilityRatio < 10){
//       	    var ratioSTR = viabilityRatio / 1.25;
//       	    return dataSnapShot.ref.update({'viabilityRatio': ratioSTR});
//       	}
//       	else if (viabilityRatio >= 10) {
//       	    var ratioSTR = viabilityRatio / 4.16;
//       	    return dataSnapShot.ref.update({'viabilityRatio': ratioSTR});
//       	}
//       }
//     else{
//     	return;
//     }
// });

// RETURN ON NET ASSETS RATIO
// exports.ronaRatioCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	var dataSnapShot = event.data;
//     	var DNA = event.data.child('deltaNetAssets');
//     	var CQNA = event.data.child('currQnetAssets');

//     	// console.log('Delta Net Assets', DNA);
//     	// console.log('Current Quarter Net Assets', CQNA);

//       if (DNA.changed() || CQNA.changed()) {
//       	var RONARatio = (DNA.val()/CQNA.val());
//       	if (RONARatio < 3){
//           	var ratioSTR = RONARatio / .02;
//           	return dataSnapShot.ref.update({'returnOnNetAssetsRatio': ratioSTR});
//         	}
//        	else if (RONARatio >= 3 && RONARatio < 10){
//            	var ratioSTR = RONARatio / .06;
//            	return dataSnapShot.ref.update({'returnOnNetAssetsRatio': ratioSTR});
//        	}
//         else if (RONARatio >= 10) {
//            	var ratioSTR = RONARatio / .2;
//            	return dataSnapShot.ref.update({'returnOnNetAssetsRatio': ratioSTR});
//         }
//       }
//     else{
//     	return;
//     }
// });

// NET OPERATING REVENUES RATIO
// exports.ronaRatioCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	var dataSnapShot = event.data;
//     	var NI = event.data.child('netIncome');
//     	var NS = event.data.child('netSales');

//     	// console.log('Net Sales', NS);
//     	// console.log('Net Income', NI);

//       if (NI.changed() || NS.changed()) {
//     	var NORRatio = (NI.val()/NS.val());
//     	if (NORRatio < 3){
//           var ratioSTR = NORRatio / .007;
//           return dataSnapShot.ref.update({'netOperatingRevenuesRatio': ratioSTR});
//       	}
//       	else if (NORRatio >= 3 && NORRatio < 10){
//           var ratioSTR = NORRatio / .02;
//           return dataSnapShot.ref.update({'netOperatingRevenuesRatio': ratioSTR});
//       	}
//       	else if (NORRatio >= 10) {
//           var ratioSTR = NORRatio / .067;
//           return dataSnapShot.ref.update({'netOperatingRevenuesRatio': ratioSTR});
//       	}
//     }
//     else{
//     	return;
//     }
// });


/**
 *[END] HS RATIOS
 **/





//  /**
//  * CALCULATE HEALTH SCORE 
//  **/
// exports.healthScoreCalc = functions.database.ref('/health-score-data/{compID}/{qDate}')
//     .onWrite(event => {
//     	const dataSnapShot = event.data;
//       const promises = [];
//     	//HS MAIN RATIOS
//     	// const PR = event.data.child('primaryReserveRatio').val();
//     	// const VI = event.data.child('viabilityRatio').val();
//     	// const RONAR = event.data.child('returnOnNetAssetsRatio').val();
//     	// const NORR = event.data.child('netOperatingRevenuesRatio').val();
//     	//TOTAL EXPENSES (PARTS)
//     	const COGS = event.data.child('/costOGS').val();
//     	const SAAC = event.data.child('/sellingAndAdmin').val();
//     	const DEPAMORT = event.data.child('/depAndAmort').val();
//     	const INTEXP = event.data.child('/interestExp').val();
//     	const ONOEXP = event.data.child('/otherNonOp').val();
//     	const ITEXP = event.data.child('/incomeTaxExp').val();
//     	//DELTA NET ASSETS (PARTS)
//     	const PrevNA = event.data.child('/prevQnetAssets').val();
//     	const CurrNA = event.data.child('/currQnetAssets').val();
//     	// PRIMARY RESERVE RATIO
//     	const ENA = event.data.child('cashAndCashEq').val();
//     	const TotalExp = event.data.child('TotalExpenses').val();
//     	// VIABILITY RATIO
//     	const LTD = event.data.child('LongTermDebt').val();
//     	// RETURN ON NET ASSETS RATIO
// 		const DNA = event.data.child('deltaNetAssets').val();
//     	const CQNA = event.data.child('currQnetAssets').val();
//     	// NET OPERATING REVENUES RATIO
// 		const NI = event.data.child('netIncome').val();
//     	const NS = event.data.child('netSales').val();


//     	// console.log('Net Sales', NS);
//     	// console.log('Net Income', NI);
//     	// console.log('Delta Net Assets', DNA);
//     	// console.log('Current Quarter Net Assets', CQNA);
//     	// console.log('Expendable Net Assets', ENA);
//     	// console.log('Long Term Debt', LTD);      
//     	// console.log('Total Expenses', TotalExp);
//     	// console.log('Expendable Net Assets', ENA);


//     	const agrregateTEXP = Number(COGS) + Number(SAAC) + Number(DEPAMORT) + Number(INTEXP) + Number(ONOEXP) + Number(ITEXP);
//     	const agrregateDNA = Number(CurrNA) - Number(PrevNA);
// 	// Change in Net Assets
// 	// if (PrevNA.changed() || CurrNA.changed()) {
// 	//  	const agrregate = (Number(CurrNA.val()) - Number(PrevNA.val()));
// 	//  	console.log("Delta Net Assets pre: "+ agrregate);
// 	//    	dataSnapShot.ref.update({ 'deltaNetAssets': agrregate });
// 	// }

// 	// Add all Total Expense Components
// 	// if (COGS.changed() || SAAC.changed() || DEPAMORT.changed() || INTEXP.changed() || ONOEXP.changed() || ITEXP.changed()) {
//  //    	const agrregate = Number(COGS.val()) + Number(SAAC.val()) + Number(DEPAMORT.val()) + Number(INTEXP.val()) + Number(ONOEXP.val()) + Number(ITEXP.val());
//  //    	console.log("Total Expenses pre: "+ agrregate);
//  //    	dataSnapShot.ref.update({ 'TotalExpenses': agrregate });
// 	// }
// 	// PRIMARY RESERVE RATIO
// 		const primaryResRatio = (Number(ENA)/Number(TotalExp));
// 		const viabilityRatio = (Number(ENA)/Number(LTD));
// 		const RONARatio = (Number(DNA)/Number(CQNA));
// 		const NORRatio = (Number(NI)/Number(NS));
// 		var PratioSTR;
// 		var VratioSTR;
// 		var RONAratioSTR;
// 		var NORratioSTR;

// 		// PRIMARY RESERVE RATIO
// 		if (primaryResRatio < 3){
// 		    PratioSTR = primaryResRatio / .133;
// 		}
// 		else if (primaryResRatio >= 3 && primaryResRatio < 10){
// 		    PratioSTR = primaryResRatio / .4;
// 		}
// 		else if (primaryResRatio >= 10) {
// 		    PratioSTR = primaryResRatio / .133;
// 		}
//     	// VIABILITY RATIO
//       	if (viabilityRatio < 3){
//       	    VratioSTR = viabilityRatio / .417;
//       	}
//       	else if (viabilityRatio >= 3 && viabilityRatio < 10){
//       	    VratioSTR = viabilityRatio / 1.25;
//       	}
//       	else if (viabilityRatio >= 10) {
//       	    VratioSTR = viabilityRatio / 4.16;
//       	}
//      	// RETURN ON NET ASSETS RATIO
//       	if (RONARatio < 3){
//           	RONAratioSTR = RONARatio / .02;
//         	}
//        	else if (RONARatio >= 3 && RONARatio < 10){
//            	RONAratioSTR = RONARatio / .06;
//        	}
//         else if (RONARatio >= 10) {
//            	RONAratioSTR = RONARatio / .2;
//         }
//      	// NET OPERATING REVENUES RATIO
//     	if (NORRatio < 3){
//           NORratioSTR = NORRatio / .007;
//       	}
//       	else if (NORRatio >= 3 && NORRatio < 10){
//           NORratioSTR = NORRatio / .02;
//       	}
//       	else if (NORRatio >= 10) {
//           NORratioSTR = NORRatio / .067;
//       	}

//       	//HEALTH SCORE
//       	const HealthScore = ((Number(PratioSTR) * 0.35) + (Number(VratioSTR) * 0.35) + (Number(RONAratioSTR) * 0.2) + (Number(NORratioSTR) * 0.1));
//       	if (HealthScore >= 10) {
//             var HSref = dataSnapShot.ref.update({ 'HealthScore': 10.0 , 'TotalExpenses': agrregateTEXP ,  'deltaNetAssets': agrregateDNA,  'primaryReserveRatio': PratioSTR,  'viabilityRatio': VratioSTR,  'returnOnNetAssetsRatio': RONAratioSTR,  'netOperatingRevenuesRatio': NORratioSTR });
//             promises.push(HSref);
//           	return Promise.all(promises);
//       	}
//       	else if (HealthScore < 0) {
//           var HSref = dataSnapShot.ref.update({ 'HealthScore': 0 , 'TotalExpenses': agrregateTEXP ,  'deltaNetAssets': agrregateDNA,  'primaryReserveRatio': PratioSTR,  'viabilityRatio': VratioSTR,  'returnOnNetAssetsRatio': RONAratioSTR,  'netOperatingRevenuesRatio': NORratioSTR });
//             promises.push(HSref);
//             return Promise.all(promises);
//       	}
//       	else {
//           var HSref = dataSnapShot.ref.update({ 'HealthScore': HealthScore , 'TotalExpenses': agrregateTEXP ,  'deltaNetAssets': agrregateDNA,  'primaryReserveRatio': PratioSTR,  'viabilityRatio': VratioSTR,  'returnOnNetAssetsRatio': RONAratioSTR,  'netOperatingRevenuesRatio': NORratioSTR });
//             promises.push(HSref);
//             return Promise.all(promises);
//       	}


//     // HEALTH SCORE
//     // if (PR.changed() || VI.changed() || RONAR.changed() || NORR.changed()) {
//     // 	const HealthScore = ((Number(PR.val()) * 0.35) + (Number(VI.val()) * 0.35) + (Number(RONAR.val()) * 0.2) + (Number(NORR.val()) * 0.1));
//     // 	if (HealthScore >= 10) {
//     //       	dataSnapShot.ref.update({ 'HealthScore': 10.0 });
//     //   	}
//     //   	else if (HealthScore < 0) {
//     //   		dataSnapShot.ref.update({ 'HealthScore': 0 });
//     //   	}
//     //   	else {
//     //       	dataSnapShot.ref.update({ 'HealthScore': HealthScore });
//     //   	}
//     // }
// });
exports.deltaNetAssetsCalc = functions.database.ref('/formal-accounting-data/{compID}/{qDate}').onWrite(event => {
    let dataSnapShot = event.data;
    let companyID = event.params.compID;
    let quarterDate = event.params.qDate;
    let HSDref = admin.database().ref('health-score-data/' + companyID + '/' + quarterDate);

    let TA = event.data.ref.child('/totalAssets').once('value');
    let TL = event.data.ref.child('/totalLiabilities').once('value');

    if (!event.data.child('/totalAssets').exists() && !event.data.child('/totalLiabilities').exists()) { return; }

    /*
    *
    * THIS ONLY CALCULATES THE CURRENT Q DELTA NET ASSETS.
    * THE PREVIOUS Q DELTA IS CALCULATED ON THE CLIENT & THE OVERALL DELTA IS CALCULATED WITHIN HEALTHSCORECALC() FUNCTION
    *
    */
    return all_pr = Promise.all([TA, TL]).then(results => {
        let Current_DNA = (Number(results[0].val()).toFixed(2) - Number(results[1].val()).toFixed(2)) || 0;
        let update = HSDref.update({ currQnetAssets: checkNumber(Number(Current_DNA).toFixed(2)) }).then(function() {
            return Promise.all([update]);
        }).catch(error => {
            console.log(error);
        });
    });
});

exports.fillInTheBlanks = functions.database.ref('/health-score-data/{compID}/{qDate}').onWrite(event => {
    let dataSnapShot = event.data;
    let companyID = event.params.compID;
    let quarterDate = event.params.qDate;
    let FADref = admin.database().ref('formal-accounting-data/' + companyID + '/' + quarterDate);

    let COGS = event.data.ref.child('/costOGS').once('value');
    let SAAC = event.data.ref.child('/sellingAndAdmin').once('value');
    let DEPAMORT = event.data.ref.child('/depAndAmort').once('value');
    let NS = event.data.ref.child('netSales').once('value');

    if (!event.data.child('/costOGS').exists() && !event.data.child('/sellingAndAdmin').exists() && !event.data.child('/depAndAmort').exists() && !event.data.child('netSales').exists()) {
        return;
    }

    return all_pr = Promise.all([COGS, SAAC, DEPAMORT, NS]).then(results => {
        let ebitda = (results[3].val() - results[0].val() - results[1].val()) || 0;
        let ebit = (results[3].val() - results[0].val() - results[1].val() - results[2].val()) || 0;
        let grossProfit = (results[3].val() - results[0].val()) || 0;

        let update = FADref.update({ EBITDA: checkNumber(ebitda), EBIT: checkNumber(ebit), grossOpProfit: checkNumber(grossProfit) }).then(function() {
            // console.log("Filled in the blanks!");
            return Promise.all([update]);
        }).catch(error => {
            console.log(error);
        });
    });
});

exports.finRatiosCalc = functions.database.ref('/formal-accounting-data/{compID}/{qDate}').onWrite(event => {
    let dataSnapShot = event.data;
    let companyID = event.params.compID;
    let quarterDate = event.params.qDate;
    let FADref = admin.database().ref('formal-accounting-data/' + companyID + '/' + quarterDate);
    let HSDref = admin.database().ref('health-score-data/' + companyID + '/' + quarterDate);

    let COGS = HSDref.child('/costOGS').once('value');
    let SAAC = HSDref.child('/sellingAndAdmin').once('value');
    let DEPAMORT = HSDref.child('/depAndAmort').once('value');
    let INTEXP = HSDref.child('/interestExp').once('value');
    let ONOEXP = HSDref.child('/otherNonOp').once('value');
    let ITEXP = HSDref.child('/incomeTaxExp').once('value');
    let NI = HSDref.child('/netIncome').once('value');
    let NS = HSDref.child('/netSales').once('value');
    let INV = event.data.ref.child('/inventory').once('value');
    let ACNTSREC = event.data.ref.child('/accntsReceivable').once('value');
    let ACNTSPAY = event.data.ref.child('/acctsPayable').once('value');
    let TOTALASSETS = event.data.ref.child('/totalAssets').once('value');
    let TOTALEQ = event.data.ref.child('/totalEquity').once('value');
    let TOTALLIB = event.data.ref.child('/totalLiabilities').once('value');
    let EBIT = event.data.ref.child('/EBIT').once('value');
    let EBITDA = event.data.ref.child('/EBITDA').once('value');

    if (!event.data.child('/inventory').exists() && !event.data.child('/accntsReceivable').exists() && !event.data.child('/acctsPayable').exists() && !event.data.child('/totalAssets').exists() && !event.data.child('/totalEquity').exists() && !event.data.child('/totalLiabilities').exists() && !event.data.child('/EBIT').exists() && !event.data.child('/EBITDA').exists()) {
        return;
    }

    return all_pr = Promise.all([COGS, SAAC, DEPAMORT, INTEXP, ONOEXP, ITEXP, NI, NS, INV, ACNTSREC, ACNTSPAY, TOTALASSETS, TOTALEQ, TOTALLIB, EBIT, EBITDA]).then(results_0 => {
        /***
         ** ASSET MANAGMENT RATIOS
         ***/
        // DSI
        let DSI = Number((results_0[8].val() / results_0[0].val()) / 365) || 0;
        // DS0
        let DSO = Number((results_0[9].val() / results_0[7].val()) / 365) || 0;
        // DPO
        let DPO = Number((results_0[10].val() / results_0[7].val()) / 365) || 0;
        // INVENTORY TURNOVER
        let INVTO = Number(results_0[0].val() / results_0[8].val()) || 0;
        // RECEIVABLES TURNOVER
        let RECTO = Number(results_0[7].val() / results_0[9].val()) || 0;
        // PAYABLES TURNOVER
        let PAYTO = Number(results_0[0].val() / results_0[10].val()) || 0;
        // TOTAL ASSETS TURNOVER
        let TATO = Number(results_0[7].val() / results_0[11].val()) || 0;
        /***
         ** SOLVENCY AND CAP STRUCTURE RATIOS
         ***/
        // Current Ratio
        let CURRENT = Number(results_0[11].val() / results_0[13].val()) || 0;
        // Quick Ratio
        let QUICK = Number((results_0[11].val() - results_0[8].val()) / results_0[13].val()) || 0;
        // Interest Coverage Ratio
        let INTCOV = Number(results_0[15].val() / results_0[5].val()) || 0;
        // Times Earned Ratio
        let TEARN = Number(results_0[14].val() / results_0[5].val()) || 0;
        // Debt vs. Equity Ratio
        let DVE = Number(results_0[13].val() / results_0[12].val()) || 0;
        // Equity Multiplier Ratio
        let EQMULTI = Number(results_0[11].val() / results_0[12].val()) || 0;
        /***
         ** OPERATIONS RATIOS
         ***/
        // Gross Profit Margin
        let GPM = Number(((results_0[7].val() - results_0[0].val()) / results_0[7].val()) * 100) || 0;
        // Operating Profit Margin
        let OPM = Number((results_0[14].val() / results_0[7].val()) * 100) || 0;
        // Net Profit Margin
        let NPM = Number((results_0[6].val() / results_0[7].val()) * 100) || 0;
        // Retrun on Assets
        let ROA = Number((results_0[6].val() / results_0[11].val()) * 100) || 0;
        // Retrun on Equity
        let ROE = Number((results_0[6].val() / results_0[12].val()) * 100) || 0;
        FADref.update({ dsi: checkNumber(DSI), dso: checkNumber(DSO), dpo: checkNumber(DPO), inventoryTO: checkNumber(INVTO), receivablesTO: checkNumber(RECTO), payablesTO: checkNumber(PAYTO), totalAssetsTO: checkNumber(TATO), currentRatio: checkNumber(CURRENT), quickRatio: checkNumber(QUICK), timesEarnedRatio: checkNumber(INTCOV), interestCoverageRatio: checkNumber(TEARN), debtVsEquityRatio: checkNumber(DVE), equityMultiplier: checkNumber(EQMULTI), grossProfitMargin: checkNumber(GPM), operatingProfitMargin: checkNumber(OPM), netProfitMargin: checkNumber(NPM), returnOnAssetsRatio: checkNumber(ROA), returnOnEquityRatio: checkNumber(ROE) }).then(function() {
            let DaysSI = FADref.child('/dsi').once('value');
            let DaysSO = FADref.child('/dso').once('value');
            let DaysPO = FADref.child('/dpo').once('value');
            return Promise.all([DaysSI, DaysSO, DaysPO]).then(results_1 => {
                let cashCycle = Number(results_1[0].val() + results_1[1].val() - results_1[2].val()) || 0;
                let CCupdate = FADref.update({ cashCycle: checkNumber(cashCycle) }).then(function() {
                    return Promise.all([CCupdate]);
                }).catch(error => {
                    console.log(error);
                });
            });

        }).catch(error => {
            console.log(error);
        });
    });
});


/*
* CHECK FOR REVIOUS QUARTER NET ASSETS
*/
exports.CalculatePreviousQuarterNetAssets = functions.database.ref('/formal-accounting-data/{compID}/{qDate}').onWrite(event => {
    let dataSnapShot = event.data;
    let companyID = event.params.compID;
    let quarterDate = event.params.qDate;
    let previous_Q = moment(quarterDate, 'Q-YYYY').subtract(1, 'Q').format('Q-YYYY');
    let HSDref = admin.database().ref('health-score-data/' + companyID + '/' + quarterDate);
    let previous_Q_FADref = admin.database().ref().child('formal-accounting-data/' + companyID + '/' + previous_Q);
    let previous_Q_AssetData = previous_Q_FADref.child('/totalAssets').once('value');
    let previous_Q_LibData = previous_Q_FADref.child('/totalLiabilities').once('value');
    
    return all_Promises = Promise.all([previous_Q_AssetData, previous_Q_LibData]).then(results => {
        if ((checkNumber(results[0].val()) == (0 || null) && checkNumber(results[1].val()) == (0 || null))){
            console.log('Previous Quarer Data does not exist');
            return;
        }
        let previous_Q_NetAssets = (Number(results[0].val()).toFixed(2) - Number(results[1].val()).toFixed(2));
        let update = HSDref.update({'prevQnetAssets': checkNumber(Number(previous_Q_NetAssets).toFixed(2))}).then(function() {
            return Promise.all([update]);
        }).catch(error => {
            console.log(error);
        });
    });
});
/*
* CALCULATE TOTAL EXPENSES
*/
exports.totalExpensesHSD = functions.database.ref('/health-score-data/{compID}/{qDate}').onWrite(event => {
    let dataSnapShot = event.data;
    let companyID = event.params.compID;
    let quarterDate = event.params.qDate;
    let HSDref = admin.database().ref('health-score-data/' + companyID + '/' + quarterDate);

    let COGS = event.data.ref.child('/costOGS').once('value');
    let SAAC = event.data.ref.child('/sellingAndAdmin').once('value');
    let DEPAMORT = event.data.ref.child('/depAndAmort').once('value');
    let INTEXP = event.data.ref.child('/interestExp').once('value');
    let ONOEXP = event.data.ref.child('/otherNonOp').once('value');
    let ITEXP = event.data.ref.child('/incomeTaxExp').once('value');
    let agrregateTEXP;

    return all_pr = Promise.all([COGS, SAAC, DEPAMORT, INTEXP, ONOEXP, ITEXP]).then(result => {
        //Total Expenses
        let numCheck = Number(result[1].val()) + Number(result[2].val()) + Number(result[3].val()) + Number(result[4].val());
        if (numCheck == 0){
            event.data.ref.child('TotalExpenses').once('value').then(totalExp_Result =>{
                agrregateTEXP = Number(totalExp_Result.val());
            });
        } else {
            agrregateTEXP = Number(result[0].val()) + Number(result[1].val()) + Number(result[2].val()) + Number(result[3].val()) + Number(result[4].val()) + Number(result[5].val()) || 0;
        }
        let TEXP_Update = HSDref.update({ TotalExpenses: checkNumber(agrregateTEXP) }).then(function() {
            return Promise.all([TEXP_Update]);
        }).catch(error =>{
            console.log(error);
        });
    });
    
});




/**
 * CALCULATE HEALTH SCORE 
 **/
exports.healthScoreCalc = functions.database.ref('/health-score-data/{compID}/{qDate}').onWrite(event => {
    let dataSnapShot = event.data;
    let companyID = event.params.compID;
    let quarterDate = event.params.qDate;

    let COGS = event.data.ref.child('/costOGS').once('value');
    let SAAC = event.data.ref.child('/sellingAndAdmin').once('value');
    let DEPAMORT = event.data.ref.child('/depAndAmort').once('value');
    let INTEXP = event.data.ref.child('/interestExp').once('value');
    let ONOEXP = event.data.ref.child('/otherNonOp').once('value');
    let ITEXP = event.data.ref.child('/incomeTaxExp').once('value');
    let PrevNA = event.data.ref.child('/prevQnetAssets').once('value');
    let CurrNA = event.data.ref.child('/currQnetAssets').once('value');

    let adminRef = admin.database().ref('/health-score-data/' + companyID + '/' + quarterDate);

    if (!event.data.child('/costOGS').exists() && !event.data.child('/sellingAndAdmin').exists() && !event.data.child('/depAndAmort').exists() && !event.data.child('/interestExp').exists() && !event.data.child('/otherNonOp').exists() && !event.data.child('/incomeTaxExp').exists() && !event.data.child('/prevQnetAssets').exists() && !event.data.child('/currQnetAssets').exists()) {
        return;
    }

    return all_pr = Promise.all([PrevNA, CurrNA]).then(results_0 => {
        let delta = findDelta(results_0[1].val(), results_0[0].val());

        adminRef.update({ deltaNetAssets: Number(delta).toFixed(2) }).then(function() {
            let ENA = event.data.ref.child('cashAndCashEq').once('value');
            let TotalExp = event.data.ref.child('TotalExpenses').once('value');
            let LTD = event.data.ref.child('LongTermDebt').once('value');
            let DNA = event.data.ref.child('deltaNetAssets').once('value');
            let CQNA = event.data.ref.child('currQnetAssets').once('value');
            let NI = event.data.ref.child('netIncome').once('value');
            let NS = event.data.ref.child('netSales').once('value');

            return Promise.all([ENA, TotalExp, LTD, DNA, CQNA, NI, NS]).then(results_1 => {
                let primaryResRatio = (Number(results_1[0].val()) / Number(results_1[1].val())) || 0;
                let viabilityRatio = (Number(results_1[0].val()) / Number(results_1[2].val())) || 0;
                let RONARatio = (Number(results_1[3].val()) / Number(results_1[4].val())) || 0;
                let NORRatio = (Number(results_1[5].val()) / Number(results_1[6].val())) || 0;
                

                adminRef.update({ primaryReserveRatio: checkNumber(primaryResRatio), viabilityRatio: checkNumber(viabilityRatio), returnOnNetAssetsRatio: checkNumber(RONARatio), netOperatingRevenuesRatio: checkNumber(NORRatio) }).then(function() {
                    let PRR = event.data.ref.child('/primaryReserveRatio').once('value');
                    let VR = event.data.ref.child('/viabilityRatio').once('value');
                    let RONAR = event.data.ref.child('/returnOnNetAssetsRatio').once('value');
                    let NORR = event.data.ref.child('/netOperatingRevenuesRatio').once('value');

                    return Promise.all([PRR, VR, RONAR, NORR]).then(results_2 => {
                        let PRR_Conversion = results_2[0].val();
                        let VR_Conversion = results_2[1].val();
                        let RONAR_Conversion = results_2[2].val();
                        let NORR_Conversion = results_2[3].val();
                        let PratioSTR;
                        let VratioSTR;
                        let RONAratioSTR;
                        let NORratioSTR;
                        if (PRR_Conversion < 3) {
                            PratioSTR = PRR_Conversion / .133;
                        } else if (PRR_Conversion >= 3 && PRR_Conversion < 10) {
                            PratioSTR = PRR_Conversion / .4;
                        } else if (PRR_Conversion >= 10) {
                            PratioSTR = PRR_Conversion / .133;
                        }
                        if (VR_Conversion < 3) {
                            VratioSTR = VR_Conversion / .417;
                        } else if (VR_Conversion >= 3 && VR_Conversion < 10) {
                            VratioSTR = VR_Conversion / 1.25;
                        } else if (VR_Conversion >= 10) {
                            VratioSTR = VR_Conversion / 4.16;
                        }
                        if (RONAR_Conversion < 3) {
                            RONAratioSTR = RONAR_Conversion / .02;
                        } else if (RONAR_Conversion >= 3 && RONAR_Conversion < 10) {
                            RONAratioSTR = RONAR_Conversion / .06;
                        } else if (RONAR_Conversion >= 10) {
                            RONAratioSTR = RONAR_Conversion / .2;
                        }
                        if (NORR_Conversion < 3) {
                            NORratioSTR = NORR_Conversion / .007;
                        } else if (NORR_Conversion >= 3 && NORR_Conversion < 10) {
                            NORratioSTR = NORR_Conversion / .02;
                        } else if (NORR_Conversion >= 10) {
                            NORratioSTR = NORR_Conversion / .067;
                        }
                        let HealthScore = ((Number(PratioSTR) * 0.35) + (Number(VratioSTR) * 0.35) + (Number(RONAratioSTR) * 0.2) + (Number(NORratioSTR) * 0.1)) || 0;

                        // console.log("This is the Health Score for "+quarterDate+", value: "+HealthScore);
                        if (HealthScore >= 10) {
                            let HS_HIGH = adminRef.update({ HealthScore: 10.0 }).then(function() {
                                return Promise.all([HS_HIGH]);
                            }).catch(error => {
                                console.log(error);
                            });

                        } else if (HealthScore < 0) {
                            let HS_LOW = adminRef.update({ HealthScore: 0 }).then(function() {
                                return Promise.all([HS_LOW]);
                            }).catch(error => {
                                console.log(error);
                            });

                        } else {
                            let HS = adminRef.update({ HealthScore: HealthScore }).then(function() {
                                return Promise.all([HS]);
                            }).catch(error => {
                                console.log(error);
                            });
                        }
                    });
                });
            });
        }).catch(error => {
            console.log(error);
        });
    }).catch(error => {
        console.log(error);
    });
});

function findDelta(current, previous){
    var current_delta = Number(current),
        previous_delta = Number(previous),
        delta = current_delta - previous_delta;
    return delta;

    // if ((previous_delta < 0) && (current_delta >= 0)){
    //     // Prev negative; Current positive 
    //     delta = current_delta + previous_delta;
    //     return delta;


    // } else if ((previous_delta >= 0) && (current_delta < 0)){
    //     // Prev positive; Current negative
    //     delta = current_delta + previous_delta;
    //     return delta;


    // }else if ((previous_delta >= 0) && (current_delta >= 0)){
    //     // Prev positive; Current positive
    //     delta = current_delta - previous_delta;
    //     return delta;


    // }else if ((previous_delta < 0) && (current_delta < 0)){
    //     // Prev negative; Current negative
    //     delta = current_delta - previous_delta;
    //     return delta;


    // } else {
    //     delta = current_delta - previous_delta;
    //     return delta;
    // }
}

function checkNumber(num) {
    let numToCheck = num;
    if (numToCheck == Infinity) {
        return 0;
    } else if (numToCheck == undefined){
        return 0;
    } else if (numToCheck == -Infinity){
        return 0;
    } else {
        return numToCheck;
    }
}


// var current_delta = Number(current).toExponential(2),
// previous_delta = Number(previous).toExponential(2),
// delta = Math.sqrt((current_delta - previous_delta));
// return delta;