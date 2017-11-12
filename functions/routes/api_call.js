const moment = require('moment');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
let tools = require('../tools/tools.js');
let config = require('../config.json');
let request = require('request');
let express = require('express');
let router = express.Router();
let currentYear = moment().format("YYYY");
// const cheerio = require('cheerio');
// let fs = require('fs');
var companyKey = '';



/** /api_call **/
// router.get('/', function (req, res) {

    // var html = '<form action="connect_QB" method="POST">' +
    //     '<label>Enter/Paste Company Key:</label><br>' +
    //     '<input type="text" name="companyKey" placeholder="Company Key">' +
    //     '<br>' +
    //     '<button type="submit">Submit</button>' +
    //     '</form>';

    // res.redirect(connect_QB);

// });

router.post('/', function (req, res) {
    companyKey = req.body.companyKey;
    // console.log(companyKey);
    // console.log(req);
    // console.log(req.body);
    var start_Q1 = '-01-01',
        end_Q1 = '-03-31',
        start_Q2 = '-04-01',
        end_Q2 = '-06-30',
        start_Q3 = '-07-01',
        end_Q3 = '-09-30',
        start_Q4 = '-10-01',
        end_Q4 = '-12-31';
    var token = tools.getToken(req.session);
    if (!token) return res.json({ error: 'Not authorized' });
    if (!req.session.realmId) return res.json({
        error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
    });

    var BS_URL_ARRAY = [];
    var IS_URL_ARRAY = [];
    var CF_URL_ARRAY = [];
    // Iterate through all quarters and years between 2000 and the current year(i)/quarter(j)
    for (i = 2011; currentYear >= i; i++) {
        for (j = 1; 4 >= j; j++) {
            if (j == 1) {
                var IS_url_0 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q1 + '&end_date=' + i + end_Q1;
                var BS_url_0 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q1 + '&end_date=' + i + end_Q1;
                var CF_url_0 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q1 + '&end_date=' + i + end_Q1;
                var IS_requestObj_0 = {
                    url: IS_url_0,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var BS_requestObj_0 = {
                    url: BS_url_0,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var CF_requestObj_0 = {
                    url: CF_url_0,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                IS_URL_ARRAY.push(IS_requestObj_0);
                BS_URL_ARRAY.push(BS_requestObj_0);
                CF_URL_ARRAY.push(CF_requestObj_0);

            } else if (j == 2) {
                var IS_url_1 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q2 + '&end_date=' + i + end_Q2;
                var BS_url_1 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q2 + '&end_date=' + i + end_Q2;
                var CF_url_1 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q2 + '&end_date=' + i + end_Q2;
                var IS_requestObj_1 = {
                    url: IS_url_1,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var BS_requestObj_1 = {
                    url: BS_url_1,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var CF_requestObj_1 = {
                    url: CF_url_1,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                IS_URL_ARRAY.push(IS_requestObj_1);
                BS_URL_ARRAY.push(BS_requestObj_1);
                CF_URL_ARRAY.push(CF_requestObj_1);
            } else if (j == 3) {
                var IS_url_2 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q3 + '&end_date=' + i + end_Q3;
                var BS_url_2 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q3 + '&end_date=' + i + end_Q3;
                var CF_url_2 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q3 + '&end_date=' + i + end_Q3;
                var IS_requestObj_2 = {
                    url: IS_url_2,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var BS_requestObj_2 = {
                    url: BS_url_2,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var CF_requestObj_2 = {
                    url: CF_url_2,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                IS_URL_ARRAY.push(IS_requestObj_2);
                BS_URL_ARRAY.push(BS_requestObj_2);
                CF_URL_ARRAY.push(CF_requestObj_2);
            } else if (j == 4) {
                var IS_url_3 = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + i + start_Q4 + '&end_date=' + i + end_Q4;
                var BS_url_3 = config.api_uri + req.session.realmId + '/reports/BalanceSheet?start_date=' + i + start_Q4 + '&end_date=' + i + end_Q4;
                var CF_url_3 = config.api_uri + req.session.realmId + '/reports/CashFlow?start_date=' + i + start_Q4 + '&end_date=' + i + end_Q4;
                var IS_requestObj_3 = {
                    url: IS_url_3,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var BS_requestObj_3 = {
                    url: BS_url_3,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                var CF_requestObj_3 = {
                    url: CF_url_3,
                    headers: {
                        'Authorization': 'Bearer ' + token.accessToken,
                        'Accept': 'application/json'
                    }
                }
                IS_URL_ARRAY.push(IS_requestObj_3);
                BS_URL_ARRAY.push(BS_requestObj_3);
                CF_URL_ARRAY.push(CF_requestObj_3);
            }
        }
    }
    setTimeout(function () {
        // INCOME STATEMENT - Iterate over the IS_URL_ARRAY; Check if data is present; If so, parse the data and store to database.
        for (var x = 0; IS_URL_ARRAY.length - 1 >= x; x++) {
            var requester_IS = IS_URL_ARRAY[x];
            request(requester_IS, function (err, response) {
                // Check if 401 response was returned - refresh tokens if so!
                tools.checkForUnauthorized(req, requester_IS, err, response).then(function ({ err, response }) {
                    if (err || response.statusCode != 200) {
                        return res.json({ error: err, statusCode: response.statusCode });
                    }
                    var resObj = JSON.parse(response.body);
                    var HeaderOptions = resObj.Header.Option;
                    // console.log('Income Statement Data Header: ' + HeaderOptions[1].Name);
                    // THIS WILL TELL YOU IF THE REPORT HAS DATA!
                    for (var i = 0; HeaderOptions.length - 1 >= i; i++) {
                        if ((HeaderOptions[i].Value) == 'false') {
                            var Date_Quarter_Year = moment(resObj.Header.StartPeriod, 'YYYY-MM-DD').format('Q-YYYY');
                            var Date_QuarterOnly = moment(Date_Quarter_Year, 'Q-YYYY').format('Q');
                            if (Date_QuarterOnly == 1) {
                                parseIncomeStatement(resObj, Date_Quarter_Year);
                            } else if (Date_QuarterOnly == 2) {
                                parseIncomeStatement(resObj, Date_Quarter_Year);
                            } else if (Date_QuarterOnly == 3) {
                                parseIncomeStatement(resObj, Date_Quarter_Year);
                            } else if (Date_QuarterOnly == 4) {
                                parseIncomeStatement(resObj, Date_Quarter_Year);
                            }
                            // Report contains data! Parse that shit!
                            // console.log('Income Statement - Made it to the parsing area... '+ HeaderOptions[i].Value);


                        } else {
                            // ITS THE ACCOUNTING STANDARD SHIT && NO REPORT DATA... Forget about that iteration!
                            // console.log('Income Statement Data Header value: ' + HeaderOptions[i].Value);
                            // console.log('Doesnt seem to be any report data for given quarter/year');
                        }
                    }
                    // res.write(JSON.stringify(response.body));
                }, function (err) {
                    console.log(err);
                    return res.json(err);
                });
            });
        }

        // BALANCE SHEET - Iterate over the BS_URL_ARRAY; Check if data is present; If so, parse the data and store to database.
        for (var y = 0; BS_URL_ARRAY.length - 1 >= y; y++) {
            var requester_BS = BS_URL_ARRAY[y];
            request(requester_BS, function(err, response) {
                // Check if 401 response was returned - refresh tokens if so!
                tools.checkForUnauthorized(req, requester_BS, err, response).then(function({ err, response }) {
                    if (err || response.statusCode != 200) {
                        return res.json({ error: err, statusCode: response.statusCode });
                    }
                    var resObj = JSON.parse(response.body);
                    var HeaderOptions = resObj.Header.Option;
                    // console.log(HeaderOptions);

                    // THIS WILL TELL YOU IF THE REPORT HAS DATA!
                    for (var i = 0; HeaderOptions.length - 1 >= i; i++) {
                        if ((HeaderOptions[i].Value) == 'false') {
                            // Report contains data! Parse that shit!
                            var Date_Quarter_Year = moment(resObj.Header.StartPeriod, 'YYYY-MM-DD').format('Q-YYYY');
                            var Date_QuarterOnly = moment(Date_Quarter_Year, 'Q-YYYY').format('Q');
                            if (Date_QuarterOnly == 1) {
                                parseBalanceSheet(resObj, Date_Quarter_Year);
                            } else if (Date_QuarterOnly == 2) {
                                parseBalanceSheet(resObj, Date_Quarter_Year);
                            } else if (Date_QuarterOnly == 3) {
                                parseBalanceSheet(resObj, Date_Quarter_Year);
                            } else if (Date_QuarterOnly == 4) {
                                parseBalanceSheet(resObj, Date_Quarter_Year);
                            }
                        } else {
                            // ITS THE ACCOUNTING STANDARD SHIT && NO REPORT DATA... Forget about that iteration!
                            // console.log('Balance Sheet Data Header: '+ (resObj.Header.Option[i].Value).value);
                            // console.log('Doesnt seem to be any report data for given quarter/year');
                        }
                    }
                    // res.write(JSON.stringify(response.body));
                }, function(err) {
                    console.log(err);
                    return res.json(err);
                });
            });
        }
        
        // CASH FLOWS STATEMENT - Iterate over the CF_URL_ARRAY; Check if data is present; If so, parse the data and store to database.
        // for (var z = 0; CF_URL_ARRAY.length - 1 >= z; z++) {
        //     var requester_CF = CF_URL_ARRAY[z];
        //     request(requester_CF, function(err, response) {
        //         // Check if 401 response was returned - refresh tokens if so!
        //         tools.checkForUnauthorized(req, requester_CF, err, response).then(function({ err, response }) {
        //             if (err || response.statusCode != 200) {
        //                 return res.json({ error: err, statusCode: response.statusCode });
        //             }
        //             var resObj = JSON.parse(response.body);
        //             var HeaderOptions = resObj.Header.Option;
        //             console.log((resObj.Header.Option[0].Value).value);
        //             // THIS WILL TELL YOU IF THE REPORT HAS DATA!
        //             for (var i = 0; HeaderOptions.length - 1 >= i; i++) {
        //                 if (((HeaderOptions[i].Name).value == 'NoReportData') && ((HeaderOptions[i].Value).value == false)) {
        //                     // Report contains data! Parse that shit!
        //                     parseCashFlows(resObj);
        //                 } else {
        //                     // ITS THE ACCOUNTING STANDARD SHIT && NO REPORT DATA... Forget about that iteration!
        //                     console.log('Doesnt seem to be any report data for given quarter/year');
        //                 }
        //             }
        //             // res.write(JSON.stringify(response.body));
        //         }, function(err) {
        //             console.log(err);
        //             return res.json(err);
        //         });
        //     });
        // }
    }, 100);
    console.log(res.statusCode);
    res.end();


});


function parseIncomeStatement(parseObj, date) {
    var Q_YYYY_Data = date;
    dbEntryCreation(Q_YYYY_Data);
    var resObj = parseObj;
    var topLevel = resObj.Rows.Row;

    for (var i = 0; topLevel.length - 1 >= i; i++) {
        // console.log(topLevel[i]);
        // console.log(topLevel[i].Summary);
        var itemName = (topLevel[i].Summary.ColData[0]).value;
        var itemVal = 0;
        // console.log('Date: ' + resObj.Header.StartPeriod + ' -- ' + itemName + ' : ' + itemVal);
        if (topLevel[i].Summary.ColData[1] == undefined) {
            itemVal = 0;
            // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + '-- $$$ --' + itemName + ' : ' + itemVal);
            storeToDB(itemName, itemVal, Q_YYYY_Data);
        } else {
            itemVal = topLevel[i].Summary.ColData[1].value;
            // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + '-- $$$ --' + itemName + ' : ' + itemVal);
            storeToDB(itemName, itemVal, Q_YYYY_Data);
        }
    }
}

function parseBalanceSheet(parseObj, date) {
    var resObj = parseObj;
    var Q_YYYY_Data = date;
    var hsdRef = admin.database().ref('/health-score-data/' + companyKey + '/' + Q_YYYY_Data),
        fadRef = admin.database().ref('/formal-accounting-data/' + companyKey + '/' + Q_YYYY_Data);
    var totalAssetsValue = 0,
        totalLib_Value = 0,
        totalEQ_Value = 0,
        totalBankAccountsValue = 0,
        inventoryAsset = 0,
        totalOtherCurrentAssets_Value = 0,
        longTermDebt_Value = 0,
        totalAccountsReceivable_Value = 0,
        totalAccountsPayable_Value = 0,
        otherPayable_Value = 0,
        notesPayable_Value = 0,
        CCE = 0,
        netAssets_currentQ_Value = 0;

    // TOTAL ASSETS
    if (resObj.Rows.Row[0].Summary.ColData != undefined) {
        totalAssetsValue = resObj.Rows.Row[0].Summary.ColData[1].value;
    }
    // TOTAL LIABILITIES
    if (resObj.Rows.Row[1].Rows.Row[0].Summary.ColData != undefined) {
        totalLib_Value = resObj.Rows.Row[1].Rows.Row[0].Summary.ColData[1].value;
    }
    // TOTAL EQUITY
    if (resObj.Rows.Row[1].Rows.Row[1].Summary.ColData != undefined) {
        totalEQ_Value = resObj.Rows.Row[1].Rows.Row[1].Summary.ColData[1].value;
    }
    if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[0].Summary.ColData != undefined) {
        totalBankAccountsValue = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[0].Summary.ColData[1].value;
    }
    for (var i = 0; 10 >= i; i++) {
        // ITERATING THROUGH ASSETS OBJECT
        if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i] != undefined) {
            //GRAB THE TOTAL ACCOUNTS RECEIVABLES
            if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[0].value == 'Total Accounts Receivable') {
                totalAccountsReceivable_Value = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[1].value;
            }
            // GRAB THE TOTAL OTHER CURRENT ASSETS
            if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[0].value == 'Total Other Current Assets') {
                totalOtherCurrentAssets_Value = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Summary.ColData[1].value;
            }
            // GRAB INVENTORY ASSET VALUE -- MUST BE SUBTRACTED FROM CCE FOR ACCURACY
            for (var j = 0;
                (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row).length - 1 >= j; j++) {
                if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row[j] != undefined) {

                    if (resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row[j].ColData[0].value == 'Inventory Asset') {
                        inventoryAsset = resObj.Rows.Row[0].Rows.Row[0].Rows.Row[i].Rows.Row[j].ColData[1].value;
                    }
                }

            }
        }
        // ITERATING THROUGH LIABILITIES OBJECT
        if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i] != undefined) {
            // GRAB LONG TERM LIABILITIES OBJECT
            if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Summary.ColData[0].value == 'Total Long-Term Liabilities') {
                longTermDebt_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Summary.ColData[1].value;
            }

            for (var k = 0; 8 >= k; k++) {
                if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k] != undefined) {
                    // GRAB NOTES PAYABLE VALUE - CHECK THIS FIRST SO ERROR ISN'T THROWN
                    if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].ColData != undefined) {
                        notesPayable_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].ColData[1].value;
                    }
                    //  THEN GRAB OTHER PAYABLE ITEMS AFTER CHECKING FOR NOTES PAYABLE
                    else if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData != undefined) {
                        if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[0].value == 'Total Accounts Payable') {
                            totalAccountsPayable_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[1].value;
                        }
                        if (resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[0].value == 'Total Other Current Liabilities') {
                            otherPayable_Value = resObj.Rows.Row[1].Rows.Row[0].Rows.Row[i].Rows.Row[k].Summary.ColData[1].value;
                        }
                    }

                }
            }
        }
    }
    // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Accounts Payable Value: '+totalAccountsPayable_Value);
    // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Long-Term Liabilities: '+longTermDebt_Value);
    // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Other Current Liabilities Value: '+otherPayable_Value);
    // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Total Other Current Assets Value: '+totalOtherCurrentAssets_Value);
    // console.log('Date: ' + resObj.Header.StartPeriod + ' - ' + resObj.Header.EndPeriod + ' ----- '+'Inventory Asset Value: '+inventoryAsset);
    CCE = ((Number(totalBankAccountsValue) + Number(totalOtherCurrentAssets_Value)) - Number(inventoryAsset));
    netAssets_currentQ_Value = (Number(totalAssetsValue) - Number(totalLib_Value));
    // console.log('Date: ' + Q_YYYY_Data+' ----- '+totalAssetsValue);
    // console.log('Date: ' + Q_YYYY_Data+' ----- '+totalBankAccountsValue +' PLUS '+ totalOtherCurrentAssets_Value + ' MINUS '+ inventoryAsset +' EQUALS '+ CCE);
    // console.log(' -------------------------- ');
    fadRef.update({'totalAssets': Number(totalAssetsValue).toFixed(2), 'totalLiabilities': Number(totalLib_Value).toFixed(2), 'totalEquity': Number(totalEQ_Value).toFixed(2), 'inventory': Number(inventoryAsset).toFixed(2), 'accntsReceivable': Number(totalAccountsReceivable_Value).toFixed(2), 'acctsPayable': Number(totalAccountsPayable_Value).toFixed(2)});
    hsdRef.update({'cashAndCashEq':Number(CCE).toFixed(2), 'LongTermDebt': Number(longTermDebt_Value).toFixed(2)});

    // RESET ITEM VALUES
    totalAssetsValue = 0;
    totalLib_Value = 0;
    totalEQ_Value = 0;
    totalBankAccountsValue = 0;
    totalOtherCurrentAssets_Value = 0;
    inventoryAsset = 0;
    totalAccountsReceivable_Value = 0;
    longTermDebt_Value = 0;
    totalAccountsPayable_Value = 0;
    otherPayable_Value = 0;
    notesPayable_Value = 0;
    netAssets_currentQ_Value = 0;
}

// function parseCashFlows(parseObj) {
//     var resObj = parseObj;
//     var topLevel = resObj.Rows.Row;
// }

function storeToDB(itemName, itemVal, date) {
    var name = itemName,
        val = itemVal;
    var Q_YYYY_Data = date;

    var hsdRef = admin.database().ref('/health-score-data/' + companyKey + '/' + Q_YYYY_Data),
        fadRef = admin.database().ref('/formal-accounting-data/' + companyKey + '/' + Q_YYYY_Data);

    switch (name) {
        // TAKEN FROM INCOME STATEMENT (PROFIT/LOSS) =>
    case 'Total Income':
        hsdRef.update({'netSales': Number(val).toFixed(2)});
        break;
    case 'Total Cost of Goods Sold':
        hsdRef.update({'costOGS': Number(val).toFixed(2)});
        break;
    case 'Gross Profit':
        fadRef.update({'grossOpProfit': Number(val).toFixed(2)});
        break;
    case 'Total Expenses':
        hsdRef.update({'TotalExpenses': Number(val).toFixed(2)});
        break;
    case 'Net Operating Income':
        fadRef.update({'EBITDA': Number(val).toFixed(2)});
        break;
    case 'Net Other Income':
        var absONOEXP = Math.abs(Number(val).toFixed(2));
        hsdRef.update({'otherNonOp': absONOEXP});
        break;
    case 'Net Income':
        hsdRef.update({'netIncome': Number(val).toFixed(2)});
        break;
    default:
        console.log('Couldnt parse data => Name:' + itemName + ' Value: ' + itemVal);
    }
}

function dbEntryCreation(Q_Date) {
    var qData = Q_Date;
    var HSDref = admin.database().ref().child('health-score-data/' + companyKey + "/" + qData);
    var FADref = admin.database().ref().child('formal-accounting-data/' + companyKey + "/" + qData);
    var DYWref = admin.database().ref().child('data-you-want/' + companyKey + "/" + qData);
    var SECTref = admin.database().ref().child('sector-data/' + companyKey + "/" + qData);

    HSDref.set({
        'TotalExpenses': 0.0,
        'LongTermDebt': 0.0,
        'deltaNetAssets': 0.0,
        'primaryReserveRatio': 0.0,
        'viabilityRatio': 0.0,
        'returnOnNetAssetsRatio': 0.0,
        'netOperatingRevenuesRatio': 0.0,
        'HealthScore': 0.0,
        'cashAndCashEq': 0.0,
        'costOGS': 0.0,
        'sellingAndAdmin': 0.0,
        'depAndAmort': 0.0,
        'otherNonOp': 0.0,
        'incomeTaxExp': 0.0,
        'prevQnetAssets': 0.0,
        'currQnetAssets': 0.0,
        'netIncome': 0.0,
        'netSales': 0.0,
        'interestExp': 0.0,
    });
    FADref.set({
        'grossOpProfit': 0.0,
        'EBITDA': 0.0,
        'totalAssets': 0.0,
        'totalLiabilities': 0.0,
        'totalEquity': 0.0,
        'EBIT': 0.0,
        'opActivites': 0.0,
        'investActivites': 0.0,
        'financeActivites': 0.0,
        'netInDeInCash': 0.0,
        'property': 0.0,
        'inventory': 0.0,
        'otherAssets': 0.0,
        'acctsPayable': 0.0,
        'accntsReceivable': 0.0,
        'interestPayable': 0.0,
        'taxesPayable': 0.0,
        'otherPayable': 0.0,
        'currentRatio': 0.0,
        'quickRatio': 0.0,
        'interestCoverageRatio': 0.0,
        'timesEarnedRatio': 0.0,
        'debtVsEquityRatio': 0.0,
        'equityMultiplier': 0.0,
        'grossProfitMargin': 0.0,
        'operatingProfitMargin': 0.0,
        'netProfitMargin': 0.0,
        'returnOnAssetsRatio': 0.0,
        'returnOnEquityRatio': 0.0,
        'dsi': 0.0,
        'dso': 0.0,
        'dpo': 0.0,
        'cashCycle': 0.0,
        'inventoryTO': 0.0,
        'receivablesTO': 0.0,
        'payablesTO': 0.0,
        'totalAssetsTO': 0.0,
    });
    DYWref.set({
        'acquisitionCostAvg': 0.0,
        'acquisitionRevAvg': 0.0,
        'businessDevExpenditure': 0.0,
        'travelAndEntertainment': 0.0,
        'revChannelMain': "",
        'revChannelMainAmt': 0.0,
        'fixedCostMain': "",
        'fixedCostMainAmt': 0.0,
        'dynamicCostMain': "",
        'dynamicCostMainAmt': 0.0,
    });
    SECTref.set({
        'item0': "",
        'item1': "",
        'item2': "",
        'item3': "",
        'item4': "",
        'item0Amt': 0.0,
        'item1Amt': 0.0,
        'item2Amt': 0.0,
        'item3Amt': 0.0,
        'item4Amt': 0.0,
    });
}

// Use the Qarter and Year to create a custom URL, check if the URL is valid, then... refer to parseReport()
// function genReportURL(initReq, tok, q, y) {
//     var req = initReq,
//         token = tok;
//     var start_Q1 = '-01-01',
//         end_Q1 = '-03-31',
//         start_Q2 = '-04-01',
//         end_Q2 = '-06-30',
//         start_Q3 = '-07-01',
//         end_Q3 = '-09-30',
//         start_Q4 = '-10-01',
//         end_Q4 = '-12-31';

//     if (q == 1) {
//         var url = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + y + start_Q1 + '&end_date=' + y + end_Q1;
//         console.log('Making API call to: ' + url);
//         var requestObj = {
//             url: url,
//             headers: {
//                 'Authorization': 'Bearer ' + token.accessToken,
//                 'Accept': 'application/json'
//             }
//         };
//     } else if (q == 2) {
//         var url = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + y + start_Q2 + '&end_date=' + y + end_Q2;
//         console.log('Making API call to: ' + url);
//         var requestObj = {
//             url: url,
//             headers: {
//                 'Authorization': 'Bearer ' + token.accessToken,
//                 'Accept': 'application/json'
//             }
//         };
//     } else if (q == 3) {
//         var url = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + y + start_Q3 + '&end_date=' + y + end_Q3;
//         console.log('Making API call to: ' + url);
//         var requestObj = {
//             url: url,
//             headers: {
//                 'Authorization': 'Bearer ' + token.accessToken,
//                 'Accept': 'application/json'
//             }
//         };
//     } else if (q == 4) {
//         var url = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?start_date=' + y + start_Q4 + '&end_date=' + y + end_Q4;
//         console.log('Making API call to: ' + url);
//         var requestObj = {
//             url: url,
//             headers: {
//                 'Authorization': 'Bearer ' + token.accessToken,
//                 'Accept': 'application/json'
//             }
//         };
//     }
// }



// Use the generated URL from genReportURL to grab the QB reponse object, and parse it into the database
// function parseReport(req, reqObject) {
//     var requestObj = reqObject;



// }









/** /api_call/revoke **/
router.get('/revoke', function (req, res) {
    var token = tools.getToken(req.session)
    if (!token) return res.json({ error: 'Not authorized' })

    var url = tools.revoke_uri
    request({
        url: url,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + tools.basicAuth,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'token': token.accessToken
        })
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            return res.json({ error: err, statusCode: response.statusCode })
        }
        tools.clearToken(req.session)
        res.json({ response: "Revoke successful" })
    })
})

/** /api_call/refresh **/
// Note: typical use case would be to refresh the tokens internally (not an API call)
// We recommend refreshing upon receiving a 401 Unauthorized response from Intuit.
// A working example of this can be seen above: `/api_call`
router.get('/refresh', function (req, res) {
    var token = tools.getToken(req.session)
    if (!token) return res.json({ error: 'Not authorized' })

    tools.refreshTokens(req.session).then(function (newToken) {
        // We have new tokens!
        res.json({
            accessToken: newToken.accessToken,
            refreshToken: newToken.refreshToken
        })
    }, function (err) {
        // Did we try to call refresh on an old token?
        console.log(err)
        res.json(err)
    })
})

module.exports = router









// if(topLevel[i].Header == undefined){
//     let itemName = (topLevel[i].Summary.ColData[0]).value;
//     let itemVal = (topLevel[i].Summary.ColData[1]).value;
//     console.log('No Header Data.');
//     console.log(itemName);
//     console.log(itemVal);
//   } else {
//     let itemName = (topLevel[i].Header.ColData[0]).value;
//     let itemVal = (topLevel[i].Summary.ColData[1]).value;
//     console.log('Header is not blank, null, or undefined.');
//     console.log(itemName);
//     console.log(itemVal);
//   }



// function parseReport(reqObject) {
//         var requestObj = reqObject;
//         // Make API call
//         request(requestObj, function(err, response) {
//             // Check if 401 response was returned - refresh tokens if so!
//             tools.checkForUnauthorized(req, requestObj, err, response).then(function({ err, response }) {
//                 if (err || response.statusCode != 200) {
//                     return res.json({ error: err, statusCode: response.statusCode });
//                 }

//                 // API Call was a success!
//                 var resObj = JSON.parse(response.body);
//                 var topLevel = resObj.Rows.Row;

//                 for (var i = 0; topLevel.length - 1 >= i; i++) {
//                     var itemName = (topLevel[i].Summary.ColData[0]).value;
//                     var itemVal = (topLevel[i].Summary.ColData[1]).value;
//                     console.log(itemName + ' : ' + itemVal);
//                     // console.log(itemVal);
//                 }
//                 console.log(resObj.Header.StartPeriod);
//                 console.log(resObj.Header.EndPeriod);

//                 res.json(JSON.parse(response.body));
//             }, function(err) {
//                 console.log(err);
//                 return res.json(err);
//             });
//         });
//     }





// Set up API call (with OAuth2 accessToken)
// var url = config.api_uri + req.session.realmId + '/reports/ProfitAndLoss?date_macro=This Fiscal Year-to-date';
// console.log('Making API call to: ' + url);
// var requestObj = {
//     url: url,
//     headers: {
//         'Authorization': 'Bearer ' + token.accessToken,
//         'Accept': 'application/json'
//     }
// };
// // Make API call
// request(requestObj, function(err, response) {
//     // Check if 401 response was returned - refresh tokens if so!
//     tools.checkForUnauthorized(req, requestObj, err, response).then(function({ err, response }) {
//         if (err || response.statusCode != 200) {
//             return res.json({ error: err, statusCode: response.statusCode });
//         }

//         // API Call was a success!
//         let resObj = JSON.parse(response.body);
//         let topLevel = resObj.Rows.Row;

//         for (var i = 0; topLevel.length - 1 >= i; i++) {
//             let itemName = (topLevel[i].Summary.ColData[0]).value;
//             let itemVal = (topLevel[i].Summary.ColData[1]).value;
//             console.log(itemName + ' : ' + itemVal);
//             // console.log(itemVal);
//         }
//         console.log(resObj.Header.StartPeriod);
//         console.log(resObj.Header.EndPeriod);

//         res.json(JSON.parse(response.body));
//     }, function(err) {
//         console.log(err);
//         return res.json(err);
//     });
// });