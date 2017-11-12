/**
 * BAD LITTLE GLOBAL VARIABLES
 * 
 *  || || || || || || || ||
 *  \/ \/ \/ \/ \/ \/ \/ \/
 */
var companySelectionKey,
    selectedCompanyName,
    currentHealthScore,
    currentYear = moment().format("YYYY"),
    currentQuarter = moment().format("Q-YYYY"),
    justTheQ = moment().format("Q"),
    previousQuarter = moment().subtract(1, 'Q').format("Q-YYYY"),
    previousJustTheQ = moment().subtract(1, 'Q').format("Q"),
    currentUserID,
    currCompCash,
    qBack,
    now = moment();
endOfQuarter = moment().endOf('quarter');
countDown = endOfQuarter.diff(now, 'days', true);;


/**
 *  GENERATE RANDOM COLORS FOR CHARTS
 */
var poolColors = function(a) {
    var pool = [];
    for (i = 0; i < a; i++) {
        pool.push(dynamicColors());
    }
    return pool;
};
var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
};

// function launchPopup(path) {
//     var win;
//     var checkConnect;
//     var parameters = "location=1,width=800,height=650";
//     parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;

//     // Launch Popup
//     win = window.open(path, 'connectPopup', parameters);
//   }
// HIDE HAEDER ON SCROLL 
$(function() {
    $("#mainContentArea").swipe({
        //Generic swipe handler for all directions
        swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            if (screen.width <= 900) {
                if (direction == "up") {
                    $('#mainPageHeader').hide('fast');
                } else if (direction == "down") {
                    $('#mainPageHeader').show('fast');
                }
            }
        },
        preventDefaultEvents: false,
        threshold: 25,

    });

    //Set some options later
    // $("#test").swipe( {fingers:2} );
});

/**
 * THAT DAMN HEALTH SCORE EXPLINATION
 **/
function thatDamnHealthScoreExplination() {
    var explanationPrompt = {
        state0: {
            title: 'Health Score Explanation:',
            html: "<label style='font-size:14px;'>A Health Score of 3 or above indicates that the business has sufficiently and adequately managed resources to sustain itself as a viable entity. A business' score on the scale is relative to many factors, and measures of financial health are one of a myriad of indicators with regard to business success. Consequently, many rising businesses, in early stage or pre-revenue, might register a score of 0-3 alongside a business which is fledgling with little potential or one in decline. Hence, it is important to know why a business scores where it does on the Health Score scale.</label>",
            buttons: { Alright: false, 'Got It': true },
            focus: 1,
            submit: function(e, v, m, f) {
                if (v) {
                    $.prompt.close();
                } else {
                    $.prompt.close();
                }
                $.prompt.close();
            }
        }

    };

    $.prompt(explanationPrompt);



    // $.prompt("A Health Score of 3 or above indicates that the business has sufficiently and adequately managed resources to sustain itself as a viable entity. A business' score on the scale is relative to many factors, and measures of financial health are one of a myriad of indicators with regard to business success. Consequently, many rising businesses, in early stage or pre-revenue, might register a score of 0-3 alongside a business which is fledgling with little potential or one in decline. Hence, it is important to know why a business scores where it does on the Health Score scale.");
}
/**
 *  COMMAS IN NUMBERS
 */
function numberWithCommas(x) {
    try {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (err) {

        return 0.0;
    }

}

/**
 *  QUARTER COUNTDOWN LABEL
 **/
function quarterCountdown() {
    // var now = moment();
    // var endOfQuarter = moment().endOf('quarter');
    // var countDown = endOfQuarter.diff(now, 'days', true);
    document.getElementById('quarterCountdown').innerHTML = '<label id="daysInQuarterLabel">' + Number(countDown).toFixed(1) + ' <small>Days left in </small>Q' + justTheQ + '</label>';
}

function backInTime() {
    // qBack = moment().subtract(1, 'Q').format("Q-YYYY");
    $('#dateSeclector').html('<option value="" disabled selected>Choose Date</option>');
    firebase.database().ref('health-score-data/' + companySelectionKey).once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            $('#dateSeclector').append('<option value="' + childSnapshot.key + '">' + childSnapshot.key + '</option>');
        });
    });
}

/**
 * LOG-OUT FUNCTION 
 */
function logOut() {
    firebase.auth().signOut();
    // console.log('Well... i hope the user got logged out...');
    // window.location = 'login.html';
}

/**
 *  TOGGLE PUBLIC VS PRIVATE VIEW
 **/
function toggleDisplayMode() {
    $("#modeToggleButton").text($("#modeToggleButton").text() == 'Watcher Mode' ? 'Admin Mode' : 'Watcher Mode');

    $("#hlthScoreRatioEditButton2").toggle();
    $("#hlthScoreRatioEditButton").toggle();
    $("#ALLcomponentsEditButton").toggle();
    $("#dywChartEditButton").toggle();
    $("#aVlChartEditButton").toggle();
    $("#sectorDataEditButton").toggle();
    $("#compDesEditButton").toggle();
    // $("#pastHSdataPointButton").toggle();
    // $("#removePastHSdataButton").toggle();
    $("#devareCompanyButton").toggle();
    $("#blankCompanyButton").toggle();
    $("#dywChanEditButton").toggle();
    $("#aVlDisplayEditButton").toggle();
    $("#fadBalanceEditButton").toggle();
    $("#fadIncomeEditButton").toggle();
    $("#fadCashFlowEditButton").toggle();
    $("#allDataInputsCard").toggle();
}


/** 
 * LINK COMPANY TO USER FUNCTION
 */
function linkEmUp() {

    var addToWatchList = {
        state0: {
            html: '<label style="font-size: 16px;">Add to WatchList. Include dash(-)</label><br><br>' +
                '<input style="font-size: 16px; width: 300px;" name="compKey" type="text" min="20" max="20" placeholder="Format: -KjFEpLM12PwlBWbyeCD" required />',
            buttons: { Cancel: false, Link: true },
            focus: 1,
            submit: function(e, v, m, f) {
                if (v) {
                    e.preventDefault();
                    // console.log('Quarter Number', data.qNum, 'and the Year', data.yearNum);
                    // Create the Health Score Database Structure
                    var linkKey = f.compKey;
                    var ref = firebase.database().ref().child('users/' + currentUserID + '/linked-companies/' + linkKey);
                    // var Emailref = firebase.database().ref('users/' + currentUserID + "/email").once("value", function(emailSnap){
                    //     var compLinkRef = firebase.database().ref().child('company-description-data/' + data.compKey + '/linked-users/' + currentUserID);
                    //     compLinkRef.set(emailSnap.val()).then(function() {
                    //         console.log("Successful company-description-data Link!");
                    //     });
                    // });

                    ref.set(true).then(function() {
                        alert("Successful Company Link!");
                    });
                    return false;
                } else {
                    $.prompt.close();
                }

            }
        },
    };

    $.prompt(addToWatchList);



}



function getLinkedUsers(adminStatus) {
    document.getElementById("companyLinkList").innerHTML = "";
    if (adminStatus == true) {
        firebase.database().ref("company-description-data/" + companySelectionKey + "/linked-users").once("value", function(linkData) {
            linkData.forEach(function(linkSnap) {
                $("#companyLinkList").append("<a title='Click to Edit' href='#' onclick='watcherEdit(event)' style='color:black; vertical-align: middle;' id=" + linkSnap.key + ">" + linkSnap.val() + "</a><br>");
            });
        }).catch(function(error) {
            console.log("Error Message: " + error);
            document.getElementById("companyLinkList").innerHTML = "";
        });
    } else {
        document.getElementById("companyLinkList").innerHTML = "";
    }
}

function watcherEdit(event) {
    var userWatcher = document.getElementById(event.target.id);
    var statesdemo = {
        state0: {
            title: 'Edit Watcher: ' + $(userWatcher).html(),
            html: '<br><label>Select Action: <select name="actionType" required>' +
                '<option value="removeWatcher" selected>Remove Watcher</option>' +
                '<option value="setAdmin">Set as Admin</option>' +
                '</select></label>',
            focus: 0,
            buttons: { "Okay": true, "Nevermind": false },
            submit: function(e, v, m, f) {
                if (v == true) {
                    if (f.actionType == "removeWatcher") {
                        firebase.database().ref('users/' + event.target.id + "/linked-companies/" + companySelectionKey).remove().then(function() {
                            console.log("Remove succeeded.");
                        }).catch(function(error) {
                            console.log("Remove failed: " + error.message);
                        });

                        firebase.database().ref('company-description-data/' + companySelectionKey + "/linked-users/" + event.target.id).remove().then(function() {
                            console.log("Remove succeeded.");
                        }).catch(function(error) {
                            alert("Error Message: " + error.message);
                            console.log("Remove failed: " + error.message);
                        });
                    } else if (f.actionType == "setAdmin") {
                        firebase.database().ref('company-description-data/' + companySelectionKey + "/admin").set(event.target.id).then(function() {
                            firebase.database().ref('users/' + currentUserID + "/email").once("value").then(function(emailSnap) {
                                var userEmail = emailSnap.val();
                                firebase.database().ref().child('company-description-data/' + companySelectionKey + "/linked-users/" + currentUserID).set(userEmail).then(function() {
                                    firebase.database().ref('company-description-data/' + companySelectionKey + "/linked-users/" + event.target.id).remove().then(function() {
                                        console.log("Remove succeeded.");
                                    }).catch(function(error) {
                                        console.log("Remove failed: " + error.message);
                                    });
                                }).catch(function(error) {
                                    console.log("Change failed: " + error.message);
                                });

                            });

                            $.prompt("Administrator successfully changed.");
                        }).catch(function(error) {
                            alert("Error Message: " + error.message);
                            console.log("Change failed: " + error.message);
                        });
                    }

                } else {
                    $.prompt.close();
                }
            }
        },

    };
    $.prompt(statesdemo);
}

/**
 *  TEST CHART DISPLAY FUNCTION
 */
function testChart() {
    var pdx = document.getElementById("pieChart");
    var ddx = document.getElementById("dnChart");
    var ctx = document.getElementById("healthScoreBarCharttest");
    var ardx = document.getElementById("assetsRadarChart");
    var lrdx = document.getElementById("ratioWebChart");


    var data = {
        datasets: [{
            data: [
                16,
                6,
                13,
                20,
                8
            ],
            backgroundColor: [
                "#FF6384",
                "#4BC0C0",
                "#FFCE56",
                "#E7E9ED",
                "#36A2EB"
            ],
            label: 'Fake Data' // for legend
        }],
        labels: [
            "Fake Data",
            "Fake Data",
            "Fake Data",
            "Fake Data",
            "Fake Data"
        ]
    };

    var data2 = {
        labels: [
            "Fake Data",
            "Fake Data",
            "Fake Data"
        ],
        datasets: [{
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]


    };
    var dataR = {
        labels: ["Fake Data", "Fake Data", "Fake Data", "Fake Data", "Fake Data", "Fake Data", "Fake Data"],
        datasets: [{
                label: "Fake Data",
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBackgroundColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(179,181,198,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: "Fake Data",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };



    // For a pie chart
    var myPieChart = new Chart(pdx, {
        type: 'pie',
        data: data2,
        options: {
            elements: {
                responsive: true,
                arc: {
                    borderColor: "white"
                }
            }
        }
    });
    // And for a doughnut chart
    var myDoughnutChart = new Chart(ddx, {
        type: 'doughnut',
        data: data2,
        options: {
            responsive: true,
            elements: {
                arc: {
                    borderColor: "white"
                }
            }
        }
    });


    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["1-2017", "2-2017", "3-2017", "4-2017", "1-2018", "2-2018"],
            datasets: [{
                label: 'Health Score (Fake Data)',
                data: [8, 3.4, 4.2, 9.3, 2.9, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                easing: "easeInOutElastic",

            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    var aradarChart = new Chart(ardx, {
        data: data,
        type: "polarArea",
        options: {
            deferred: {
                enabled: true,
            },
            elements: {
                arc: {
                    borderColor: "white"
                }
            }
        }
    });

    var myRadarChart = new Chart(lrdx, {
        type: 'radar',
        data: dataR,
        options: {
            responsive: true,
            animation: {
                easing: "easeInOutElastic",
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }

    });


}




/**
 * CREATE NEW/BLANK COMPANY  - LARGE FUNCTION
 */
function createBlankCompany() {
    var newCompDialog = {
        state0: {
            html: 'Create new Company? This will generate a Key which you can share.',
            buttons: { Cancel: false, Next: true },
            focus: 1,
            submit: function(e, v, m, f) {
                if (v) {
                    e.preventDefault();
                    $.prompt.goToState('state1');
                    return false;
                }
                $.prompt.close();
            }
        },
        state1: {
            html: '<label style="font-size:16px;">Enter Company Name, Main Sector and Sub Sector.</label><br><br>' +
                '<input style="font-size:16px;" name="name" type="text"placeholder="Company Name" required /><br>' +
                '<input style="font-size:16px;" name="mainSector" type="text"placeholder="Main Sector" required /><br>' +
                '<input style="font-size:16px;" name="subSector" type="text"placeholder="Sub Sector" required />',
            buttons: { Back: -1, 'Create!': 0 },
            focus: 1,
            submit: function(e, v, m, f) {
                e.preventDefault();
                if (v == 0) {
                    var userid = firebase.auth().currentUser.uid,
                        companyDescriptionRef = firebase.database().ref().child('company-description-data'),
                        newCompanyKey = companyDescriptionRef.push().key;


                    // Create Reference to the newly created Company Key
                    var cdDataBaseRef = firebase.database().ref().child('company-description-data/' + newCompanyKey),
                        fadDataBaseRef = firebase.database().ref().child('formal-accounting-data/' + newCompanyKey + "/" + currentQuarter),
                        dywDataBaseRef = firebase.database().ref().child('data-you-want/' + newCompanyKey + "/" + currentQuarter),
                        hsDataBaseRef = firebase.database().ref().child('health-score-data/' + newCompanyKey + "/" + currentQuarter),
                        // scanDataBaseRef = firebase.database().ref().child('scan-data/' + newCompanyKey + "/" + currentQuarter),
                        sectDataBaseRef = firebase.database().ref().child('sector-data/' + newCompanyKey + "/" + currentQuarter),
                        lkDataBaseRef = firebase.database().ref().child('users/' + userid + '/linked-companies/' + newCompanyKey);

                    // [START] Create JSON vaiables with proper data reference structure [START]


                    cdDataBaseRef.set({
                        'name': "",
                        'hq': "",
                        'description': "",
                        'admin': currentUserID
                    });
                    cdDataBaseRef.update({ 'name': f.name, 'mainSector': f.mainSector, 'subSector': f.subSector });
                    fadDataBaseRef.set({
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
                    dywDataBaseRef.set({
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
                    hsDataBaseRef.set({
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
                    sectDataBaseRef.set({
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
                    lkDataBaseRef.set(true).then(function() {
                        $.prompt("This is the new Company's Key: " + newCompanyKey, {
                            title: "New Company Created!",
                            buttons: { "Yes, I'm Ready": true, "No, Lets Wait": false },
                            submit: function(e, v, m, f) {
                                // use e.preventDefault() to prevent closing when needed or return false.
                                // e.preventDefault();
                                HScomponentInput();

                                console.log("Value clicked was: " + v);
                            }
                        });


                        // $.prompt("This is the new Company's Key: " + newCompanyKey);
                        // HScomponesntInput();
                    }).catch(function(error) {
                        alert("Error Message: " + error.message);
                        console.log("Creation failed: " + error.message);
                    });
                } else if (v == -1) {

                    $.prompt.goToState('state0');
                }
            }
        }

    };

    $.prompt(newCompDialog);



}
/**
 * DUPLICATE CURRENT COMPANY
 **/
function duplicateCompany() {
    var states = {
        state0: {
            title: 'Dulpicate Company Data?',
            html: '<input name="compNameInput" id="compNameInput type="text" placeholder="Duplicate Name"/><br>',
            focus: 0,
            buttons: { "Yes, Duplicate!": true, "No, Nevermind": false },
            submit: function(e, v, m, f) {
                e.preventDefault();
                if (v == true) {
                    var companyDescriptionRef = firebase.database().ref().child('company-description-data');
                    var newCompanyKey = companyDescriptionRef.push().key;
                    var cdDataBaseRef = firebase.database().ref().child('company-description-data/' + newCompanyKey),
                        lkDataBaseRef = firebase.database().ref().child('users/' + currentUserID + '/linked-companies/' + newCompanyKey);

                    firebase.database().ref().child('company-description-data/' + companySelectionKey).once('value').then(function(dataSnap) {
                        cdDataBaseRef.set({
                            name: f.compNameInput,
                            hq: dataSnap.child('/hq').val(),
                            mainSector: dataSnap.child('/mainSector').val(),
                            subSector: dataSnap.child('/subSector').val(),
                            description: dataSnap.child('/description').val(),
                            admin: currentUserID
                        });
                    });


                    // Health Score Data Duplication
                    firebase.database().ref('health-score-data/' + companySelectionKey).once("value", function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var HSduplicateRef = firebase.database().ref().child('health-score-data/' + newCompanyKey + "/" + childSnapshot.key);
                            HSduplicateRef.set({
                                TotalExpenses: childSnapshot.child('/TotalExpenses').val(),
                                LongTermDebt: childSnapshot.child('/LongTermDebt').val(),
                                deltaNetAssets: childSnapshot.child('/deltaNetAssets').val(),
                                primaryReserveRatio: childSnapshot.child('/primaryReserveRatio').val(),
                                viabilityRatio: childSnapshot.child('/viabilityRatio').val(),
                                returnOnNetAssetsRatio: childSnapshot.child('/returnOnNetAssetsRatio').val(),
                                netOperatingRevenuesRatio: childSnapshot.child('/netOperatingRevenuesRatio').val(),
                                HealthScore: childSnapshot.child('/HealthScore').val(),
                                cashAndCashEq: childSnapshot.child('/cashAndCashEq').val(),
                                costOGS: childSnapshot.child('/costOGS').val(),
                                sellingAndAdmin: childSnapshot.child('/sellingAndAdmin').val(),
                                depAndAmort: childSnapshot.child('/depAndAmort').val(),
                                otherNonOp: childSnapshot.child('/otherNonOp').val(),
                                incomeTaxExp: childSnapshot.child('/incomeTaxExp').val(),
                                prevQnetAssets: childSnapshot.child('/prevQnetAssets').val(),
                                currQnetAssets: childSnapshot.child('/currQnetAssets').val(),
                                netIncome: childSnapshot.child('/netIncome').val(),
                                netSales: childSnapshot.child('/netSales').val(),
                                interestExp: childSnapshot.child('/interestExp').val(),
                            });
                        });
                    });

                    // Formal Accounting Data Duplication
                    firebase.database().ref('formal-accounting-data/' + companySelectionKey).once("value", function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var FADduplicateRef = firebase.database().ref().child('formal-accounting-data/' + newCompanyKey + "/" + childSnapshot.key);
                            FADduplicateRef.set({
                                grossOpProfit: childSnapshot.child('/grossOpProfit').val(),
                                EBITDA: childSnapshot.child('/EBITDA').val(),
                                totalAssets: childSnapshot.child('/totalAssets').val(),
                                totalLiabilities: childSnapshot.child('/totalLiabilities').val(),
                                totalEquity: childSnapshot.child('/totalEquity').val(),
                                EBIT: childSnapshot.child('/EBIT').val(),
                                opActivites: childSnapshot.child('/opActivites').val(),
                                investActivites: childSnapshot.child('/investActivites').val(),
                                financeActivites: childSnapshot.child('/financeActivites').val(),
                                netInDeInCash: childSnapshot.child('/netInDeInCash').val(),
                                property: childSnapshot.child('/property').val(),
                                inventory: childSnapshot.child('/inventory').val(),
                                otherAssets: childSnapshot.child('/otherAssets').val(),
                                acctsPayable: childSnapshot.child('/acctsPayable').val(),
                                accntsReceivable: childSnapshot.child('/accntsReceivable').val(),
                                interestPayable: childSnapshot.child('/interestPayable').val(),
                                taxesPayable: childSnapshot.child('/taxesPayable').val(),
                                otherPayable: childSnapshot.child('/otherPayable').val(),
                                currentRatio: childSnapshot.child('/currentRatio').val(),
                                quickRatio: childSnapshot.child('/quickRatio').val(),
                                interestCoverageRatio: childSnapshot.child('/interestCoverageRatio').val(),
                                timesEarnedRatio: childSnapshot.child('/timesEarnedRatio').val(),
                                debtVsEquityRatio: childSnapshot.child('/debtVsEquityRatio').val(),
                                equityMultiplier: childSnapshot.child('/equityMultiplier').val(),
                                grossProfitMargin: childSnapshot.child('/grossProfitMargin').val(),
                                operatingProfitMargin: childSnapshot.child('/operatingProfitMargin').val(),
                                netProfitMargin: childSnapshot.child('/netProfitMargin').val(),
                                returnOnAssetsRatio: childSnapshot.child('/returnOnAssetsRatio').val(),
                                returnOnEquityRatio: childSnapshot.child('/returnOnEquityRatio').val(),
                                dsi: childSnapshot.child('/dsi').val(),
                                dso: childSnapshot.child('/dso').val(),
                                dpo: childSnapshot.child('/dpo').val(),
                                cashCycle: childSnapshot.child('/cashCycle').val(),
                                inventoryTO: childSnapshot.child('/inventoryTO').val(),
                                receivablesTO: childSnapshot.child('/receivablesTO').val(),
                                payablesTO: childSnapshot.child('/payablesTO').val(),
                                totalAssetsTO: childSnapshot.child('/totalAssetsTO').val(),
                            });
                        });
                    });

                    // Data You Want Duplication
                    firebase.database().ref('data-you-want/' + companySelectionKey).once("value", function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var DYWduplicateRef = firebase.database().ref().child('data-you-want/' + newCompanyKey + "/" + childSnapshot.key);
                            DYWduplicateRef.set({
                                acquisitionCostAvg: childSnapshot.child('/acquisitionCostAvg').val(),
                                acquisitionRevAvg: childSnapshot.child('/acquisitionRevAvg').val(),
                                businessDevExpenditure: childSnapshot.child('/businessDevExpenditure').val(),
                                travelAndEntertainment: childSnapshot.child('/travelAndEntertainment').val(),
                                grossMonthlyExpenditure: childSnapshot.child('/grossMonthlyExpenditure').val(),
                                grossMonthlyRevenue: childSnapshot.child('/grossMonthlyRevenue').val(),
                                revChannelMain: childSnapshot.child('/revChannelMain').val(),
                                revChannelMainAmt: childSnapshot.child('/revChannelMainAmt').val(),
                                fixedCostMain: childSnapshot.child('/fixedCostMain').val(),
                                fixedCostMainAmt: childSnapshot.child('/fixedCostMainAmt').val(),
                                dynamicCostMain: childSnapshot.child('/dynamicCostMain').val(),
                                dynamicCostMainAmt: childSnapshot.child('/dynamicCostMainAmt').val(),
                            });
                        });
                    });

                    // Data You Want Duplication
                    firebase.database().ref('sector-data/' + companySelectionKey).once("value", function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var SDduplicateRef = firebase.database().ref().child('sector-data/' + newCompanyKey + "/" + childSnapshot.key);
                            SDduplicateRef.set({
                                item0: childSnapshot.child('/item0').val(),
                                item1: childSnapshot.child('/item1').val(),
                                item2: childSnapshot.child('/item2').val(),
                                item3: childSnapshot.child('/item3').val(),
                                item4: childSnapshot.child('/item4').val(),
                                item0Amt: childSnapshot.child('/item0Amt').val(),
                                item1Amt: childSnapshot.child('/item1Amt').val(),
                                item2Amt: childSnapshot.child('/item2Amt').val(),
                                item3Amt: childSnapshot.child('/item3Amt').val(),
                                item4Amt: childSnapshot.child('/item4Amt').val(),
                            });
                        });
                    });


                    lkDataBaseRef.set(true).then(function() {
                        $.prompt("Duplicate Company's Key: " + newCompanyKey);
                    }).catch(function(error) {
                        alert("Error Message: " + error.message);
                        console.log("Duplication failed: " + error.message);
                    });

                    $.prompt.close();
                    generateCompanyList();

                } else {
                    $.prompt.close();
                }
            }
        },

    };
    $.prompt(states);

}

/**
 * GENERATE COMPANY LIST!!!
 */
function generateCompanyList() {
    // $("#companyListNavPannel").html("");
    document.getElementById("companyListNavPannel").innerHTML = "";
    var ref = firebase.database().ref("users/" + currentUserID + "/linked-companies").on("child_added", function(snapshot) {
        firebase.database().ref('company-description-data/' + snapshot.key + '/name').once("value").then(function(snap) {
            firebase.database().ref('health-score-data/' + snapshot.key + "/" + currentQuarter).once("value").then(function(hlthSnap) {
                if ((hlthSnap.child('HealthScore').val() == 0) || (hlthSnap.child('HealthScore').val() == null)) {

                    firebase.database().ref('health-score-data/' + snapshot.key + "/" + previousQuarter).once("value").then(function(prevHealthSnap) {
                        document.getElementById('companyListNavPannel').innerHTML += '<li class="mdl-list__item mdl-list__item--two-line companyNavItem" onclick="displayCompanyData(event)" id="' + snapshot.key + '"><a id="' + snapshot.key + '" href="#" style="display: flex; color: black;"><i id="' + snapshot.key + '" class="material-icons navListIcon" style="margin-right: 25px;">bubble_chart</i><span style="color: #606060;" id="' + snapshot.key + '" class="mdl-list__item-primary-content"><span class="navlistName" id="' + snapshot.key + '">' + snap.val() + '</span><span id="' + snapshot.key + '" class="mdl-list__item-sub-title">Q' + previousJustTheQ + ': ' + Number(prevHealthSnap.child('/HealthScore').val()).toFixed(2) + '</span></span></a></li>';
                    });

                } else {
                    document.getElementById('companyListNavPannel').innerHTML += '<li class="mdl-list__item mdl-list__item--two-line companyNavItem" onclick="displayCompanyData(event)" id="' + snapshot.key + '"><a id="' + snapshot.key + '" href="#" style="display: flex; color: black;"><i id="' + snapshot.key + '" class="material-icons navListIcon" style="margin-right: 25px;">bubble_chart</i><span style="color: #606060;" id="' + snapshot.key + '" class="mdl-list__item-primary-content"><span class="navlistName" id="' + snapshot.key + '">' + snap.val() + '</span><span id="' + snapshot.key + '" class="mdl-list__item-sub-title">Q' + justTheQ + ': ' + Number(hlthSnap.child('/HealthScore').val()).toFixed(2) + '</span></span></a></li>';
                }


            });
        });
    });

    // firebase.database().ref('company-description-data/' + snapshot.key + '/name').off('value', ref);
    // ref.off();
}

//SELECT PROPER INDEX FROM DATE SELECTOR



/**
 * DISPLAY COMPANY WHEN CLICKED [START] - LARGE FUNCTION
 */
function displayCompanyData(event) {
    companySelectionKey = event.target.id;
    backInTime();
    var qSelectionBox = document.getElementById('dateSeclector');
    // var days = document.getElementById('daysInQuarterLabel');

    // CREATE CANVASES FOR THE CHARTS AND SOME OTHER SMALL THINGS AT THE END
    document.getElementById('finRatioChartArea').innerHTML = '<h3 style="color: black;">Select Financial Ratio Below</h3><h5>Display trend data for all Data Points(Line Graph)</h5>';
    document.getElementById('hsChartArea').innerHTML = '<canvas id="healthScoreBarChart" height="30%" width="100%""></canvas>';
    document.getElementById('ratioWebArea').innerHTML = '<canvas id="ratioWebChart" height="75%" width="100%" style="padding-right: 50px;"></canvas>';
    document.getElementById('assetsRadar').innerHTML = '<canvas id="assetsRadarChart" height="320px" width="320px""></canvas>';
    document.getElementById('pieDiv').innerHTML = '<canvas id="pieChart" style="width: 100%; height: 320px;""></canvas>';
    document.getElementById('doughDiv').innerHTML = '<canvas id="dnChart" style="width: 100%; height: 320px;""></canvas>';
    document.getElementById('modeToggleButton').innerHTML = 'ADMIN MODE';
    document.getElementById('dataDisplayDateLabel').innerHTML = '<small>Displaying Data for</small> Q' + moment().format("Q-YY");


    // $("#dateSeclector option[value='"+previousQuarter+"']").prop('selected', true);

    // setSelectedIndex(qSelectionBox, previousQuarter);

    // console.log(countDown);

    // if (Number(countDown) <= 70){
    //     setSelectedIndex(qSelectionBox, moment().subtract(1, 'Q').format("Q-YYYY"));
    //     qSelectionBox.value = previousQuarter;
    //     console.log(previousQuarter);
    //     getCompanyDescriptionData();
    //     PREVgetHealthScoreData(previousQuarter);
    //     PREVgetAccountingData(previousQuarter);
    //     PREVgetDataYouWant(previousQuarter);
    //     // $('#dateSeclector select').val(previousQuarter);
    //     // $("#dateSeclector option[value='"+previousQuarter+"']").prop('selected', true);

    //     // Sector Data Section:
    //     firebase.database().ref('sector-data/' + companySelectionKey + "/" + previousQuarter).on('value', function(snap) {
    //         document.getElementById('sectorItem0Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item0').val() + "</td><td>$" + numberWithCommas(snap.child('/item0Amt').val()) + "</td>";
    //         document.getElementById('sectorItem1Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item1').val() + "</td><td>$" + numberWithCommas(snap.child('/item1Amt').val()) + "</td>";
    //         document.getElementById('sectorItem2Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item2').val() + "</td><td>$" + numberWithCommas(snap.child('/item2Amt').val()) + "</td>";
    //         document.getElementById('sectorItem3Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item3').val() + "</td><td>$" + numberWithCommas(snap.child('/item3Amt').val()) + "</td>";
    //         document.getElementById('sectorItem4Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item4').val() + "</td><td>$" + numberWithCommas(snap.child('/item4Amt').val()) + "</td>";

    //     });
    // }else {
    //     // $("#dateSeclector option[value='"+currentQuarter+"']").prop('selected', true);
    //     // $('#dateSeclector select').val(currentQuarter);
    //     // qSelectionBox.value = moment().format("Q-YYYY");
    //     console.log(currentQuarter);
    //     qSelectionBox.value = moment().format("Q-YYYY");
    //     setSelectedIndex(qSelectionBox, moment().format("Q-YYYY"));
    // PREVgetHealthScoreData(currentQuarter);
    // PREVgetAccountingData(currentQuarter);
    // PREVgetDataYouWant(currentQuarter);

    // getCompanyDescriptionData();
    // getHealthScoreData();
    // getAccountingData();
    // getDataYouWant();
    // console.log(qSelectionBox.value);



    // Sector Data Section:
    // firebase.database().ref('sector-data/' + companySelectionKey + "/" + currentQuarter).on('value', function(snap) {
    //     document.getElementById('sectorItem0Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item0').val() + "</td><td>$" + numberWithCommas(snap.child('/item0Amt').val()) + "</td>";
    //     document.getElementById('sectorItem1Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item1').val() + "</td><td>$" + numberWithCommas(snap.child('/item1Amt').val()) + "</td>";
    //     document.getElementById('sectorItem2Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item2').val() + "</td><td>$" + numberWithCommas(snap.child('/item2Amt').val()) + "</td>";
    //     document.getElementById('sectorItem3Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item3').val() + "</td><td>$" + numberWithCommas(snap.child('/item3Amt').val()) + "</td>";
    //     document.getElementById('sectorItem4Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item4').val() + "</td><td>$" + numberWithCommas(snap.child('/item4Amt').val()) + "</td>";
    // });
    // }



    firebase.database().ref('health-score-data/' + companySelectionKey + "/" + currentQuarter).once('value').then(function(hsDataToCheck) {
        firebase.database().ref('health-score-data/' + companySelectionKey + "/" + previousQuarter).once('value').then(function(prevHsDataToCheck) {
            console.log(hsDataToCheck.child('HealthScore').val());
            console.log(prevHsDataToCheck.child('HealthScore').val());


            if ((hsDataToCheck.child('HealthScore').val() != 0) && (hsDataToCheck.child('HealthScore').val() != null)) {
                setTimeout(function() {
                    qSelectionBox.value = currentQuarter;
                }, 300);
                getCompanyDescriptionData();
                PREVgetHealthScoreData(currentQuarter);
                PREVgetAccountingData(currentQuarter);
                PREVgetDataYouWant(currentQuarter);

                // Sector Data Section:
                firebase.database().ref('sector-data/' + companySelectionKey + "/" + currentQuarter).on('value', function(snap) {
                    document.getElementById('sectorItem0Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item0').val() + "</td><td>$" + numberWithCommas(snap.child('/item0Amt').val()) + "</td>";
                    document.getElementById('sectorItem1Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item1').val() + "</td><td>$" + numberWithCommas(snap.child('/item1Amt').val()) + "</td>";
                    document.getElementById('sectorItem2Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item2').val() + "</td><td>$" + numberWithCommas(snap.child('/item2Amt').val()) + "</td>";
                    document.getElementById('sectorItem3Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item3').val() + "</td><td>$" + numberWithCommas(snap.child('/item3Amt').val()) + "</td>";
                    document.getElementById('sectorItem4Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item4').val() + "</td><td>$" + numberWithCommas(snap.child('/item4Amt').val()) + "</td>";
                });
            } else if ((prevHsDataToCheck.child('HealthScore').val() != 0) && (prevHsDataToCheck.child('HealthScore').val() != null)) {
                setTimeout(function() {
                    qSelectionBox.value = previousQuarter;
                }, 300);
                // console.log(previousQuarter);
                getCompanyDescriptionData();
                PREVgetHealthScoreData(previousQuarter);
                PREVgetAccountingData(previousQuarter);
                PREVgetDataYouWant(previousQuarter);


                // Sector Data Section:
                firebase.database().ref('sector-data/' + companySelectionKey + "/" + previousQuarter).on('value', function(snap) {
                    document.getElementById('sectorItem0Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item0').val() + "</td><td>$" + numberWithCommas(snap.child('/item0Amt').val()) + "</td>";
                    document.getElementById('sectorItem1Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item1').val() + "</td><td>$" + numberWithCommas(snap.child('/item1Amt').val()) + "</td>";
                    document.getElementById('sectorItem2Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item2').val() + "</td><td>$" + numberWithCommas(snap.child('/item2Amt').val()) + "</td>";
                    document.getElementById('sectorItem3Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item3').val() + "</td><td>$" + numberWithCommas(snap.child('/item3Amt').val()) + "</td>";
                    document.getElementById('sectorItem4Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item4').val() + "</td><td>$" + numberWithCommas(snap.child('/item4Amt').val()) + "</td>";

                });
            } else {
                setTimeout(function() {
                    qSelectionBox.value = qSelectionBox.options[1].value;
                }, 300);
                getCompanyDescriptionData();
                PREVgetHealthScoreData(qSelectionBox.options[1].value);
                PREVgetAccountingData(qSelectionBox.options[1].value);
                PREVgetDataYouWant(qSelectionBox.options[1].value);


                // Sector Data Section:
                firebase.database().ref('sector-data/' + companySelectionKey + "/" + qSelectionBox.options[1].value).on('value', function(snap) {
                    document.getElementById('sectorItem0Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item0').val() + "</td><td>$" + numberWithCommas(snap.child('/item0Amt').val()) + "</td>";
                    document.getElementById('sectorItem1Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item1').val() + "</td><td>$" + numberWithCommas(snap.child('/item1Amt').val()) + "</td>";
                    document.getElementById('sectorItem2Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item2').val() + "</td><td>$" + numberWithCommas(snap.child('/item2Amt').val()) + "</td>";
                    document.getElementById('sectorItem3Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item3').val() + "</td><td>$" + numberWithCommas(snap.child('/item3Amt').val()) + "</td>";
                    document.getElementById('sectorItem4Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item4').val() + "</td><td>$" + numberWithCommas(snap.child('/item4Amt').val()) + "</td>";
                });
            }
        });
    });

    // console.log(currentQuarter);



}

function getHealthScoreData() {
    var all = [],
        A = [],
        B = [],
        ratioWebChartArray = [],
        wdx = $("#ratioWebChart"),
        ctx = $("#healthScoreBarChart");


    // Health Score Bar Chart:
    firebase.database().ref('health-score-data/' + companySelectionKey).once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            all.push({ 'A': childSnapshot.key, 'B': childSnapshot.child('/HealthScore').val() });
        });
        all.sort(function(date1, date2) {
            var qd1 = moment(date1.A, 'Q-YYYY');
            var qd2 = moment(date2.A, 'Q-YYYY');
            return qd1.diff(qd2);
        });
        var length = all.length,
            j;
        for (j = 0; j < length; j++) {
            A.push(all[j].A);
            B.push(Number(all[j].B).toFixed(3));
        }
    }).then(function() {
        var length = all.length;
        // Health Score Bar Chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: A,
                datasets: [{
                    label: 'Health Scores',
                    data: B,
                    backgroundColor: poolColors(length + 1),
                    borderColor: poolColors(length + 1),
                    borderWidth: 1,

                }]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            min: 0,
                            max: 10,
                        }
                    }]
                }
            }
        });
    }).catch(function(error) {
        // alert("Error Message: " + error.message);
        console.log("Remove failed: " + error.message);
    });
    // This is the Health Score Section:
    firebase.database().ref('health-score-data/' + companySelectionKey + "/" + currentQuarter).on('value', function(snap) {

        if (Number(snap.child('/HealthScore').val()) == (0 || 0.0)) {
            document.getElementById('isThereDataLabel').innerHTML = "No Current Data for Q" + moment().format("Q-YY") + ". Use the 'Choose Date' dropdown to select Previous Quarter Data.";
            // $.prompt("No Current Data for Q"+justTheQ+". Press the 'Previous Quarter' button to view financial data from the previous quarter.");
        } else {
            // console.log(Number(snap.child('/HealthScore').val())); 
        }
        currCompCash = snap.child('/cashAndCashEq').val();

        document.getElementById('currentHlthScoreLabel').innerHTML = "Health Score: <strong id='currentHlthScoreLabelNumber'>" + Number(snap.child('/HealthScore').val()).toFixed(2) + "</strong>";

        document.getElementById('cashAndEqRow').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
        document.getElementById('longtermdebtRow').innerHTML = "$" + numberWithCommas(snap.child('/LongTermDebt').val());
        document.getElementById('netAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/currQnetAssets').val());
        document.getElementById('prevQnetAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/prevQnetAssets').val());
        document.getElementById('cogsRow').innerHTML = "$" + numberWithCommas(snap.child('/costOGS').val());
        document.getElementById('sellingAndadminRow').innerHTML = "$" + numberWithCommas(snap.child('/sellingAndAdmin').val());
        document.getElementById('depAndamortRow').innerHTML = "$" + numberWithCommas(snap.child('/depAndAmort').val());
        document.getElementById('interestExpRow').innerHTML = "$" + numberWithCommas(snap.child('/interestExp').val());
        document.getElementById('otherNonOpRow').innerHTML = "$" + numberWithCommas(snap.child('/otherNonOp').val());
        document.getElementById('incomeTaxExpRow').innerHTML = "$" + numberWithCommas(snap.child('/incomeTaxExp').val());
        document.getElementById('netIncomeRow').innerHTML = "$" + numberWithCommas(snap.child('/netIncome').val());
        document.getElementById('netSalesRow').innerHTML = "$" + numberWithCommas(snap.child('/netSales').val());

        document.getElementById('cashAndEqRow2').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
        document.getElementById('longtermdebtRow2').innerHTML = "$" + numberWithCommas(snap.child('/LongTermDebt').val());
        document.getElementById('netAssetsRow2').innerHTML = "$" + numberWithCommas(snap.child('/currQnetAssets').val());
        document.getElementById('prevQnetAssetsRow2').innerHTML = "$" + numberWithCommas(snap.child('/prevQnetAssets').val());
        document.getElementById('cogsRow2').innerHTML = "$" + numberWithCommas(snap.child('/costOGS').val());
        document.getElementById('sellingAndadminRow2').innerHTML = "$" + numberWithCommas(snap.child('/sellingAndAdmin').val());
        document.getElementById('depAndamortRow2').innerHTML = "$" + numberWithCommas(snap.child('/depAndAmort').val());
        document.getElementById('interestExpRow2').innerHTML = "$" + numberWithCommas(snap.child('/interestExp').val());
        document.getElementById('otherNonOpRow2').innerHTML = "$" + numberWithCommas(snap.child('/otherNonOp').val());
        document.getElementById('incomeTaxExpRow2').innerHTML = "$" + numberWithCommas(snap.child('/incomeTaxExp').val());
        document.getElementById('netSalesRow2').innerHTML = "$" + numberWithCommas(snap.child('/netSales').val());

        // Add current quiarter specificity on the children
        document.getElementById('ENA0row').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
        document.getElementById('totalExpRow').innerHTML = "$" + numberWithCommas(snap.child('/TotalExpenses').val());
        document.getElementById('ENA1row').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
        document.getElementById('ltdRow').innerHTML = "$" + numberWithCommas(snap.child('/LongTermDebt').val());
        document.getElementById('deltaNetAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/deltaNetAssets').val());
        document.getElementById('bnaRow').innerHTML = "$" + numberWithCommas(snap.child('/currQnetAssets').val());
        document.getElementById('opSorDrow').innerHTML = "$" + numberWithCommas(snap.child('/netIncome').val());
        document.getElementById('opRevRow').innerHTML = "$" + numberWithCommas(snap.child('/netSales').val());

        document.getElementById('netInRow').innerHTML = "$" + numberWithCommas(snap.child('/netIncome').val());
        document.getElementById('avlCashRow').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());


        document.getElementById('prRatioRow').innerHTML = "<strong>" + Number(snap.child('/primaryReserveRatio').val()).toFixed(2) + "</strong>";
        document.getElementById('vrRatioRow').innerHTML = "<strong>" + Number(snap.child('/viabilityRatio').val()).toFixed(2) + "</strong>";
        document.getElementById('ronaRatioRow').innerHTML = "<strong>" + Number(snap.child('/returnOnNetAssetsRatio').val()).toFixed(2) + "</strong>";
        document.getElementById('oprevRatioRow').innerHTML = "<strong>" + Number(snap.child('/netOperatingRevenuesRatio').val()).toFixed(2) + "</strong>";


        // Tells you what the Health Score means...
        if (Number(snap.child('/HealthScore').val()).toFixed(2) >= 9) {
            document.getElementById('currentHlthScoreLabelNumber').style.color = "#03b218";
            document.getElementById('hsMeaningLabel').innerHTML = "Strong market position. Strong financial position. Consider expansion and/or acquisitions.";
        } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 9) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 7)) {
            // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
            document.getElementById('hsMeaningLabel').innerHTML = "Strong financial/market position. Allow experimentation with new initiatives.";
        } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 7) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 5)) {
            // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
            document.getElementById('hsMeaningLabel').innerHTML = "Moderate financial/market position. Focus resources to compete in future state.";
        } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 5) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 3)) {
            // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
            document.getElementById('hsMeaningLabel').innerHTML = "Moderate financial/market position. Direct Company resources to allow growth and expansion.";
        } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 3) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 1)) {
            // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
            document.getElementById('hsMeaningLabel').innerHTML = "Weak financial/market position. Assess viability, consider restructuring.";
        } else {
            // document.getElementById('currentHlthScoreLabelNumber').style.color = "#ff4242";
            document.getElementById('hsMeaningLabel').innerHTML = "Weak financial/market position. Assess viability of survival short term.";
        }




    });
    firebase.database().ref('health-score-data/' + companySelectionKey + "/" + currentQuarter).once('value', function(snap) {
        var prr = Number(snap.child('/primaryReserveRatio').val()).toFixed(2),
            vr = Number(snap.child('/viabilityRatio').val()).toFixed(2),
            ronar = Number(snap.child('/returnOnNetAssetsRatio').val()).toFixed(2),
            orr = Number(snap.child('/netOperatingRevenuesRatio').val()).toFixed(2);

        ratioWebChartArray.push(prr, vr, ronar, orr);
    }).then(function() {
        // Ratio Web Chart
        var ratioWebData = {
            datasets: [{
                data: ratioWebChartArray,
                backgroundColor: poolColors(1),
                label: 'Core Ratios',
                pointStyle: "circle",
                pointRadius: 3,
                pointBorderWidth: 1,
                pointBackgroundColor: 'black',
            }],
            labels: [
                "Primary Reserve",
                "Viability",
                "Return Net Assets",
                "Net Op Rev"
            ],
        };
        new Chart(wdx, {
            data: ratioWebData,
            type: "radar",
            options: {

                responsive: true,
                // animation: {
                //     easing: "easeInExpo",
                // },
                scale: {
                    pointLabels: {
                        fontSize: 13,
                    },
                },
                elements: {
                    arc: {
                        borderColor: "black",

                    }
                }
            }
        });
    });


    // hsChart.render();
}

function getAccountingData() {
    var fadPolarAreaDataArray = [],
        ardx = document.getElementById('assetsRadarChart').getContext("2d");





    // Accounting Data Section:
    firebase.database().ref('formal-accounting-data/' + companySelectionKey + "/" + currentQuarter).on('value', function(snap) {
        document.getElementById('totalAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/totalAssets').val());
        document.getElementById('totalLibRow').innerHTML = "$" + numberWithCommas(snap.child('/totalLiabilities').val());
        document.getElementById('totalEqRow').innerHTML = "$" + numberWithCommas(snap.child('/totalEquity').val());
        document.getElementById('grossOpProfitRow').innerHTML = "$" + numberWithCommas(snap.child('/grossOpProfit').val());
        document.getElementById('EBITDARow').innerHTML = "$" + numberWithCommas(snap.child('/EBITDA').val());
        document.getElementById('OpIncomeRow').innerHTML = "$" + numberWithCommas(snap.child('/EBIT').val());
        document.getElementById('EBITRow').innerHTML = "$" + numberWithCommas(snap.child('/EBIT').val());

        // document.getElementById('netInRow').innerHTML = "Net Income$" + numberWithCommas(snap.child('/netIncome').val());
        document.getElementById('opActRow').innerHTML = "$" + numberWithCommas(snap.child('/opActivites').val());
        document.getElementById('invActRow').innerHTML = "$" + numberWithCommas(snap.child('/investActivites').val());
        document.getElementById('finActRow').innerHTML = "$" + numberWithCommas(snap.child('/financeActivites').val());
        document.getElementById('netInDeRow').innerHTML = "$" + numberWithCommas(snap.child('/netInDeInCash').val());

        // document.getElementById('avlCashRow').innerHTML = "Cash$" + numberWithCommas(snap.child('/cash').val());
        document.getElementById('avlInvRow').innerHTML = "$" + numberWithCommas(snap.child('/inventory').val());
        document.getElementById('avlPropRow').innerHTML = "$" + numberWithCommas(snap.child('/property').val());
        document.getElementById('avlOtherAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/otherAssets').val());

        document.getElementById('avlAccntsPayRow').innerHTML = "$" + numberWithCommas(snap.child('/acctsPayable').val());
        document.getElementById('avlInterestPayRow').innerHTML = "$" + numberWithCommas(snap.child('/interestPayable').val());
        document.getElementById('avlTaxesPayRow').innerHTML = "$" + numberWithCommas(snap.child('/taxesPayable').val());
        document.getElementById('avlotherPayRow').innerHTML = "$" + numberWithCommas(snap.child('/otherPayable').val());
        document.getElementById('acntsRecRow').innerHTML = "$" + numberWithCommas(snap.child('/accntsReceivable').val());





        document.getElementById('avlInvRow2').innerHTML = "$" + numberWithCommas(snap.child('/inventory').val());
        document.getElementById('avlPropRow2').innerHTML = "$" + numberWithCommas(snap.child('/property').val());
        document.getElementById('avlOtherAssetsRow2').innerHTML = "$" + numberWithCommas(snap.child('/otherAssets').val());

        document.getElementById('avlAccntsPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/acctsPayable').val());
        document.getElementById('avlInterestPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/interestPayable').val());
        document.getElementById('avlTaxesPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/taxesPayable').val());
        document.getElementById('avlotherPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/otherPayable').val());

        // Financial Ratios Display
        document.getElementById('currRatioRow').innerHTML = Number(snap.child('/currentRatio').val()).toFixed(3);
        document.getElementById('quickRatioRow').innerHTML = Number(snap.child('/quickRatio').val()).toFixed(3);
        document.getElementById('intCoverRatioRow').innerHTML = Number(snap.child('/interestCoverageRatio').val()).toFixed(3);
        document.getElementById('timesEarnedIntRatioRow').innerHTML = Number(snap.child('/timesEarnedRatio').val()).toFixed(3);

        document.getElementById('debtEqRatioRow').innerHTML = Number(snap.child('/debtVsEquityRatio').val()).toFixed(3);
        document.getElementById('eqMultiRatioRow').innerHTML = Number(snap.child('/equityMultiplier').val()).toFixed(3);
        document.getElementById('grossProfitMarginRow').innerHTML = Number(snap.child('/grossProfitMargin').val()).toFixed(3);
        document.getElementById('opProfitMarginRow').innerHTML = Number(snap.child('/operatingProfitMargin').val()).toFixed(3);
        document.getElementById('netProfitMarginRow').innerHTML = Number(snap.child('/netProfitMargin').val()).toFixed(3);
        document.getElementById('returnOnAssetsRow').innerHTML = Number(snap.child('/returnOnAssetsRatio').val()).toFixed(3);
        document.getElementById('returnOnEquityRow').innerHTML = Number(snap.child('/returnOnEquityRatio').val()).toFixed(3);

        document.getElementById('dsiDisplayRow').innerHTML = Number(snap.child('/dsi').val()).toFixed(3);
        document.getElementById('dsoDisplayRow').innerHTML = Number(snap.child('/dso').val()).toFixed(3);
        document.getElementById('dpoDisplayRow').innerHTML = Number(snap.child('/dpo').val()).toFixed(3);
        document.getElementById('cashCycleDisplayRow').innerHTML = Number(snap.child('/cashCycle').val()).toFixed(3);
        document.getElementById('invTurnoverRow').innerHTML = Number(snap.child('/inventoryTO').val()).toFixed(3);
        document.getElementById('recTurnoverRow').innerHTML = Number(snap.child('/receivablesTO').val()).toFixed(3);
        document.getElementById('payTurnoverRow').innerHTML = Number(snap.child('/payablesTO').val()).toFixed(3);
        document.getElementById('totalTurnoverRow').innerHTML = Number(snap.child('/totalAssetsTO').val()).toFixed(3);



        // var ardx = document.getElementById("assetsRadarChart");
    });

    firebase.database().ref('formal-accounting-data/' + companySelectionKey + "/" + currentQuarter).once('value', function(snap) {
        var cash = currCompCash,
            inven = snap.child('/inventory').val(),
            prop = snap.child('/property').val(),
            otherA = snap.child('/otherAssets').val(),
            actsPay = snap.child('/acctsPayable').val(),
            intPay = snap.child('/interestPayable').val(),
            taxPay = snap.child('/taxesPayable').val(),
            otherL = snap.child('/otherPayable').val();

        fadPolarAreaDataArray.push(cash, inven, prop, otherA, actsPay, intPay, taxPay, otherL);
    }).then(function() {
        var fadRatioData = {
            datasets: [{
                data: fadPolarAreaDataArray,
                backgroundColor: poolColors(8),
                label: 'My dataset' // for legend
            }],
            labels: [
                "Cash",
                "Inventory",
                "Property",
                "Other Assets",
                "Accounts Payable",
                "Interest Payable",
                "Taxes Payable",
                "Other Payable"
            ]
        };
        var aradarChart = new Chart(ardx, {
            data: fadRatioData,
            type: "polarArea",
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderColor: "white"
                    }
                }
            }
        });
    });

    // Accounting Data Polar Chart
}

function getDataYouWant() {
    var dywAcqArray = [],
        dywBusDevArray = [],
        pdx = document.getElementById('pieChart'),
        ddx = document.getElementById('dnChart');


    // Data You Want Section:
    firebase.database().ref('data-you-want/' + companySelectionKey + "/" + currentQuarter).on('value', function(snap) {
        document.getElementById('revChannelRow').innerHTML = "<td>" + snap.child('/revChannelMain').val() + "</td><td>$" + numberWithCommas(snap.child('/revChannelMainAmt').val()) + "</td><td>Reveue</td>";
        document.getElementById('dynamicCostRow').innerHTML = "<td>" + snap.child('/dynamicCostMain').val() + "</td><td>$" + numberWithCommas(snap.child('/dynamicCostMainAmt').val()) + "</td><td>Dynamic Cost</td>";
        document.getElementById('fixedCostRow').innerHTML = "<td>" + snap.child('/fixedCostMain').val() + "</td><td>$" + numberWithCommas(snap.child('/fixedCostMainAmt').val()) + "</td><td>Fixed Cost</td>";

        document.getElementById('dywChartReadOut1').innerHTML = "<h5 style='color: black;'>Acquisition Reveue: $" + numberWithCommas(snap.child('/acquisitionRevAvg').val()) + "</h5><h5 style='color: black;'>Acquisition Cost: $" + numberWithCommas(snap.child('/acquisitionCostAvg').val()) + "</h5>";
        document.getElementById('dywChartReadOut2').innerHTML = "<h5 style='color: black;'> Business Development Expense: $" + numberWithCommas(snap.child('/businessDevExpenditure').val()) + "</h5><h5 style='color: black;'>Travel and Entertainment: $" + numberWithCommas(snap.child('/travelAndEntertainment').val()) + "</h5>";



    });

    firebase.database().ref('data-you-want/' + companySelectionKey + "/" + currentQuarter).once('value', function(snap) {
        var acqR = snap.child('/acquisitionRevAvg').val(),
            acqC = snap.child('/acquisitionCostAvg').val(),
            busDev = snap.child('/businessDevExpenditure').val(),
            tEE = snap.child('/travelAndEntertainment').val();
        dywAcqArray.push(acqR, acqC);
        dywBusDevArray.push(busDev, tEE);
    }).then(function() {
        var dywData1 = {
            labels: [
                "Acquisition Revenue",
                "Acquisition Cost"
            ],
            datasets: [{
                data: dywAcqArray,
                backgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ],
                hoverBackgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ]
            }]
        };
        var dywData2 = {
            labels: [
                "Business Development Cost",
                "Travel and Entertainment",
            ],
            datasets: [{
                data: dywBusDevArray,
                backgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ],
                hoverBackgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ]
            }]
        };

        var myPieChart = new Chart(pdx, {
            type: 'doughnut',
            data: dywData1,
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderColor: "white"
                    }
                }
            }
        });
        // Now for the Business Dev Stuff 
        var myDoughnutChart = new Chart(ddx, {
            type: 'pie',
            data: dywData2,
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderColor: "white"
                    }
                }
            }
        });
    });
}

function getCompanyDescriptionData() {

    /**
     * CHEKCS TO SEE IF YOU ARE THE COMPANY ADMINISTRATOR
     */
    firebase.database().ref('company-description-data/' + companySelectionKey).on('value', function(snap) {
        selectedCompanyName = snap.child('/name').val();
        document.getElementById('compNameLabelHeader').innerHTML = snap.child('/name').val();
        document.getElementById('compDescripCardNameLabel').innerHTML = "<strong>" + snap.child('/name').val() + "</strong>";
        document.getElementById('mainSectorLabel').innerHTML = "Main Sector: " + snap.child('/mainSector').val();
        document.getElementById('subSectorLabel').innerHTML = "Sub Sector: " + snap.child('/subSector').val();
        document.getElementById('hqLabel').innerHTML = snap.child('/hq').val();
        document.getElementById('companyDescriptionLabel').innerHTML = snap.child('/description').val();

        document.getElementById('companyNameLabel').innerHTML = "<h3><strong>" + snap.child('/name').val() + "</strong></h3>";
        document.getElementById('deleteCompanyButton').innerHTML = "<i style='vertical-align: middle;' class='material-icons'>delete_sweep</i> Delete <strong>" + snap.child('/name').val() + "</strong> from Database";
        document.getElementById('duplicateCompanyButton').innerHTML = "<i style='vertical-align: middle;' class='material-icons'>content_copy</i> Duplicate Data From <strong>" + snap.child('/name').val() + "</strong>";
        document.getElementById('removeFromWatchListButton').innerHTML = "<i style='vertical-align: middle;'' class='material-icons'>format_indent_decrease</i> Remove <strong>" + snap.child('/name').val() + "</strong> from WatchList";
        $("#compSectorLabel").html("Main Sector: " + snap.child('/mainSector').val() + " <br> Sub Sector: " + snap.child('/subSector').val());
        document.getElementById('duplicateCompanyMenuItem').innerHTML = "<i style='vertical-align: middle;' class='material-icons'>content_copy</i> Duplicate <strong>" + snap.child('/name').val() + "</strong>";
        document.getElementById('addPastDataButtonACP').innerHTML = "<i style='vertical-align: middle;' class='material-icons'>note_add</i> Add Past Data for <strong>" + snap.child('/name').val() + "</strong>";
        document.getElementById('removePastDataButtonACP').innerHTML = "<i style='vertical-align: middle;' class='material-icons'>cancel</i> Remove Past Data for <strong>" + snap.child('/name').val() + "</strong>";
        document.getElementById('qbIntegrateButton').innerHTML = '<i class="material-icons" style=" vertical-align: middle;">link</i> Integrate <strong>QuickBooks</strong> with <strong>'+snap.child('/name').val()+'</strong>';

        // $("#compNameLabelHeader").html(snap.child('/name').val());
        // $("#compDescripCardNameLabel").html("<strong>" + snap.child('/name').val() + "</strong>");
        // $("#mainSectorLabel").html("<h5>" + snap.child('/mainSector').val() + "  ---</h5>");
        // $("#subSectorLabel").html("<h5>--   " + snap.child('/subSector').val() + "</h5>");
        // $("#hqLabel").html(snap.child('/hq').val());
        // $("#companyDescriptionLabel").html(snap.child('/description').val());
        // $("#companyKeyLabel").html("<strong>Company Key: </strong> " + companySelectionKey);
        // $("#companyNameLabel").html("<h3><strong>" + snap.child('/name').val() + "</strong></h3>");

        $("#deleteCompanyMenuItem").html("<i style='vertical-align: middle;' class='material-icons'>delete_sweep</i> Delete <strong>" + snap.child('/name').val() + "</strong> from Database");
        // $("#removeFromWatchListButton").html("<strong>(-)</strong> Remove <strong>" + snap.child('/name').val() + "</strong> from WatchList");

        /**
         * CHEKCS TO SEE IF YOU ARE THE COMPANY ADMINISTRATOR
         */
        // console.log(snap.child('/admin').val());

        if (currentUserID == snap.child('/admin').val()) {
            $("#allDataInputsCard").show();
            $('#duplicateCompanyMenuItem').show();
            $("#deleteCompanyMenuItem").show();
            document.getElementById('hlthScoreRatioEditButton').style.display = 'block';
            document.getElementById('dywChanEditButton').style.display = 'block';
            document.getElementById('dywChartEditButton').style.display = 'block';
            document.getElementById('aVlChartEditButton').style.display = 'block';
            // document.getElementById('fadMainEditButton').style.display = 'block';
            document.getElementById('sectorDataEditButton').style.display = 'block';
            document.getElementById('compDesEditButton').style.display = 'block';
            document.getElementById('blankCompanyButton').style.display = 'block';
            // document.getElementById('pastHSdataPointButton').style.display = 'block';
            // document.getElementById('tutorialButton').style.display = 'none';
            document.getElementById('ALLcomponentsEditButton').style.display = 'block';
            document.getElementById('removeFromWatchListButton').style.display = 'block';
            // document.getElementById('removePastHSdataButton').style.display = 'block';
            document.getElementById('deleteCompanyButton').style.display = 'block';
            document.getElementById('hlthScoreRatioEditButton2').style.display = 'block';
            // document.getElementById('fadRatiosEditButton').style.display = 'block';
            document.getElementById('aVlDisplayEditButton').style.display = 'block';
            // document.getElementById('fadBalanceEditButton').style.display = 'block';
            // document.getElementById('fadIncomeEditButton').style.display = 'block';
            // document.getElementById('fadCashFlowEditButton').style.display = 'block';
            $("#modeToggleButton").show();
            $("#fadBalanceEditButton").show();
            $("#fadIncomeEditButton").show();
            $("#fadCashFlowEditButton").show();
            getLinkedUsers(true);
            document.getElementById('companyKeyLabel').innerHTML = "<label id='keykey'>" + companySelectionKey + '  </label><br> <button class="copyButton mdl-button mdl-js-button mdl-js-ripple-effect" id="copyButtonId" data-id="@item.Type" data-clipboard-action="copy" data-clipboard-target="#keykey">Copy Key</button>';
        } else {
            $("#allDataInputsCard").hide();
            $('#duplicateCompanyMenuItem').hide();
            $("#deleteCompanyMenuItem").hide();
            document.getElementById('modeToggleButton').style.display = 'none';
            document.getElementById('hlthScoreRatioEditButton').style.display = 'none';
            document.getElementById('dywChanEditButton').style.display = 'none';
            document.getElementById('dywChartEditButton').style.display = 'none';
            document.getElementById('aVlChartEditButton').style.display = 'none';
            // document.getElementById('fadMainEditButton').style.display = 'none';
            document.getElementById('sectorDataEditButton').style.display = 'none';
            document.getElementById('compDesEditButton').style.display = 'none';
            // document.getElementById('tutorialButton').style.display = 'none';
            // document.getElementById('pastHSdataPointButton').style.display = 'none';
            document.getElementById('removeFromWatchListButton').style.display = 'block';
            // document.getElementById('removePastHSdataButton').style.display = 'none';
            document.getElementById('deleteCompanyButton').style.display = 'none';
            document.getElementById('hlthScoreRatioEditButton2').style.display = 'none';
            document.getElementById('ALLcomponentsEditButton').style.display = 'none';
            // document.getElementById('fadRatiosEditButton').style.display = 'none';
            document.getElementById('aVlDisplayEditButton').style.display = 'none';
            document.getElementById('fadBalanceEditButton').style.display = 'none';
            document.getElementById('fadIncomeEditButton').style.display = 'none';
            document.getElementById('fadCashFlowEditButton').style.display = 'none';
        }

        /**
         * CHEKCS TO SEE IF YOU ARE THE COMPANY ADMINISTRATOR
         */
    });
    firebase.storage().ref('/company-description-data/' + companySelectionKey + '/logo').getDownloadURL().then(function(url) {
        var test = url;
        //add this line here:
        document.getElementById('logoDisplayImg').src = test;
    }).catch(function(error) {
        document.getElementById('logoDisplayImg').src = 'img/noImage.png';
    });
}

/**
 *[END] DISPLAY COMPANY WHEN CLICKED [END]
 */

// SHOW FINANCIAL RATIO DATA ONCLICK
function getFinRatioChartData(event) {
    // $("#finRatioChartArea").html('<canvas id="finRatioLineChart" height="25%" width="100%" stlye="display: block;"></canvas>');
    document.getElementById('finRatioChartArea').innerHTML = '<canvas id="finRatioLineChart" height="25%" width="100%"></canvas>';
    var finRatioElement = document.getElementById(event.id),
        all = [],
        A = [],
        B = [],
        fdx = document.getElementById('finRatioLineChart'),
        finRatioValue = $(finRatioElement).attr("value");


    // Grab and sort financial ratio data
    firebase.database().ref('formal-accounting-data/' + companySelectionKey).once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            all.push({ 'A': childSnapshot.key, 'B': childSnapshot.child('/' + finRatioValue).val() });
        });
        all.sort(function(date1, date2) {
            var qd1 = moment(date1.A, 'Q-YYYY');
            var qd2 = moment(date2.A, 'Q-YYYY');
            return qd1.diff(qd2);
        });
        var length = all.length,
            j;
        for (j = 0; j < length; j++) {
            A.push(all[j].A);
            B.push(all[j].B);
        }

        new Chart(fdx, {
            type: 'line',
            data: {
                labels: A,
                datasets: [{
                    label: $(finRatioElement).text(),
                    data: B,
                    backgroundColor: poolColors(length + 1),
                    borderColor: poolColors(length + 1),
                    borderWidth: 2,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'blue',



                    pointHitRadius: 10,
                    spanGaps: false,

                }]
            },
            options: {
                responsive: true,

            }
        });
    });
}




/**
 * PREVIOUS QUARTER DATA [START]
 */
function previousQuarterData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value;

    // setSelectedIndex(document.getElementById('dateSeclector'), selectedQuarter);


    document.getElementById('finRatioChartArea').innerHTML = '<h3 style="color: black;">Select Financial Ratio Below</h3><h5>Display trend data for all Data Points(Line Graph)</h5>';
    document.getElementById('hsChartArea').innerHTML = '<canvas id="healthScoreBarChart" height="30%" width="100%"></canvas>';
    document.getElementById('ratioWebArea').innerHTML = '<canvas id="ratioWebChart" height="75%" width="100%"></canvas>';
    document.getElementById('assetsRadar').innerHTML = '<canvas id="assetsRadarChart" height="320px" width="320px"></canvas>';
    document.getElementById('pieDiv').innerHTML = '<canvas id="pieChart" style="width: 100%; height: 320px;"></canvas>';
    document.getElementById('doughDiv').innerHTML = '<canvas id="dnChart" style="width: 100%; height: 320px;"></canvas>';

    // document.getElementById('dataDisplayDateLabel').innerHTML = '<small>Displaying Data for</small> Q' + selectedQuarter;
    // $.prompt("Now viewing financial data for " + previousQuarter + ". Reselect company to view current data.");
    document.getElementById('isThereDataLabel').innerHTML = "";

    PREVgetAccountingData(selectedQuarter);
    PREVgetDataYouWant(selectedQuarter);
    PREVgetHealthScoreData(selectedQuarter);






    // Sector Data Section:
    firebase.database().ref('sector-data/' + companySelectionKey + "/" + selectedQuarter).on('value', function(snap) {
        document.getElementById('sectorItem0Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item0').val() + "</td><td>$" + numberWithCommas(snap.child('/item0Amt').val()) + "</td>";
        document.getElementById('sectorItem1Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item1').val() + "</td><td>$" + numberWithCommas(snap.child('/item1Amt').val()) + "</td>";
        document.getElementById('sectorItem2Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item2').val() + "</td><td>$" + numberWithCommas(snap.child('/item2Amt').val()) + "</td>";
        document.getElementById('sectorItem3Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item3').val() + "</td><td>$" + numberWithCommas(snap.child('/item3Amt').val()) + "</td>";
        document.getElementById('sectorItem4Row').innerHTML = "<td class='mdl-data-table__cell--non-numeric'>" + snap.child('/item4').val() + "</td><td>$" + numberWithCommas(snap.child('/item4Amt').val()) + "</td>";
    });

}

function PREVgetHealthScoreData(q) {
    var wdx = document.getElementById('ratioWebChart'),
        ratioWebChartArray = [],
        selectedQuarter = q,
        fadPolarAreaDataArray = [],
        ardx = document.getElementById('assetsRadarChart').getContext("2d");
    var all = [],
        A = [],
        B = [],
        ratioWebChartArray = [],
        wdx = $("#ratioWebChart"),
        ctx = $("#healthScoreBarChart");
    document.getElementById('dataDisplayDateLabel').innerHTML = '<small>Displaying Data for</small> Q' + selectedQuarter;


    // Health Score Bar Chart:
    firebase.database().ref('health-score-data/' + companySelectionKey).once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            all.push({ 'A': childSnapshot.key, 'B': childSnapshot.child('/HealthScore').val() });
        });
        all.sort(function(date1, date2) {
            var qd1 = moment(date1.A, 'Q-YYYY');
            var qd2 = moment(date2.A, 'Q-YYYY');
            return qd1.diff(qd2);
        });
        var length = all.length,
            j;
        for (j = 0; j < length; j++) {
            A.push(all[j].A);
            B.push(all[j].B);
        }
    }).then(function() {
        // Health Score Bar Chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: A,
                datasets: [{
                    label: 'Health Scores',
                    data: B,
                    backgroundColor: poolColors(all.length + 1),
                    borderColor: poolColors(all.length + 1),
                    borderWidth: 1,

                }]
            },
            options: {
                responsive: true,

                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            min: 0,
                            max: 10,
                        }
                    }]
                }
            }
        });
    });
    $(document).ready(function() {
        // This is the Health Score Section:
        firebase.database().ref('health-score-data/' + companySelectionKey + "/" + selectedQuarter).on('value', function(snap) {

            currCompCash = snap.child('/cashAndCashEq').val();

            document.getElementById('currentHlthScoreLabel').innerHTML = "Health Score: <strong id='currentHlthScoreLabelNumber'>" + Number(snap.child('/HealthScore').val()).toFixed(2) + "</strong>";


            document.getElementById('cashAndEqRow').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
            document.getElementById('longtermdebtRow').innerHTML = "$" + numberWithCommas(snap.child('/LongTermDebt').val());
            document.getElementById('netAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/currQnetAssets').val());
            document.getElementById('prevQnetAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/prevQnetAssets').val());
            document.getElementById('cogsRow').innerHTML = "$" + numberWithCommas(snap.child('/costOGS').val());
            document.getElementById('sellingAndadminRow').innerHTML = "$" + numberWithCommas(snap.child('/sellingAndAdmin').val());
            document.getElementById('depAndamortRow').innerHTML = "$" + numberWithCommas(snap.child('/depAndAmort').val());
            document.getElementById('interestExpRow').innerHTML = "$" + numberWithCommas(snap.child('/interestExp').val());
            document.getElementById('otherNonOpRow').innerHTML = "$" + numberWithCommas(snap.child('/otherNonOp').val());
            document.getElementById('incomeTaxExpRow').innerHTML = "$" + numberWithCommas(snap.child('/incomeTaxExp').val());
            document.getElementById('netIncomeRow').innerHTML = "$" + numberWithCommas(snap.child('/netIncome').val());
            document.getElementById('netSalesRow').innerHTML = "$" + numberWithCommas(snap.child('/netSales').val());

            document.getElementById('cashAndEqRow2').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
            document.getElementById('longtermdebtRow2').innerHTML = "$" + numberWithCommas(snap.child('/LongTermDebt').val());
            document.getElementById('netAssetsRow2').innerHTML = "$" + numberWithCommas(snap.child('/currQnetAssets').val());
            document.getElementById('prevQnetAssetsRow2').innerHTML = "$" + numberWithCommas(snap.child('/prevQnetAssets').val());
            document.getElementById('cogsRow2').innerHTML = "$" + numberWithCommas(snap.child('/costOGS').val());
            document.getElementById('sellingAndadminRow2').innerHTML = "$" + numberWithCommas(snap.child('/sellingAndAdmin').val());
            document.getElementById('depAndamortRow2').innerHTML = "$" + numberWithCommas(snap.child('/depAndAmort').val());
            document.getElementById('interestExpRow2').innerHTML = "$" + numberWithCommas(snap.child('/interestExp').val());
            document.getElementById('otherNonOpRow2').innerHTML = "$" + numberWithCommas(snap.child('/otherNonOp').val());
            document.getElementById('incomeTaxExpRow2').innerHTML = "$" + numberWithCommas(snap.child('/incomeTaxExp').val());
            document.getElementById('netSalesRow2').innerHTML = "$" + numberWithCommas(snap.child('/netSales').val());

            // Add current quiarter specificity on the children
            document.getElementById('ENA0row').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
            document.getElementById('totalExpRow').innerHTML = "$" + numberWithCommas(snap.child('/TotalExpenses').val());
            document.getElementById('ENA1row').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());
            document.getElementById('ltdRow').innerHTML = "$" + numberWithCommas(snap.child('/LongTermDebt').val());
            document.getElementById('deltaNetAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/deltaNetAssets').val());
            document.getElementById('bnaRow').innerHTML = "$" + numberWithCommas(snap.child('/currQnetAssets').val());
            document.getElementById('opSorDrow').innerHTML = "$" + numberWithCommas(snap.child('/netIncome').val());
            document.getElementById('opRevRow').innerHTML = "$" + numberWithCommas(snap.child('/netSales').val());

            document.getElementById('netInRow').innerHTML = "$" + numberWithCommas(snap.child('/netIncome').val());
            document.getElementById('avlCashRow').innerHTML = "$" + numberWithCommas(snap.child('/cashAndCashEq').val());


            document.getElementById('prRatioRow').innerHTML = "<strong>" + Number(snap.child('/primaryReserveRatio').val()).toFixed(2) + "</strong>";
            document.getElementById('vrRatioRow').innerHTML = "<strong>" + Number(snap.child('/viabilityRatio').val()).toFixed(2) + "</strong>";
            document.getElementById('ronaRatioRow').innerHTML = "<strong>" + Number(snap.child('/returnOnNetAssetsRatio').val()).toFixed(2) + "</strong>";
            document.getElementById('oprevRatioRow').innerHTML = "<strong>" + Number(snap.child('/netOperatingRevenuesRatio').val()).toFixed(2) + "</strong>";


            // Tells you what the Health Score means...
            if (Number(snap.child('/HealthScore').val()).toFixed(2) >= 9) {
                document.getElementById('currentHlthScoreLabelNumber').style.color = "#03b218";
                document.getElementById('hsMeaningLabel').innerHTML = "Strong market position. Strong financial position. Consider expansion and/or acquisitions.";
            } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 9) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 7)) {
                // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
                document.getElementById('hsMeaningLabel').innerHTML = "Strong financial/market position. Allow experimentation with new initiatives.";
            } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 7) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 5)) {
                // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
                document.getElementById('hsMeaningLabel').innerHTML = "Moderate financial/market position. Focus resources to compete in future state.";
            } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 5) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 3)) {
                // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
                document.getElementById('hsMeaningLabel').innerHTML = "Moderate financial/market position. Direct Company resources to allow growth and expansion.";
            } else if ((Number(snap.child('/HealthScore').val()).toFixed(2) < 3) && (Number(snap.child('/HealthScore').val()).toFixed(2) >= 1)) {
                // document.getElementById('currentHlthScoreLabelNumber').style.color = "#FFD600";
                document.getElementById('hsMeaningLabel').innerHTML = "Weak financial/market position. Assess viability, consider restructuring.";
            } else {
                // document.getElementById('currentHlthScoreLabelNumber').style.color = "#ff4242";
                document.getElementById('hsMeaningLabel').innerHTML = "Weak financial/market position. Assess viability to survive.";
            }


            firebase.database().ref('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).once('value', function(FADsnap) {
                var cash = snap.child('/cashAndCashEq').val() || 0,
                    inven = FADsnap.child('/inventory').val() || 0,
                    prop = FADsnap.child('/property').val() || 0,
                    otherA = FADsnap.child('/otherAssets').val() || 0,
                    actsPay = FADsnap.child('/acctsPayable').val() || 0,
                    intPay = FADsnap.child('/interestPayable').val() || 0,
                    taxPay = FADsnap.child('/taxesPayable').val() || 0,
                    otherL = FADsnap.child('/otherPayable').val() || 0;

                fadPolarAreaDataArray.push(cash, inven, prop, otherA, actsPay, intPay, taxPay, otherL);
            }).then(function() {
                var fadRatioData = {
                    datasets: [{
                        data: fadPolarAreaDataArray,
                        backgroundColor: poolColors(8),
                        label: 'My dataset' // for legend
                    }],
                    labels: [
                        "Cash",
                        "Inventory",
                        "Property",
                        "Other Assets",
                        "Accounts Payable",
                        "Interest Payable",
                        "Taxes Payable",
                        "Other Payable"
                    ]
                };
                new Chart(ardx, {
                    data: fadRatioData,
                    type: "polarArea",
                    options: {
                        responsive: true,
                        elements: {
                            arc: {
                                borderColor: "white"
                            }
                        }
                    }
                });
            });

        });
    })

    firebase.database().ref('health-score-data/' + companySelectionKey + "/" + selectedQuarter).once('value', function(HSsnap) {
        var prr = Number(HSsnap.child('/primaryReserveRatio').val()).toFixed(2),
            vr = Number(HSsnap.child('/viabilityRatio').val()).toFixed(2),
            ronar = Number(HSsnap.child('/returnOnNetAssetsRatio').val()).toFixed(2),
            orr = Number(HSsnap.child('/netOperatingRevenuesRatio').val()).toFixed(2);

        ratioWebChartArray.push(prr, vr, ronar, orr);
    }).then(function() {
        // Ratio Web Chart
        var ratioWebData = {
            datasets: [{
                data: ratioWebChartArray,
                backgroundColor: poolColors(5),
                label: 'Core Ratios',
                pointStyle: "circle",
                pointRadius: 3,
                pointBorderWidth: 1,
                pointBackgroundColor: 'black',
            }],
            labels: [
                "Primary Reserve",
                "Viability",
                "Return Net Assets",
                "Net Op Rev"
            ],
        };
        new Chart(wdx, {
            data: ratioWebData,
            type: "radar",
            options: {

                responsive: true,

                scale: {
                    pointLabels: {
                        fontSize: 13,
                    },
                },
                elements: {
                    arc: {
                        borderColor: "black",

                    }
                }
            }
        });
    });


    // hsChart.render();

}

function PREVgetAccountingData(q) {
    var selectedQuarter = q;





    // Accounting Data Section:
    firebase.database().ref('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).on('value', function(snap) {
        document.getElementById('totalAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/totalAssets').val());
        document.getElementById('totalLibRow').innerHTML = "$" + numberWithCommas(snap.child('/totalLiabilities').val());
        document.getElementById('totalEqRow').innerHTML = "$" + numberWithCommas(snap.child('/totalEquity').val());
        document.getElementById('grossOpProfitRow').innerHTML = "$" + numberWithCommas(snap.child('/grossOpProfit').val());
        document.getElementById('EBITDARow').innerHTML = "$" + numberWithCommas(snap.child('/EBITDA').val());
        document.getElementById('OpIncomeRow').innerHTML = "$" + numberWithCommas(snap.child('/EBIT').val());
        document.getElementById('EBITRow').innerHTML = "$" + numberWithCommas(snap.child('/EBIT').val());

        // document.getElementById('netInRow').innerHTML = "Net Income$" + numberWithCommas(snap.child('/netIncome').val());
        document.getElementById('opActRow').innerHTML = "$" + numberWithCommas(snap.child('/opActivites').val());
        document.getElementById('invActRow').innerHTML = "$" + numberWithCommas(snap.child('/investActivites').val());
        document.getElementById('finActRow').innerHTML = "$" + numberWithCommas(snap.child('/financeActivites').val());
        document.getElementById('netInDeRow').innerHTML = "$" + numberWithCommas(snap.child('/netInDeInCash').val());

        // document.getElementById('avlCashRow').innerHTML = "Cash$" + numberWithCommas(snap.child('/cash').val());
        document.getElementById('avlInvRow').innerHTML = "$" + numberWithCommas(snap.child('/inventory').val());
        document.getElementById('avlPropRow').innerHTML = "$" + numberWithCommas(snap.child('/property').val());
        document.getElementById('avlOtherAssetsRow').innerHTML = "$" + numberWithCommas(snap.child('/otherAssets').val());

        document.getElementById('avlAccntsPayRow').innerHTML = "$" + numberWithCommas(snap.child('/acctsPayable').val());
        document.getElementById('avlInterestPayRow').innerHTML = "$" + numberWithCommas(snap.child('/interestPayable').val());
        document.getElementById('avlTaxesPayRow').innerHTML = "$" + numberWithCommas(snap.child('/taxesPayable').val());
        document.getElementById('avlotherPayRow').innerHTML = "$" + numberWithCommas(snap.child('/otherPayable').val());
        document.getElementById('acntsRecRow').innerHTML = "$" + numberWithCommas(snap.child('/accntsReceivable').val());





        document.getElementById('avlInvRow2').innerHTML = "$" + numberWithCommas(snap.child('/inventory').val());
        document.getElementById('avlPropRow2').innerHTML = "$" + numberWithCommas(snap.child('/property').val());
        document.getElementById('avlOtherAssetsRow2').innerHTML = "$" + numberWithCommas(snap.child('/otherAssets').val());

        document.getElementById('avlAccntsPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/acctsPayable').val());
        document.getElementById('avlInterestPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/interestPayable').val());
        document.getElementById('avlTaxesPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/taxesPayable').val());
        document.getElementById('avlotherPayRow2').innerHTML = "$" + numberWithCommas(snap.child('/otherPayable').val());

        // Financial Ratios Display
        document.getElementById('currRatioRow').innerHTML = Number(snap.child('/currentRatio').val()).toFixed(3);
        document.getElementById('quickRatioRow').innerHTML = Number(snap.child('/quickRatio').val()).toFixed(3);
        document.getElementById('intCoverRatioRow').innerHTML = Number(snap.child('/interestCoverageRatio').val()).toFixed(3);
        document.getElementById('timesEarnedIntRatioRow').innerHTML = Number(snap.child('/timesEarnedRatio').val()).toFixed(3);

        document.getElementById('debtEqRatioRow').innerHTML = Number(snap.child('/debtVsEquityRatio').val()).toFixed(3);
        document.getElementById('eqMultiRatioRow').innerHTML = Number(snap.child('/equityMultiplier').val()).toFixed(3);
        document.getElementById('grossProfitMarginRow').innerHTML = Number(snap.child('/grossProfitMargin').val()).toFixed(3);
        document.getElementById('opProfitMarginRow').innerHTML = Number(snap.child('/operatingProfitMargin').val()).toFixed(3);
        document.getElementById('netProfitMarginRow').innerHTML = Number(snap.child('/netProfitMargin').val()).toFixed(3);
        document.getElementById('returnOnAssetsRow').innerHTML = Number(snap.child('/returnOnAssetsRatio').val()).toFixed(3);
        document.getElementById('returnOnEquityRow').innerHTML = Number(snap.child('/returnOnEquityRatio').val()).toFixed(3);

        document.getElementById('dsiDisplayRow').innerHTML = Number(snap.child('/dsi').val()).toFixed(3);
        document.getElementById('dsoDisplayRow').innerHTML = Number(snap.child('/dso').val()).toFixed(3);
        document.getElementById('dpoDisplayRow').innerHTML = Number(snap.child('/dpo').val()).toFixed(3);
        document.getElementById('cashCycleDisplayRow').innerHTML = Number(snap.child('/cashCycle').val()).toFixed(3);
        document.getElementById('invTurnoverRow').innerHTML = Number(snap.child('/inventoryTO').val()).toFixed(3);
        document.getElementById('recTurnoverRow').innerHTML = Number(snap.child('/receivablesTO').val()).toFixed(3);
        document.getElementById('payTurnoverRow').innerHTML = Number(snap.child('/payablesTO').val()).toFixed(3);
        document.getElementById('totalTurnoverRow').innerHTML = Number(snap.child('/totalAssetsTO').val()).toFixed(3);

    });

    // firebase.database().ref('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).once('value', function(snap) {
    //     var cash = currCompCash,
    //         inven = snap.child('/inventory').val(),
    //         prop = snap.child('/property').val(),
    //         otherA = snap.child('/otherAssets').val(),
    //         actsPay = snap.child('/acctsPayable').val(),
    //         intPay = snap.child('/interestPayable').val(),
    //         taxPay = snap.child('/taxesPayable').val(),
    //         otherL = snap.child('/otherPayable').val();

    //     fadPolarAreaDataArray.push(cash, inven, prop, otherA, actsPay, intPay, taxPay, otherL);
    // }).then(function() {
    //     var fadRatioData = {
    //         datasets: [{
    //             data: fadPolarAreaDataArray,
    //             backgroundColor: poolColors(8),
    //             label: 'My dataset' // for legend
    //         }],
    //         labels: [
    //             "Cash",
    //             "Inventory",
    //             "Property",
    //             "Other Assets",
    //             "Accounts Payable",
    //             "Interest Payable",
    //             "Taxes Payable",
    //             "Other Payable"
    //         ]
    //     };
    //     var aradarChart = new Chart(ardx, {
    //         data: fadRatioData,
    //         type: "polarArea",
    //         options: {
    //             responsive: true,
    //             elements: {
    //                 arc: {
    //                     borderColor: "white"
    //                 }
    //             }
    //         }
    //     });
    // });

    // Accounting Data Polar Chart

}

function PREVgetDataYouWant(q) {
    var dywAcqArray = [],
        dywBusDevArray = [],
        pdx = document.getElementById('pieChart'),
        ddx = document.getElementById('dnChart'),
        selectedQuarter = q;


    // Data You Want Section:
    firebase.database().ref('data-you-want/' + companySelectionKey + "/" + selectedQuarter).on('value', function(snap) {
        document.getElementById('revChannelRow').innerHTML = "<td>" + snap.child('/revChannelMain').val() + "</td><td>$" + numberWithCommas(snap.child('/revChannelMainAmt').val()) + "</td><td>Reveue</td>";
        document.getElementById('dynamicCostRow').innerHTML = "<td>" + snap.child('/dynamicCostMain').val() + "</td><td>$" + numberWithCommas(snap.child('/dynamicCostMainAmt').val()) + "</td><td>Dynamic Cost</td>";
        document.getElementById('fixedCostRow').innerHTML = "<td>" + snap.child('/fixedCostMain').val() + "</td><td>$" + numberWithCommas(snap.child('/fixedCostMainAmt').val()) + "</td><td>Fixed Cost</td>";

        document.getElementById('dywChartReadOut1').innerHTML = "Acquisition Reveue: $" + numberWithCommas(snap.child('/acquisitionRevAvg').val()) + "<br><br>Acquisition Cost: $" + numberWithCommas(snap.child('/acquisitionCostAvg').val());
        document.getElementById('dywChartReadOut2').innerHTML = " Business Development Expense: $" + numberWithCommas(snap.child('/businessDevExpenditure').val()) + "<br><br>Travel and Entertainment: $" + numberWithCommas(snap.child('/travelAndEntertainment').val());




    });

    firebase.database().ref('data-you-want/' + companySelectionKey + "/" + selectedQuarter).once('value', function(snap) {
        var acqR = snap.child('/acquisitionRevAvg').val(),
            acqC = snap.child('/acquisitionCostAvg').val(),
            busDev = snap.child('/businessDevExpenditure').val(),
            tEE = snap.child('/travelAndEntertainment').val();
        dywAcqArray.push(acqR, acqC);
        dywBusDevArray.push(busDev, tEE);
    }).then(function() {
        var dywData1 = {
            labels: [
                "Acquisition Revenue",
                "Acquisition Cost"
            ],
            datasets: [{
                data: dywAcqArray,
                backgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ],
                hoverBackgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ]
            }]
        };
        var dywData2 = {
            labels: [
                "Business Development Cost",
                "Travel and Entertainment",
            ],
            datasets: [{
                data: dywBusDevArray,
                backgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ],
                hoverBackgroundColor: [
                    "#5edb5e",
                    "#e84545"
                ]
            }]
        };

        var myPieChart = new Chart(pdx, {
            type: 'doughnut',
            data: dywData1,
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderColor: "white"
                    }
                }
            }
        });
        // Now for the Business Dev Stuff 
        var myDoughnutChart = new Chart(ddx, {
            type: 'pie',
            data: dywData2,
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderColor: "white"
                    }
                }
            }
        });
    });

}

/**
 * PREVIOUS QUARTER DATA [END]
 */



// Change HS Bar Chart to Line Chart
function changeToLineChart() {
    // $('#healthScoreLineChart').remove();
    document.getElementById("hsChartArea").innerHTML = '<canvas id="healthScoreLineChart" height="30%" width="100%"></canvas>';
    // $('#hsChartArea').html('<canvas id="healthScoreLineChart" height="35%" width="100%" stlye="display: block;"></canvas>');

    var all = [],
        A = [],
        B = [],
        lcx = document.getElementById("healthScoreLineChart");

    // Health Score Line Chart:
    firebase.database().ref('health-score-data/' + companySelectionKey + "/" + currentQuarter).parent.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            all.push({ 'A': childSnapshot.key, 'B': childSnapshot.child('/HealthScore').val() });
        });
        all.sort(function(date1, date2) {
            var qd1 = moment(date1.A, 'Q-YYYY');
            var qd2 = moment(date2.A, 'Q-YYYY');
            return qd1.diff(qd2);
        });
        var length = all.length,
            j;
        var colors = poolColors(length + 1);
        for (j = 0; j < length; j++) {
            A.push(all[j].A);
            B.push(all[j].B);
        }

        new Chart(lcx, {
            type: 'line',
            data: {
                labels: A,
                datasets: [{
                    label: 'All Health Scores',
                    data: B,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 2,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: colors,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: colors,
                    pointHoverBorderColor: colors,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,

                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0, // disables bezier curves
                    }
                },
                responsive: true,
                scales: {


                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 10,
                        }
                    }]
                }
            }
        });

    });
}







/**
 * VIEW/EDIT/INPUT ALL DATA
 */

function editData(event) {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        editTypeElement = document.getElementById(event.id),
        dataEditType = $(editTypeElement).attr("value");
    console.log(event.id);
    // $('#dateSeclector').hide();
    $('.mdl-mega-footer').hide();
    $('#companyDetailsArea').hide();
    $('#companyListNavPannel').hide();
    $('#editAllDataArea').show('fast');
    if (selectedQuarter == '') {
        document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>NO DATE/DATA SELECTED. Use the dropdown located at the top.</strong>';
    } else {
        // IF THE TYPE IS HEALTH SCORE DATA THEN GENERATE THE TABLE AND DETAILS AREA SPECIFIC TO THE HEALTH SCORE
        if (dataEditType == 'HSD') {
            document.getElementById('dataEditCardLabelHeader').innerHTML = '';
            document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>Editing Health Score Data for ' + selectedQuarter + '</strong>';
            firebase.database().ref().child('health-score-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(hsData) {
                firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(fadData) {
                    // POPULATE TABLE AREA WITH VALUES AND INPUTS
                    document.getElementById('editDataTableBody').innerHTML = '';
                    document.getElementById('editDataTableBody').innerHTML = '<tr><td class="mdl-data-table__cell--non-numeric">Cash and Equivalents</td> <td><input id="cashEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('cashAndCashEq').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Long Term Debt</td> <td><input id="ltdEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('LongTermDebt').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Total Assets (Current)<br><input id="totalAssetsNAcurrentEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('totalAssets').val()) + '" style="text-align: left;"></td> <td>Total Liabilities (Current)<br><input id="totalLibNAcurrentEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('totalLiabilities').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Total Assets (Previous Q)<br><input id="totalAssetsNApreviousEditDataItem" type="number" placeholder="Input Data" style="text-align: left;"></td> <td>Total Liabilities (Previous Q)<br><input id="totalLibNApreviousEditDataItem" type="number" placeholder="Input Data" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Cost of Goods Sold</td> <td><input id="cogsEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('costOGS').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Selling and Admin Expense</td> <td><input id="sgaeEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('sellingAndAdmin').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Dep and Amort</td> <td><input id="depAmortEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('depAndAmort').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Interest Expense</td> <td><input  id="intExpEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('interestExp').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Non-Operating Expense</td> <td><input id="onoExpEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('otherNonOp').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Income Tax Expense</td> <td><input id="itExpEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('incomeTaxExp').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Net Income</td> <td><input id="niEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('netIncome').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Net Sales</td> <td><input id="nsEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('netSales').val()) + '" style="text-align: right;"></td></tr>';
                    // SHOW WHICH CALCULATIONS ARE ASSOCIATED WITH THIS DATA
                    $('#asocCalcLabel').show();
                    document.getElementById('editDataCalcDetails').innerHTML = '';
                    document.getElementById('editDataCalcDetails').innerHTML = '• <strong>Total Expenses</strong> => <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ') + <strong>SGAE</strong>(' + numberWithCommas(hsData.child('sellingAndAdmin').val()) + ') + <strong>DEPAMORT</strong>(' + numberWithCommas(hsData.child('depAndAmort').val()) + ') + <strong>INTEXP</strong>(' + numberWithCommas(hsData.child('interestExp').val()) + ') + <strong>ONOEXP</strong>(' + numberWithCommas(hsData.child('otherNonOp').val()) + ') + <strong>ITEXP</strong>(' + numberWithCommas(hsData.child('incomeTaxExp').val()) + ') = <strong>Total</strong>(' + numberWithCommas(hsData.child('TotalExpenses').val()) + ')<br><br>• <strong>Delta Net Assets</strong> => <strong>NA<sub>current</sub></strong>(' + numberWithCommas(hsData.child('currQnetAssets').val()) + ') - <strong>NA<sub>previous</sub></strong>(' + numberWithCommas(hsData.child('prevQnetAssets').val()) + ') = <strong>Delta</strong>(' + numberWithCommas(hsData.child('deltaNetAssets').val()) + ')';
                    // DISPLAY CURRENT VALUES FOR NON EDITABLE ITEMS
                    $('#dataEditValueLabelText').show();
                    document.getElementById('editDataValueDetails').innerHTML = '';
                    document.getElementById('editDataValueDetails').innerHTML = '• <strong style="font-size: 18px;">Health Score</strong>: ' + Number(hsData.child('HealthScore').val()).toFixed(2) + '<br><br>• <strong>Primary Reserve Ratio</strong>: ' + Number(hsData.child('primaryReserveRatio').val()).toFixed(2) + '<br>• <strong>Viability Ratio</strong>: ' + Number(hsData.child('viabilityRatio').val()).toFixed(2) + '<br>• <strong>Return on Net Assets Ratio</strong>: ' + Number(hsData.child('returnOnNetAssetsRatio').val()).toFixed(2) + '<br>• <strong>Net Operating Revenue Ratio</strong>: ' + Number(hsData.child('netOperatingRevenuesRatio').val()).toFixed(2);
                });
            });

            document.getElementById('editDataSaveButtonArea').innerHTML = '<a class="mdl-button mdl-button--colored mdl-js-button" style="color: white; background-color: #439fd8;" onclick="updateHealthScoreData()">Save</a>'
        } else if (dataEditType == 'BSD') {
            document.getElementById('dataEditCardLabelHeader').innerHTML = '';
            document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>Editing Balance Sheet Data for ' + selectedQuarter + '</strong>';
            firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(fadData) {
                firebase.database().ref().child('health-score-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(hsData) {
                    // POPULATE TABLE AREA WITH VALUES AND INPUTS
                    document.getElementById('editDataTableBody').innerHTML = '';
                    document.getElementById('editDataTableBody').innerHTML = '<tr><td class="mdl-data-table__cell--non-numeric">Total Assets</td> <td><input id="totalAssetsEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('totalAssets').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Total Liabilities</td> <td><input id="totalLibEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('totalLiabilities').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Total Equity</td> <td><input id="totalEqEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('totalEquity').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Cash and Equivalents</td> <td><input id="fadCashEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('currQnetAssets').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Inventory</td> <td><input id="inventoryEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('inventory').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Property</td> <td><input id="propertyEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('property').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Other Assets</td> <td><input id="otherAssetsEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('otherAssets').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Accounts Receivable</td> <td><input id="fadAcntsRecEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('accntsReceivable').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Long Term Debt</td> <td><input  id="fadLTDExpEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('prevQnetAssets').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Accounts Payable</td> <td><input id="acntsPayableEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('acctsPayable').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Interest Payable</td> <td><input id="fadIntPayableEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('acctsPayable').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Taxes Payable</td> <td><input id="taxPayableEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('taxesPayable').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Other Payables</td> <td><input id="otherPayableEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('otherPayable').val()) + '" style="text-align: right;"></td></tr>';
                    // SHOW WHICH CALCULATIONS ARE ASSOCIATED WITH THIS DATA
                    $('#asocCalcLabel').show();
                    document.getElementById('editDataCalcDetails').innerHTML = '';
                    document.getElementById('editDataCalcDetails').innerHTML = '• <strong>Current Ratio</strong> => <strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') / <strong>Total Liabilities</strong>(' + numberWithCommas(fadData.child('totalLiabilities').val()) + ') = <strong>Current</strong>(' + Number(fadData.child('currentRatio').val()).toFixed(2) + ') <br><br>• <strong>Quick Ratio</strong> => (<strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') - <strong>INV</strong>(' + numberWithCommas(fadData.child('inventory').val()) + ')) / <strong>Total Liabilities</strong>(' + numberWithCommas(fadData.child('totalLiabilities').val()) + ') = <strong>Quick</strong>(' + Number(fadData.child('quickRatio').val()).toFixed(2) + ')<br><br>• <strong>Debt vs. Equity Ratio</strong> => <strong>Total Liabilities</strong>(' + numberWithCommas(fadData.child('totalLiabilities').val()) + ') / <strong>Total Equity</strong>(' + numberWithCommas(fadData.child('totalEquity').val()) + ') = <strong>DVE</strong>(' + Number(fadData.child('debtVsEquityRatio').val()).toFixed(2) + ') <br><br>• <strong>Equity Multiplier Ratio</strong> => <strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') / <strong>Total Equity</strong>(' + numberWithCommas(fadData.child('totalEquity').val()) + ') = <strong>EQMULTI</strong>(' + Number(fadData.child('equityMultiplier').val()).toFixed(2) + ') <br><br>• <strong>Return on Assets</strong> => <strong>NI</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') = <strong>ROA</strong>(' + Number(fadData.child('returnOnAssetsRatio').val()).toFixed(2) + ') <br><br>• <strong>Return on Equity</strong> => <strong>NI</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>Total Equity</strong>(' + numberWithCommas(fadData.child('totalEquity').val()) + ') = <strong>ROE</strong>(' + Number(fadData.child('returnOnEquityRatio').val()).toFixed(2) + ') <br><br>• <strong>Days Sales Inventory</strong> => (<strong>INV</strong>(' + numberWithCommas(fadData.child('inventory').val()) + ') / <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ')) / 365 = <strong>DSI</strong>(' + Number(fadData.child('dsi').val()).toFixed(2) + ') <br><br>• <strong>Days Sales Outstanding</strong> => (<strong>ACNTSREC</strong>(' + numberWithCommas(fadData.child('accntsReceivable').val()) + ') / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) / 365 = <strong>DSO</strong>(' + Number(fadData.child('dso').val()).toFixed(2) + ') <br><br>• <strong>Days Payable Outstanding</strong> => (<strong>ACNTSPAY</strong>(' + numberWithCommas(fadData.child('acctsPayable').val()) + ') / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) / 365 = <strong>DPO</strong>(' + Number(fadData.child('dpo').val()).toFixed(2) + ') <br><br>• <strong>Inventory Turnover</strong> => <strong>COGS</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>INV</strong>(' + numberWithCommas(fadData.child('inventory').val()) + ') = <strong>INVTO</strong>(' + Number(fadData.child('inventoryTO').val()).toFixed(2) + ') <br><br>• <strong>Receivables Turnover</strong> => <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') / <strong>ACNTSREC</strong>(' + numberWithCommas(fadData.child('accntsReceivable').val()) + ') = <strong>RECTO</strong>(' + Number(fadData.child('receivablesTO').val()).toFixed(2) + ') <br><br>• <strong>Payables Turnover</strong> => <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ') / <strong>ACNTSPAY</strong>(' + numberWithCommas(fadData.child('acctsPayable').val()) + ') = <strong>PAYTO</strong>(' + Number(fadData.child('payablesTO').val()).toFixed(2) + ') <br><br>• <strong>Total Assets Turnover</strong> => <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') / <strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') = <strong>TATO</strong>(' + Number(fadData.child('totalAssetsTO').val()).toFixed(2) + ')';

                    $('#dataEditValueLabelText').hide();
                    document.getElementById('editDataValueDetails').innerHTML = '';

                });
            });
            // ADD AN updateBalanceSheetData() FUNCTION TO THE SAVE BUTTON
            document.getElementById('editDataSaveButtonArea').innerHTML = '<a class="mdl-button mdl-button--colored mdl-js-button" style="color: white; background-color: #439fd8;" onclick="updateBalanceSheetData()">Save</a>'
        } else if (dataEditType == 'ISD') {
            document.getElementById('dataEditCardLabelHeader').innerHTML = '';
            document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>Editing Income Statement Data for ' + selectedQuarter + '</strong>';
            firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(fadData) {
                firebase.database().ref().child('health-score-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(hsData) {
                    // POPULATE TABLE AREA WITH VALUES AND INPUTS
                    document.getElementById('editDataTableBody').innerHTML = '';
                    document.getElementById('editDataTableBody').innerHTML = '<tr><td class="mdl-data-table__cell--non-numeric">Cost of Goods Sold</td> <td><input id="fadCOGSEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('costOGS').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Selling, General, and Admin Expense</td> <td><input id="fadSGAEEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('sellingAndAdmin').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Depreciation and Amortization</td> <td><input id="fadDEPAMORTEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('depAndAmort').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Interest Income/Expense</td> <td><input id="fadINTEXPEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('interestExp').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Non-Operating Income/Expense</td> <td><input id="fadNONOPEXPEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('otherNonOp').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Income Tax Expense</td> <td><input id="fadITEXPEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('incomeTaxExp').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Net Sales</td> <td><input id="fadNSEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('netSales').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Gross Operating Profit</td> <td><input id="grossOpProfitEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('grossOpProfit').val()) + '" style="text-align: right;" disabled></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">EBITDA<br>Earnings before Interest, Tax, Dep and Amort</td> <td><input id="ebitdaEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('EBITDA').val()) + '" style="text-align: right;" disabled></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Operating Income</td> <td><input id="opIncomeEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('EBIT').val()) + '" style="text-align: right;" disabled></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">EBIT<br>Earnings before Interest and Tax</td> <td><input id="ebitEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('EBIT').val()) + '" style="text-align: right;" disabled></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Net Income</td> <td><input id="fadNIEditDataItem" type="number" placeholder="' + numberWithCommas(hsData.child('netIncome').val()) + '" style="text-align: right;"></td></tr>';
                    // SHOW WHICH CALCULATIONS ARE ASSOCIATED WITH THIS DATA
                    $('#asocCalcLabel').show();
                    document.getElementById('editDataCalcDetails').innerHTML = '';
                    document.getElementById('editDataCalcDetails').innerHTML = '• <strong>EBITDA</strong> => (<strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') - <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ') - <strong>SGAE</strong>(' + numberWithCommas(hsData.child('sellingAndAdmin').val()) + ')) = <strong>EBITDA</strong>(' + Number(fadData.child('EBITDA').val()).toFixed(2) + ') <br><br>• <strong>EBIT</strong> => (<strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') - <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ') - <strong>SGAE</strong>(' + numberWithCommas(hsData.child('sellingAndAdmin').val()) + ') - <strong>DEPAMORT</strong>(' + numberWithCommas(hsData.child('depAndAmort').val()) + ')) = <strong>EBIT</strong>(' + Number(fadData.child('EBIT').val()).toFixed(2) + ') <br><br>• <strong>Gross Operating Profit</strong> => <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') - <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ') = <strong>GOP</strong>(' + Number(fadData.child('grossOpProfit').val()).toFixed(2) + ') <br><br>• <strong>Gross Profit Margin</strong> => ((<strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') - <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ')) / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) * 100 = <strong>GPM</strong>(' + Number(fadData.child('grossProfitMargin').val()).toFixed(2) + ') <br><br>• <strong>Operating Profit Margin</strong> => (<strong>EBIT</strong>(' + numberWithCommas(fadData.child('EBIT').val()) + ') / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) * 100 = <strong>OPM</strong>(' + Number(fadData.child('operatingProfitMargin').val()).toFixed(2) + ')<br><br>• <strong>Net Profit Margin</strong> => (<strong>NI</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) * 100 = <strong>NPM</strong>(' + Number(fadData.child('netProfitMargin').val()).toFixed(2) + ') <br><br>• <strong>Interest Coverage</strong> => <strong>EBITDA</strong>(' + numberWithCommas(fadData.child('EBITDA').val()) + ') / <strong>INTEXP</strong>(' + numberWithCommas(hsData.child('interestExp').val()) + ') = <strong>INTCOV</strong>(' + Number(fadData.child('interestCoverageRatio').val()).toFixed(2) + ') <br><br>• <strong>Times Earned Interest</strong> => <strong>EBIT</strong>(' + numberWithCommas(fadData.child('EBIT').val()) + ') / <strong>ITEXP</strong>(' + numberWithCommas(hsData.child('incomeTaxExp').val()) + ') = <strong>TEARNINT</strong>(' + Number(fadData.child('timesEarnedRatio').val()).toFixed(2) + ') <br><br>• <strong>Return on Assets</strong> => <strong>NI</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') = <strong>ROA</strong>(' + Number(fadData.child('returnOnAssetsRatio').val()).toFixed(2) + ') <br><br>• <strong>Return on Equity</strong> => <strong>NI</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>Total Equity</strong>(' + numberWithCommas(fadData.child('totalEquity').val()) + ') = <strong>ROE</strong>(' + Number(fadData.child('returnOnEquityRatio').val()).toFixed(2) + ') <br><br>• <strong>Days Sales Inventory</strong> => (<strong>INV</strong>(' + numberWithCommas(fadData.child('inventory').val()) + ') / <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ')) / 365 = <strong>DSI</strong>(' + Number(fadData.child('dsi').val()).toFixed(2) + ') <br><br>• <strong>Days Sales Outstanding</strong> => (<strong>ACNTSREC</strong>(' + numberWithCommas(fadData.child('accntsReceivable').val()) + ') / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) / 365 = <strong>DSO</strong>(' + Number(fadData.child('dso').val()).toFixed(2) + ') <br><br>• <strong>Days Payable Outstanding</strong> => (<strong>ACNTSPAY</strong>(' + numberWithCommas(fadData.child('acctsPayable').val()) + ') / <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ')) / 365 = <strong>DPO</strong>(' + Number(fadData.child('dpo').val()).toFixed(2) + ') <br><br>• <strong>Inventory Turnover</strong> => <strong>COGS</strong>(' + numberWithCommas(hsData.child('netIncome').val()) + ') / <strong>INV</strong>(' + numberWithCommas(fadData.child('inventory').val()) + ') = <strong>INVTO</strong>(' + Number(fadData.child('inventoryTO').val()).toFixed(2) + ') <br><br>• <strong>Receivables Turnover</strong> => <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') / <strong>ACNTSREC</strong>(' + numberWithCommas(fadData.child('accntsReceivable').val()) + ') = <strong>RECTO</strong>(' + Number(fadData.child('receivablesTO').val()).toFixed(2) + ') <br><br>• <strong>Payables Turnover</strong> => <strong>COGS</strong>(' + numberWithCommas(hsData.child('costOGS').val()) + ') / <strong>ACNTSPAY</strong>(' + numberWithCommas(fadData.child('acctsPayable').val()) + ') = <strong>PAYTO</strong>(' + Number(fadData.child('payablesTO').val()).toFixed(2) + ') <br><br>• <strong>Total Assets Turnover</strong> => <strong>NS</strong>(' + numberWithCommas(hsData.child('netSales').val()) + ') / <strong>Total Assets</strong>(' + numberWithCommas(fadData.child('totalAssets').val()) + ') = <strong>TATO</strong>(' + Number(fadData.child('totalAssetsTO').val()).toFixed(2) + ')';

                    $('#dataEditValueLabelText').hide();
                    document.getElementById('editDataValueDetails').innerHTML = '';

                });
            });
            // ADD AN updateIncomeStatementData() FUNCTION TO THE SAVE BUTTON
            document.getElementById('editDataSaveButtonArea').innerHTML = '<a class="mdl-button mdl-button--colored mdl-js-button" style="color: white; background-color: #439fd8;" onclick="updateIncomeStatementData()">Save</a>'
        } else if (dataEditType == 'CFD') {
            document.getElementById('dataEditCardLabelHeader').innerHTML = '';
            document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>Editing Income Statement Data for ' + selectedQuarter + '</strong>';
            firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(fadData) {
                // POPULATE TABLE AREA WITH VALUES AND INPUTS
                document.getElementById('editDataTableBody').innerHTML = '';
                document.getElementById('editDataTableBody').innerHTML = '<tr><td class="mdl-data-table__cell--non-numeric">Operating Activities</td> <td><input id="cafOpActivEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('opActivites').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Investing Activities</td> <td><input id="cafInvestActivEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('investActivites').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Financing Activities</td> <td><input id="cafFinActivEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('financeActivites').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Net Increase/Decrease in Cash</td> <td><input id="cafNInDCinCashEditDataItem" type="number" placeholder="' + numberWithCommas(fadData.child('netInDeInCash').val()) + '" style="text-align: right;"></td></tr>';
                // SHOW WHICH CALCULATIONS ARE ASSOCIATED WITH THIS DATA
                $('#asocCalcLabel').hide();
                document.getElementById('editDataCalcDetails').innerHTML = '';


                $('#dataEditValueLabelText').hide();
                document.getElementById('editDataValueDetails').innerHTML = '';

            });
            // ADD AN updateCashFlowsData() FUNCTION TO THE SAVE BUTTON
            document.getElementById('editDataSaveButtonArea').innerHTML = '<a class="mdl-button mdl-button--colored mdl-js-button" style="color: white; background-color: #439fd8;" onclick="updateCashFlowsData()">Save</a>'
        } else if (dataEditType == 'DYW') {
            document.getElementById('dataEditCardLabelHeader').innerHTML = '';
            document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>Editing Data You Want for ' + selectedQuarter + '</strong>';
            firebase.database().ref().child('data-you-want/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(dywData) {
                // POPULATE TABLE AREA WITH VALUES AND INPUTS
                document.getElementById('editDataTableBody').innerHTML = '';
                document.getElementById('editDataTableBody').innerHTML = '<tr><td class="mdl-data-table__cell--non-numeric">Acquisition Cost</td> <td><input id="dywAcqCostEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('acquisitionCostAvg').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric">Acquisition Revenue</td> <td><input id="dywAcqRevEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('acquisitionRevAvg').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Business Development Expenditure</td> <td><input id="dywBusDevEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('businessDevExpenditure').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric">Travel and Entertainment</td> <td><input id="dywTravelAndEntEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('travelAndEntertainment').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric"><input id="dywRevChanNameEditDataItem" type="string" placeholder="' + dywData.child('revChannelMain').val() + '" style="text-align: left;"><br>Main Revenue Channel</td> <td><input id="dywRevChanAmtEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('revChannelMainAmt').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric"><input id="dywFixedCostNameEditDataItem" type="string" placeholder="' + dywData.child('fixedCostMain').val() + '" style="text-align: left;"><br>Main Fixed Cost</td> <td><input id="dywFixedCostNameEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('fixedCostMainAmt').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric"><input id="dywDynamicCostNameEditDataItem" type="string" placeholder="' + dywData.child('dynamicCostMain').val() + '" style="text-align: left;"><br>Main Dynamic Cost</td> <td><input id="dywDyCostAmtEditDataItem" type="number" placeholder="' + numberWithCommas(dywData.child('dynamicCostMainAmt').val()) + '" style="text-align: right;"></td></tr>';
                // SHOW WHICH CALCULATIONS ARE ASSOCIATED WITH THIS DATA
                $('#asocCalcLabel').hide();
                document.getElementById('editDataCalcDetails').innerHTML = '';


                $('#dataEditValueLabelText').show();
                document.getElementById('editDataValueDetails').innerHTML = "• <strong>Acquisition Cost/Revenue</strong> refers to the amount of capital that is expended and gained per one user/client.<br><br>• <strong>Business Development Expenditure</strong> refers to the amount of money spent on Research and Development (R&D).<br>• <strong>Travel and Entertainment</strong> refers to the expenses incurred when an employee is traveling or entertaining a client.<br><br><br>• <strong>Main Revenue Channel</strong> refers to the name and income generated by the company's most lucrative cash flow stream.<br>• <strong>Main Fixed Cost</strong> refers to the most expensive, regularly occuring expenditure made by the company.<br>• <strong>Main Dynamic Cost</strong> refers to the most expensive cost (non-regularly occuring) made by the company for the given time period.";

            });
            // ADD AN updateDataYouWantData() FUNCTION TO THE SAVE BUTTON
            document.getElementById('editDataSaveButtonArea').innerHTML = '<a class="mdl-button mdl-button--colored mdl-js-button" style="color: white; background-color: #439fd8;" onclick="updateDataYouWantData()">Save</a>'
        } else if (dataEditType == 'SECT') {
            document.getElementById('dataEditCardLabelHeader').innerHTML = '';
            document.getElementById('dataEditCardLabelHeader').innerHTML = '<strong>Editing Sector Data for ' + selectedQuarter + '</strong>';
            firebase.database().ref().child('sector-data/' + companySelectionKey + "/" + selectedQuarter).once('value').then(function(sectData) {
                // POPULATE TABLE AREA WITH VALUES AND INPUTS
                document.getElementById('editDataTableBody').innerHTML = '';
                document.getElementById('editDataTableBody').innerHTML = '<tr><td class="mdl-data-table__cell--non-numeric"><input id="sectItem1EditDataItem" type="string" placeholder="' + sectData.child('item0').val() + '" style="text-align: left;"><br>Sector Data 1</td> <td><input id="sectItem1AmtEditDataItem" type="number" placeholder="' + numberWithCommas(sectData.child('item0Amt').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric"><input id="sectItem2EditDataItem" type="string" placeholder="' + sectData.child('item1').val() + '" style="text-align: left;"><br>Sector Data 2</td> <td><input id="sectItem2AmtEditDataItem" type="number" placeholder="' + numberWithCommas(sectData.child('item1Amt').val()) + '" style="text-align: right;"></td></tr> <tr><td class="mdl-data-table__cell--non-numeric"><input id="sectItem3EditDataItem" type="string" placeholder="' + sectData.child('item2').val() + '" style="text-align: left;"><br>Sector Data 3</td> <td><input id="sectItem3AmtEditDataItem" type="number" placeholder="' + numberWithCommas(sectData.child('item2Amt').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric"><input id="sectItem4EditDataItem" type="string" placeholder="' + sectData.child('item3').val() + '" style="text-align: left;"><br>Sector Data 4</td> <td><input id="sectItem4AmtEditDataItem" type="number" placeholder="' + numberWithCommas(sectData.child('item3Amt').val()) + '" style="text-align: right;"></td></tr><tr><td class="mdl-data-table__cell--non-numeric"><input id="sectItem5EditDataItem" type="string" placeholder="' + sectData.child('item4').val() + '" style="text-align: left;"><br>Sector Data 5</td> <td><input id="sectItem5AmtEditDataItem" type="number" placeholder="' + numberWithCommas(sectData.child('item4Amt').val()) + '" style="text-align: right;"></td></tr>';
                // SHOW WHICH CALCULATIONS ARE ASSOCIATED WITH THIS DATA
                $('#asocCalcLabel').hide();
                document.getElementById('editDataCalcDetails').innerHTML = '';


                $('#dataEditValueLabelText').show();
                document.getElementById('editDataValueDetails').innerHTML = "• <strong>Sector Data</strong> refers to main revenue/costs incurred which are specific to the company's sector. i.e. A Consumer Goods/Retail business will spend money on clothing restocking whereas a Technology/Software will not (probably being spent on Adobe Subscriptions instead).";

            });
            // ADD AN updateSectorData() FUNCTION TO THE SAVE BUTTON
            document.getElementById('editDataSaveButtonArea').innerHTML = '<a class="mdl-button mdl-button--colored mdl-js-button" style="color: white; background-color: #439fd8;" onclick="updateSectorData()">Save</a>'
        }
    }
}

function updateHealthScoreData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        CASH = document.getElementById('cashEditDataItem').value,
        COGS = document.getElementById('cogsEditDataItem').value,
        SAAC = document.getElementById('sgaeEditDataItem').value,
        DEPAMORT = document.getElementById('depAmortEditDataItem').value,
        INTEXP = document.getElementById('intExpEditDataItem').value,
        ONOEXP = document.getElementById('onoExpEditDataItem').value,
        ITEXP = document.getElementById('itExpEditDataItem').value,
        LTD = document.getElementById('ltdEditDataItem').value,
        TAcurrent_NA = document.getElementById('totalAssetsNAcurrentEditDataItem').value,
        TLcurrent_NA = document.getElementById('totalLibNAcurrentEditDataItem').value,
        TAprevious_NA = document.getElementById('totalAssetsNApreviousEditDataItem').value,
        TLprevious_NA = document.getElementById('totalLibNApreviousEditDataItem').value,
        NI = document.getElementById('niEditDataItem').value,
        NS = document.getElementById('nsEditDataItem').value;

    var ref = firebase.database().ref('health-score-data/' + companySelectionKey + '/' + selectedQuarter);
    var FADref = firebase.database().ref('formal-accounting-data/' + companySelectionKey + '/' + selectedQuarter);
    try {
        // Expendable Net Assets
        if (CASH != (null || '')) { ref.update({ "cashAndCashEq": CASH }); }
        // Total Expenses
        if (COGS != (null || '')) { ref.update({ "costOGS": COGS }); }
        if (SAAC != (null || '')) { ref.update({ "sellingAndAdmin": SAAC }); }
        if (DEPAMORT != (null || '')) { ref.update({ "depAndAmort": DEPAMORT }); }
        if (INTEXP != (null || '')) { ref.update({ "interestExp": INTEXP }); }
        if (ONOEXP != (null || '')) { ref.update({ "otherNonOp": ONOEXP }); }
        if (ITEXP != (null || '')) { ref.update({ "incomeTaxExp": ITEXP }); }
        // Long Term Debt
        if (LTD != (null || '')) { ref.update({ "LongTermDebt": LTD }); }



        // Delta Net Assets
        if (TAcurrent_NA != (null || '')) {
            FADref.update({ "totalAssets": TAcurrent_NA });
        }
        if (TLcurrent_NA != (null || '')) {
            FADref.update({ "totalLiabilities": TLcurrent_NA });
        }
        // Beginning Net Assets 
        if ((TAprevious_NA != (null || '')) && (TLprevious_NA != (null || ''))) {
            var previous_DeltaNA = (Number(TAprevious_NA) - Number(TLprevious_NA));
            ref.update({ "prevQnetAssets": previous_DeltaNA });
        }





        // Op Surplus or Deficit
        if (NI != (null || '')) { ref.update({ "netIncome": NI }); }
        // Op Revenues
        if (NS != (null || '')) { ref.update({ "netSales": NS }); }

        $.prompt('Successfully updated Health Score data for ' + selectedQuarter + '.');
        $('.mdl-mega-footer').show();
        $('#companyDetailsArea').show();
        $('#companyListNavPannel').show();
        $('#editAllDataArea').hide();
    } catch (error) {
        alert('Error: ' + error);
    }
}

function updateBalanceSheetData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        TA = document.getElementById('totalAssetsEditDataItem').value,
        TL = document.getElementById('totalLibEditDataItem').value,
        TE = document.getElementById('totalEqEditDataItem').value,
        CASH = document.getElementById('fadCashEditDataItem').value,
        INV = document.getElementById('inventoryEditDataItem').value,
        PROP = document.getElementById('propertyEditDataItem').value,
        OA = document.getElementById('otherAssetsEditDataItem').value,
        ACNTSREC = document.getElementById('fadAcntsRecEditDataItem').value,
        LTD = document.getElementById('fadLTDExpEditDataItem').value,
        ACNTSPAY = document.getElementById('acntsPayableEditDataItem').value,
        intPay = document.getElementById('fadIntPayableEditDataItem').value,
        TAXPAY = document.getElementById('taxPayableEditDataItem').value,
        OTHERPAY = document.getElementById('otherPayableEditDataItem').value;

    var FADref = firebase.database().ref('formal-accounting-data/' + companySelectionKey + '/' + selectedQuarter);
    var HSDref = firebase.database().ref('health-score-data/' + companySelectionKey + '/' + selectedQuarter);
    try {
        if (TA != (null || '')) { FADref.update({ "totalAssets": TA }); }
        if (TL != (null || '')) { FADref.update({ "totalLiabilities": TL }); }
        if (TE != (null || '')) { FADref.update({ "totalEquity": TE }); }
        if (CASH != (null || '')) { HSDref.update({ "cashAndCashEq": CASH }); }
        if (INV != (null || '')) { FADref.update({ "inventory": INV }); }
        if (PROP != (null || '')) { FADref.update({ "property": PROP }); }
        if (OA != (null || '')) { FADref.update({ "otherAssets": OA }); }
        if (ACNTSREC != (null || '')) { FADref.update({ "accntsReceivable": ACNTSREC }); }
        if (LTD != (null || '')) { HSDref.update({ "LongTermDebt": LTD }); }
        if (ACNTSPAY != (null || '')) { FADref.update({ "acctsPayable": ACNTSPAY }); }
        if (intPay != (null || '')) { FADref.update({ "interestPayable": intPay }); }
        if (TAXPAY != (null || '')) { FADref.update({ "taxesPayable": TAXPAY }); }
        if (OTHERPAY != (null || '')) { FADref.update({ "otherPayable": OTHERPAY }); }

        $.prompt('Successfully updated Balance Sheet data for ' + selectedQuarter + '.');
        $('.mdl-mega-footer').show();
        $('#companyDetailsArea').show();
        $('#companyListNavPannel').show();
        $('#editAllDataArea').hide();
    } catch (error) {
        alert('Error: ' + error);
    }
}

function updateIncomeStatementData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        COGS = document.getElementById('fadCOGSEditDataItem').value,
        SAAC = document.getElementById('fadSGAEEditDataItem').value,
        DEPAMORT = document.getElementById('fadDEPAMORTEditDataItem').value,
        INTEXP = document.getElementById('fadINTEXPEditDataItem').value,
        ONOEXP = document.getElementById('fadNONOPEXPEditDataItem').value,
        ITEXP = document.getElementById('fadITEXPEditDataItem').value,
        NI = document.getElementById('fadNSEditDataItem').value,
        NS = document.getElementById('fadNIEditDataItem').value;

    var HSDref = firebase.database().ref('health-score-data/' + companySelectionKey + '/' + selectedQuarter);
    try {
        if (COGS != (null || '')) { HSDref.update({ "costOGS": COGS }); }
        if (SAAC != (null || '')) { HSDref.update({ "sellingAndAdmin": SAAC }); }
        if (DEPAMORT != (null || '')) { HSDref.update({ "depAndAmort": DEPAMORT }); }
        if (INTEXP != (null || '')) { HSDref.update({ "interestExp": INTEXP }); }
        if (ONOEXP != (null || '')) { HSDref.update({ "otherNonOp": ONOEXP }); }
        if (ITEXP != (null || '')) { HSDref.update({ "incomeTaxExp": ITEXP }); }
        if (NI != (null || '')) { HSDref.update({ "netIncome": NI }); }
        if (NS != (null || '')) { HSDref.update({ "netSales": NS }); }

        $.prompt('Successfully updated Income Statement data for ' + selectedQuarter + '.');
        $('.mdl-mega-footer').show();
        $('#companyDetailsArea').show();
        $('#companyListNavPannel').show();
        $('#editAllDataArea').hide();
    } catch (error) {
        alert('Error: ' + error);
    }
}

function updateCashFlowsData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        OPACTIV = document.getElementById('cafOpActivEditDataItem').value,
        INVESTACTIV = document.getElementById('cafInvestActivEditDataItem').value,
        FINACTIV = document.getElementById('cafFinActivEditDataItem').value,
        NETINDECASH = document.getElementById('cafNInDCinCashEditDataItem').value;

    var FADref = firebase.database().ref('formal-accounting-data/' + companySelectionKey + '/' + selectedQuarter);
    try {
        if (OPACTIV != (null || '')) { FADref.update({ "opActivites": OPACTIV }); }
        if (INVESTACTIV != (null || '')) { FADref.update({ "investActivites": INVESTACTIV }); }
        if (FINACTIV != (null || '')) { FADref.update({ "financeActivites": FINACTIV }); }
        if (NETINDECASH != (null || '')) { FADref.update({ "netInDeInCash": NETINDECASH }); }

        $.prompt('Successfully updated Cash Flows data for ' + selectedQuarter + '.');
        $('.mdl-mega-footer').show();
        $('#companyDetailsArea').show();
        $('#companyListNavPannel').show();
        $('#editAllDataArea').hide();
    } catch (error) {
        alert('Error: ' + error);
    }
}

function updateDataYouWantData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        ACQCOST = document.getElementById('dywAcqCostEditDataItem').value,
        ACQREV = document.getElementById('dywAcqRevEditDataItem').value,
        BUSDEV = document.getElementById('dywBusDevEditDataItem').value,
        TAEE = document.getElementById('dywTravelAndEntEditDataItem').value,
        REVCHAN = document.getElementById('dywRevChanNameEditDataItem').value,
        REVCHANAMT = document.getElementById('dywRevChanAmtEditDataItem').value,
        FIXCOST = document.getElementById('dywFixedCostNameEditDataItem').value,
        FIXCOSTAMT = document.getElementById('dywFixedCostNameEditDataItem').value,
        DYCOST = document.getElementById('dywDynamicCostNameEditDataItem').value,
        DYCOSTAMT = document.getElementById('dywDyCostAmtEditDataItem').value;

    var DYWref = firebase.database().ref('data-you-want/' + companySelectionKey + '/' + selectedQuarter);
    try {
        if (ACQCOST != (null || '')) { DYWref.update({ "acquisitionCostAvg": ACQCOST }); }
        if (ACQREV != (null || '')) { DYWref.update({ "acquisitionRevAvg": ACQREV }); }
        if (BUSDEV != (null || '')) { DYWref.update({ "businessDevExpenditure": BUSDEV }); }
        if (TAEE != (null || '')) { DYWref.update({ "travelAndEntertainment": TAEE }); }
        if (REVCHAN != (null || '')) { DYWref.update({ "revChannelMain": REVCHAN }); }
        if (REVCHANAMT != (null || '')) { DYWref.update({ "revChannelMainAmt": REVCHANAMT }); }
        if (FIXCOST != (null || '')) { DYWref.update({ "fixedCostMain": FIXCOST }); }
        if (FIXCOSTAMT != (null || '')) { DYWref.update({ "fixedCostMainAmt": FIXCOSTAMT }); }
        if (DYCOST != (null || '')) { DYWref.update({ "dynamicCostMain": DYCOST }); }
        if (DYCOSTAMT != (null || '')) { DYWref.update({ "dynamicCostMainAmt": DYCOSTAMT }); }

        $.prompt('Successfully updated Data You Want for ' + selectedQuarter + '.');
        $('.mdl-mega-footer').show();
        $('#companyDetailsArea').show();
        $('#companyListNavPannel').show();
        $('#editAllDataArea').hide();
    } catch (error) {
        alert('Error: ' + error);
    }
}

function updateSectorData() {
    var qSelectionBox = document.getElementById('dateSeclector'),
        selectedQuarter = qSelectionBox.options[qSelectionBox.selectedIndex].value,
        SECTITEM1 = document.getElementById('sectItem1EditDataItem').value,
        SECTITEM1AMT = document.getElementById('sectItem1AmtEditDataItem').value,
        SECTITEM2 = document.getElementById('sectItem2EditDataItem').value,
        SECTITEM2AMT = document.getElementById('sectItem2AmtEditDataItem').value,
        SECTITEM3 = document.getElementById('sectItem3EditDataItem').value,
        SECTITEM3AMT = document.getElementById('sectItem3AmtEditDataItem').value,
        SECTITEM4 = document.getElementById('sectItem4EditDataItem').value,
        SECTITEM4AMT = document.getElementById('sectItem4AmtEditDataItem').value,
        SECTITEM5 = document.getElementById('sectItem5EditDataItem').value,
        SECTITEM5AMT = document.getElementById('sectItem5AmtEditDataItem').value;

    var SECTref = firebase.database().ref('sector-data/' + companySelectionKey + '/' + selectedQuarter);
    try {
        if (SECTITEM1 != (null || '')) { SECTref.update({ "item0": SECTITEM1 }); }
        if (SECTITEM1AMT != (null || '')) { SECTref.update({ "item0Amt": SECTITEM1AMT }); }
        if (SECTITEM2 != (null || '')) { SECTref.update({ "item1": SECTITEM2 }); }
        if (SECTITEM2AMT != (null || '')) { SECTref.update({ "item1Amt": SECTITEM2AMT }); }
        if (SECTITEM3 != (null || '')) { SECTref.update({ "item2": SECTITEM3 }); }
        if (SECTITEM3AMT != (null || '')) { SECTref.update({ "item2Amt": SECTITEM3AMT }); }
        if (SECTITEM4 != (null || '')) { SECTref.update({ "item3": SECTITEM4 }); }
        if (SECTITEM4AMT != (null || '')) { SECTref.update({ "item3Amt": SECTITEM4AMT }); }
        if (SECTITEM5 != (null || '')) { SECTref.update({ "item4": SECTITEM5 }); }
        if (SECTITEM5AMT != (null || '')) { SECTref.update({ "item4Amt": SECTITEM5AMT }); }

        $.prompt('Successfully updated Sector Data for ' + selectedQuarter + '.');
        $('.mdl-mega-footer').show();
        $('#companyDetailsArea').show();
        $('#companyListNavPannel').show();
        $('#editAllDataArea').hide();
    } catch (error) {
        alert('Error: ' + error);
    }
}

// COMPANY DESCRIPTION EDIT
function saveCompDescritiondata() {
    var statesdemo = {
        state0: {
            title: 'Company Description Data',
            html: '<input name="compNameInput" id="name="compNameInput"" type="text" placeholder="Company Name"/><br>' +
                '<input name="mainSectorInput" id="name="mainSectorInput"" type="text" placeholder="Main Sector"/><br>' +
                '<input name="subSectorInput" id="name="subSectorInput"" type="text" placeholder="Sub Sector"/><br>' +
                '<input name="hqInput" id="name="hqInput"" type="text" placeholder="Location"/><br><br>' +
                '<label>Upload Your Logo (256px by 256px - Larger images will be scaled down)</label><br>' +
                '<input type="file" value="upload" name="logoButton" id="logoButton"><br><br>' +
                '<textarea rows="4" cols="20" name="compDescriptionInput" id="name="compDescriptionInput"" type="text" placeholder="Managment to Investor Notes/Dialog"></textarea>',
            focus: 0,
            buttons: { "Yes, I'm Ready": true, "No, Nevermind": false },
            submit: function(e, v, m, f) {
                e.preventDefault();
                if (v == true) {
                    var ref = firebase.database().ref('/company-description-data/' + companySelectionKey);

                    console.log($("#logoButton").val())


                    if (f.compNameInput != "") {
                        ref.update({ "name": f.compNameInput });
                    }
                    if (f.mainSectorInput != "") {
                        ref.update({ "mainSector": f.mainSectorInput });
                    }
                    if (f.subSectorInput != "") {
                        ref.update({ "subSector": f.subSectorInput });
                    }
                    if (f.hqInput != "") {
                        ref.update({ "hq": f.hqInput });
                    }
                    if (f.compDescriptionInput != "") {
                        ref.update({ "description": f.compDescriptionInput });
                    }




                    if ($("#logoButton").val() != "") {
                        var getFile = document.getElementById('logoButton');
                        var file = getFile.files[0];
                        var storageRef = firebase.storage().ref('/company-description-data/' + companySelectionKey + '/logo');
                        var task = storageRef.put(file);
                        task.on('state_changed',
                            function progress(snapshot) {

                            },
                            function error(err) {
                                alert("Error: " + err);
                                console.log(err);
                            },
                            function complete() {
                                alert('The upload completed!');
                                $.prompt.close();
                            }
                        );
                    }

                    $.prompt.close();
                    generateCompanyList();

                } else {
                    $.prompt.close();
                }
            }
        },

    };
    $.prompt(statesdemo);
}

/**
 * ADD PAST DATA
 */
function addPastData() {
    var addPastDataDialog = {
        state0: {
            title: 'Add/Create Past Data?',
            html: '<label><strong>QUARTER:</strong> <input style="width: 100px;" name="qNum" type="number" min="1" max="4" placeholder="Quarter Number 1-4" required /></label><br />' +
                '<label><strong>YEAR:</strong> <input style="width: 100px;" name="yearNum" type="number" min="1980" max="2400" placeholder="Year e.g. 2008" required /></label><br />',
            buttons: { 'Cancel': -1, 'Create Data': 1 },
            //focus: "input[name='fname']",
            submit: function(e, v, m, f) {
                if (v == 1) {
                    var qData = f.qNum + "-" + f.yearNum;
                    var HSDref = firebase.database().ref().child('health-score-data/' + companySelectionKey + "/" + qData);
                    var FADref = firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + "/" + qData);
                    var DYWref = firebase.database().ref().child('data-you-want/' + companySelectionKey + "/" + qData);
                    var SECTref = firebase.database().ref().child('sector-data/' + companySelectionKey + "/" + qData);
                    HSDref.once('value', function(refData) {
                        if (refData.exists() == true) {
                            $.prompt("Data for " + qData + " already exists.");
                            $.prompt.close();
                        } else {
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
                    });
                } else if (v == -1) {
                    $.prompt.close();
                }

                // e.preventDefault();
            }
        }
    };

    $.prompt(addPastDataDialog);

}



// Delete Selected Company Function
function deleteSelectedCompany() {
    var statesdemo = {
        state0: {
            title: "WARNING! This will perminetly delete " + selectedCompanyName + " from the database!",
            html: "Are you sure you'd like to delete " + selectedCompanyName + "?",
            focus: 0,
            buttons: { "Yes, Delete!": true, "No, Nevermind": false },
            submit: function(e, v, m, f) {
                // e.preventDefault();
                if (v == true) {
                    // Delete all of the Selected Company's Stuff:
                    firebase.database().ref('company-description-data/' + companySelectionKey).remove().then(function() {
                        console.log("Remove succeeded.");
                    }).catch(function(error) {
                        // alert("Error Message: " + error.message);
                        // console.log("Remove failed: " + error.message);

                    });
                    firebase.database().ref('health-score-data/' + companySelectionKey).remove().then(function() {

                    }).catch(function(error) {

                    });
                    firebase.database().ref('formal-accounting-data/' + companySelectionKey).remove().then(function() {

                    }).catch(function(error) {

                    });
                    firebase.database().ref('sector-data/' + companySelectionKey).remove().then(function() {

                    }).catch(function(error) {

                    });
                    firebase.database().ref('data-you-want/' + companySelectionKey).remove().then(function() {

                    }).catch(function(error) {

                    });
                    firebase.database().ref('users/' + currentUserID + '/linked-companies/' + companySelectionKey).remove().then(function() {
                        console.log("Remove succeeded.");
                        $.prompt("It's gone!");
                    }).catch(function(error) {
                        alert("Error Message: " + error.message);
                        console.log("Remove failed: " + error.message);
                    });


                    generateCompanyList();

                } else {
                    $.prompt.close();
                }
            }
        },

    };
    $.prompt(statesdemo);


    // vex.dialog.confirm({
    //     message: "WARNING! This will perminetly delete " + selectedCompanyName + " from the database! Are you sure you'd like to delete " + selectedCompanyName + "?",
    //     callback: function(value) {
    //         if (value) {
    //             // firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + '/' + currentQuarter+'/dsi').off("value");
    //             // firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + '/' + currentQuarter+'/dso').off("value");
    //             // firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + '/' + currentQuarter+'/dpo').off("value");
    //             // firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + '/' + currentQuarter+'/cashCycle').off("value");

    //             console.log('Successfully destroyed the planet.');
    //             // Delete all of the Selected Company's Stuff:
    //             firebase.database().ref('company-description-data/' + companySelectionKey).remove().then(function() {
    //                 console.log("Remove succeeded.");
    //             }).catch(function(error) {
    //                 // alert("Error Message: " + error.message);
    //                 // console.log("Remove failed: " + error.message);

    //             });
    //             firebase.database().ref('health-score-data/' + companySelectionKey).remove().then(function() {

    //             }).catch(function(error) {

    //             });
    //             firebase.database().ref('formal-accounting-data/' + companySelectionKey).remove().then(function() {

    //             }).catch(function(error) {

    //             });
    //             firebase.database().ref('sector-data/' + companySelectionKey).remove().then(function() {

    //             }).catch(function(error) {

    //             });
    //             firebase.database().ref('data-you-want/' + companySelectionKey).remove().then(function() {

    //             }).catch(function(error) {

    //             });
    //             firebase.database().ref('users/' + currentUserID + '/linked-companies/' + companySelectionKey).remove().then(function() {
    //                 console.log("Remove succeeded.");
    //                 $.prompt("It's gone!");
    //             }).catch(function(error) {
    //                 alert("Error Message: " + error.message);
    //                 console.log("Remove failed: " + error.message);
    //             });


    //             generateCompanyList();


    //         } else {
    //             console.log('Woof');
    //         }
    //     }
    // });
}

// Delete a Health Score from the Database
function removePastData() {
    var removePastDataDialog = {
        state0: {
            title: 'WARNING! This will perminetely delete financial data. To continue enter Quarter and Year:',
            html: '<label><strong>QUARTER:</strong> <input style="width: 100px;" name="qNum" type="number" min="1" max="4" placeholder="Quarter Number 1-4" required /></label><br />' +
                '<label><strong>YEAR:</strong> <input style="width: 100px;" name="yearNum" type="number" min="1980" max="2400" placeholder="Year e.g. 2008" required /></label><br />',
            buttons: { 'Cancel': -1, 'Remove Data': 1 },
            //focus: "input[name='fname']",
            submit: function(e, v, m, f) {
                if (v == 1) {
                    var qData = f.qNum + "-" + f.yearNum;

                    firebase.database().ref('health-score-data/' + companySelectionKey + "/" + qData).remove().then(function() {
                        $.prompt("Remove Successful! Refresh Company Now.");
                        console.log("Remove succeeded.");
                    }).catch(function(error) {
                        alert("Error Message: " + error.message);
                        console.log("Remove failed: " + error.message);
                    });
                    firebase.database().ref().child('formal-accounting-data/' + companySelectionKey + "/" + qData).remove().then(function() {
                        // $.prompt("Remove Successful! Refresh Company Now.");
                        console.log("FAD Remove succeeded.");
                    }).catch(function(error) {
                        // alert("Error Message: " + error.message);
                        console.log("Remove failed: " + error.message);
                    });
                    firebase.database().ref().child('data-you-want/' + companySelectionKey + "/" + qData).remove().then(function() {
                        // $.prompt("Remove Successful! Refresh Company Now.");
                        console.log("DYW Remove succeeded.");
                    }).catch(function(error) {
                        // alert("Error Message: " + error.message);
                        console.log("Remove failed: " + error.message);
                    });
                    firebase.database().ref().child('sector-data/' + companySelectionKey + "/" + qData).remove().then(function() {
                        // $.prompt("Remove Successful! Refresh Company Now.");
                        console.log("SECT Remove succeeded.");
                    }).catch(function(error) {
                        // alert("Error Message: " + error.message);
                        console.log("Remove failed: " + error.message);
                    });
                } else if (v == -1) {
                    $.prompt.close();
                }

                // e.preventDefault();
            }
        }
    };

    $.prompt(removePastDataDialog);
}

// Remove a Company from your WatchList
function removeFromWatchList() {
    var removeFromWatchlistDialog = {
        state0: {
            // title: 'WARNING! This will perminetely delete financial data. To continue enter Quarter and Year:',
            html: "<label style='font-size:15px;'>Are you sure you'd like to remove <strong>" + selectedCompanyName + "</strong> from your WatchList?",
            buttons: { 'Cancel': -1, 'Remove': 1 },
            //focus: "input[name='fname']",
            submit: function(e, v, m, f) {
                if (v == 1) {
                    console.log('Successfully destroyed the planet.');
                    firebase.database().ref('users/' + currentUserID + "/linked-companies/" + companySelectionKey).remove().then(function() {
                        console.log("Remove succeeded.");
                        generateCompanyList();
                    }).catch(function(error) {
                        alert("Error Message: " + error.message);
                        console.log("Remove failed: " + error.message);
                    });
                } else if (v == -1) {
                    $.prompt.close();
                }

                // e.preventDefault();
            }
        }
    };

    $.prompt(removeFromWatchlistDialog);
}







/**
 * CHECK USER TYPE
 */
function whatUserTypeAreYou() {
    var compNumArray = [];
    var ref = firebase.database().ref('users/' + currentUserID + '/type');
    var compNum = firebase.database().ref('users/' + currentUserID + '/linked-companies').once("value", function(num) {
        compNumArray.push(num.key);
    });
    ref.once('value')
        .then(function(snapshot) {
            if (snapshot.val() == 'Investor') {
                document.getElementById('userTypeMenuLabel').innerHTML = 'Investor/VC';
                $("#allDataInputsCard").hide();
                $("#hlthScoreRatioEditButton").hide();
                $("#hlthScoreRatioEditButton2").hide();
                $("#dywChanEditButton").hide();
                $("#dywChartEditButton").hide();
                $("#aVlChartEditButton").hide();
                $("#sectorDataEditButton").hide();
                $("#compDesEditButton").hide();
                $("#blankCompanyButton").hide();
                // $("#pastHSdataPointButton").hide();
                // $("#removePastHSdataButton").hide();
                $("#deleteCompanyButton").hide();
                $("#fadBalanceEditButton").hide();
                $("#fadIncomeEditButton").hide();
                $("#fadCashFlowEditButton").hide();
                setTimeout(function() {
                    investorTour();
                }, 500);
            } else if (snapshot.val() == 'Entrepreneur') {
                document.getElementById('userTypeMenuLabel').innerHTML = 'Entrepreneur';
                if (compNumArray.length > 20) {
                    $("#addCompanyButton").hide();
                    $("#addCompanyButtonMain").hide();
                    $("#blankCompanyButton").hide();
                }
                setTimeout(function() {
                    accntntTour();
                }, 500);
            } else if (snapshot.val() == 'Accountant') {
                document.getElementById('userTypeMenuLabel').innerHTML = 'Financial Professoinal';

                setTimeout(function() {
                    accntntTour();
                }, 500);
            }
        });
}


/**
 *  INTRO TOUR AREA
 */
function tourAgain() {
    var ref = firebase.database().ref('users/' + currentUserID + '/type');

    ref.once('value')
        .then(function(snapshot) {
            if (snapshot.val() == 'Investor') {
                investorTour();

            } else if (snapshot.val() == 'Entrepreneur') {
                accntntTour();

            } else if (snapshot.val() == 'Accountant') {
                accntntTour();

            }
        });

}

function investorTour() {

    var visited = $.cookie("visited");

    if (visited == null) {
        /**
         * Impromptu stuff goes here!!!
         */
        var tourSubmitFunc = function(e, v, m, f) {
                if (v === -1) {
                    $.prompt.prevState();
                    return false;
                } else if (v === 1) {
                    $.prompt.nextState();
                    return false;
                } else if (v === 2) {
                    $.prompt.close();
                    linkEmUp();
                }
            },
            tourStates = [{
                    title: 'Welcome to WatchTower!',
                    html: "We get it! Finance is a complicated beast. But WatchTower helps you tame that beast!<br><br> Our platform allows you to <strong>keep watch</strong> over your Startups (if you're an investor), manage the financial activity of various Companies (if you're a financial professional), or show off your financial health (if you're an entreprenuer).<br><br><strong>Note:</strong> You can restart the tutorial if you got lost or closed out. Just look for the question mark in the menu.",
                    buttons: { Next: 1 },
                    focus: 0,
                    // position: { container: 'h1', x: 200, y: 60, width: 200, arrow: 'bl' },
                    submit: tourSubmitFunc
                },
                {
                    title: 'An Investor? Fancy!',
                    html: "Keeping up with all your companies is a daunting task. We get it!<br><br>Have your companies register on WatchTower, add their Company Key to your WatchList and keep track of their finances.",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#currentHlthScoreLabel', x: 300, y: 30, width: 300, arrow: 'lt' },
                    submit: tourSubmitFunc
                },
                {
                    title: 'Alright, this sounds confusing...',
                    html: "That's okay! Our platform is designed for ease of use! Just enter data 'line-by-line' from your financial documents!<br> Here's a short walkthrough: <br><br><strong>First:</strong> Add Company via the menu at the top right (three dots) or the WatchList icon (left).<br><br><strong>Second:</strong> Select Company from the WatchList to view current financial health.<br><br>",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#currentHlthScoreLabel', x: 300, y: 30, width: 300, arrow: 'lt' },
                    submit: tourSubmitFunc
                },

                // {
                //     title: 'Register/Select Company - Enter that sweet Data!',
                //     html: "<strong>First:</strong> Create/Add Company via the menu at the top right (three dots).<br><br><strong>Second:</strong> Select Company which appears under WatchTower logo (on the top left).<br><br><strong>Third:</strong> Look for the pencil at top right of each card where financial data is required. And by the way, if you're the Company's Admin check out the input card located at the bottom. It's pretty nifty.",
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#currentHlthScoreLabel', x: 300, y: 30, width: 300, arrow: 'lt' },
                //     submit: tourSubmitFunc
                // },
                {
                    title: 'The Special Sauce',
                    html: "WatchTower's <strong>Health Score</strong> is the 'special sauce' that brings it all together - Our proprietary financial index consists of 4 core financial ratios which are boiled down into one easy number.",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#currentHlthScoreLabel', x: 285, y: 0, width: 400, arrow: 'lt' },
                    submit: tourSubmitFunc
                },
                // {
                //     title: "Core Ratios",
                //     html: 'Four core ratios assess resource sufficiency, operating income/loss, financial assets and debt.<br><br><strong> Primary Reserve:</strong>  Measure the financial strength of your company through comparison of expendable net assets to total expenses.<br><strong> Viability:</strong>  The availability of expendable net assets to repay debt within the balance sheet date.<br><strong>Return on Net Assets:</strong>  Measures total economic return relative to the previous quarter.<br><strong> Net Operating Revenue:</strong> Indicates whether total operational activities resulted in a surplus or a deficit.',
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#healthScoreGraphCard', x: 30, y: -390, width: 400, arrow: 'bl' },
                //     submit: tourSubmitFunc
                // },
                {
                    title: "Tick Tock",
                    html: "Don't lose track of time! Currently, WatchTower utilizes a hard calendar dating system. Quarters end at midnight. <br><br>We've added a countdown (top left) until the next quarter begins so you dont lose track. Select which financial period you'd like to view with the date dropdown.",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#quarterCountdown', x: -160, y: 40, width: 400, arrow: 'tc' },
                    submit: tourSubmitFunc
                },
                // {
                //     title: 'Add/Create Company (and more)',
                //     html: "<strong>Menu Button (three dots):</strong> These options will vary based on which company (if any) you have selected and your user type.",
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#menuAndCompanyAddStuff', x: -420, y: 10, width: 400, arrow: '' },
                //     submit: tourSubmitFunc
                // },
                // {
                //     title: 'WatchList',
                //     html: 'The health score is displayed for the companies you add/create.<br> Just wait, there are all kinds of companies out there to watch!',
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#companyListNavPannel', x: 240, y: 100, width: 400, arrow: 'lt' },
                //     submit: tourSubmitFunc
                // },
                // {
                //     title: "Y = mx + b",
                //     html: "Yeah, rememebr slope intercept formula from high school? Us, too... <br><br>All charts are implemented via the Charts.js open-source library. They're interactive, so don't be shy!<br><br><strong>Note:</strong> Toggle (hide/show) data items by clicking the top rectangle adjacent to the item name. The chart colors are randomly generated on each new selection so click away!",
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#webChartCard', x: 50, y: -235, width: 400, arrow: 'bl' },
                //     submit: tourSubmitFunc
                // },
                {
                    title: "That's it!",
                    html: "We truly hope you enjoy using our product. If you have questions, please don't hesitate to contact us. A link to the glossary is attached to the bottom in case some of the terms need an explanation.<br><br><strong>Keep Watch</strong>",
                    buttons: { Done: 2 },
                    focus: 0,
                    // position: { container: '.ebook', x: 370, y: 120, width: 275, arrow: 'lt' },
                    submit: tourSubmitFunc
                }
            ];
        $.prompt(tourStates);
        // alert($.cookie("visited"));


    }
    // set cookie
    $.cookie('visited', 'yes', { expires: 1, path: '/' });

}

function accntntTour() {

    var visited = $.cookie("visited");

    if (visited == null) {
        /**
         * Impromptu stuff goes here!!!
         */
        var tourSubmitFunc = function(e, v, m, f) {
                if (v === -1) {
                    $.prompt.prevState();
                    return false;
                } else if (v === 1) {
                    $.prompt.nextState();
                    return false;
                } else if (v === 2) {
                    $.prompt.close();
                    createBlankCompany();
                }
            },
            tourStates = [{
                    title: 'Welcome to WatchTower!',
                    html: "We get it! Finance is a complicated beast. But WatchTower helps you tame that beast!<br><br> Our platform allows you to <strong>keep watch</strong> over your Startups (if you're an investor), manage the financial activity of various Companies (if you're a financial professional), or show off your financial health (if you're an entreprenuer).<br><br><strong>Note:</strong> You can restart the tutorial if you got lost or closed out. Just look for the question mark in the menu.",
                    buttons: { Next: 1 },
                    focus: 0,
                    // position: { container: 'h1', x: 200, y: 60, width: 200, arrow: 'bl' },
                    submit: tourSubmitFunc
                },
                {
                    title: 'Alright, this sounds confusing...',
                    html: "That's okay! Our platform is designed for ease of use! Just enter data 'line-by-line' from your financial documents!<br> Here's a short walkthrough: <br><br><strong>First:</strong> Create/Add Company via the menu at the top right (three dots). Company key is attached to the Admin Control Pannel - bottom of page.<br><br><strong>Second:</strong> Select Company from the WatchList (left).<br><br><strong>Third (if you're the admin):</strong> Look for the pencil at the top right of cards which require financial data input. All data inputs are on the Admin Control Pannel as well.",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#currentHlthScoreLabel', x: 300, y: 30, width: 300, arrow: 'lt' },
                    submit: tourSubmitFunc
                },
                // {
                //     title: 'Register/Select Company - Enter that sweet Data!',
                //     html: "<strong>First:</strong> Create/Add Company via the menu at the top right (three dots).<br><br><strong>Second:</strong> Select Company which appears under WatchTower logo (on the top left).<br><br><strong>Third:</strong> Look for the pencil at top right of each card where financial data is required. And by the way, if you're the Company's Admin check out the input card located at the bottom. It's pretty nifty.",
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#currentHlthScoreLabel', x: 300, y: 30, width: 300, arrow: 'lt' },
                //     submit: tourSubmitFunc
                // },
                {
                    title: 'The Special Sauce',
                    html: "WatchTower's <strong>Health Score</strong> is the 'special sauce' that brings it all together - Our proprietary financial index consists of 4 core financial ratios which are boiled down into one easy number.",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#currentHlthScoreLabel', x: 285, y: 0, width: 400, arrow: 'lt' },
                    submit: tourSubmitFunc
                },
                // {
                //     title: "Core Ratios",
                //     html: 'Four core ratios assess resource sufficiency, operating income/loss, financial assets and debt.<br><br><strong> Primary Reserve:</strong>  Measure the financial strength of your company through comparison of expendable net assets to total expenses.<br><strong> Viability:</strong>  The availability of expendable net assets to repay debt within the balance sheet date.<br><strong>Return on Net Assets:</strong>  Measures total economic return relative to the previous quarter.<br><strong> Net Operating Revenue:</strong> Indicates whether total operational activities resulted in a surplus or a deficit.',
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#healthScoreGraphCard', x: 30, y: -390, width: 400, arrow: 'bl' },
                //     submit: tourSubmitFunc
                // },
                {
                    title: "Tick Tock",
                    html: "Don't lose track of time! Currently, WatchTower utilizes a hard calendar dating system. Quarters end at midnight. <br><br>We've added a countdown (top left) until the next quarter begins so you dont lose track. Select which financial period you'd like to view with the date dropdown.",
                    buttons: { Prev: -1, Next: 1 },
                    focus: 1,
                    // position: { container: '#quarterCountdown', x: -160, y: 40, width: 400, arrow: 'tc' },
                    submit: tourSubmitFunc
                },
                // {
                //     title: 'Add/Create Company (and more)',
                //     html: "<strong>Menu Button (three dots):</strong> These options will vary based on which company (if any) you have selected and your user type.",
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#menuAndCompanyAddStuff', x: -420, y: 10, width: 400, arrow: '' },
                //     submit: tourSubmitFunc
                // },
                // {
                //     title: 'WatchList',
                //     html: 'The health score is displayed for the companies you add/create.<br> Just wait, there are all kinds of companies out there to watch!',
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#companyListNavPannel', x: 240, y: 100, width: 400, arrow: 'lt' },
                //     submit: tourSubmitFunc
                // },
                // {
                //     title: "Y = mx + b",
                //     html: "Yeah, rememebr slope intercept formula from high school? Us, too... <br><br>All charts are implemented via the Charts.js open-source library. They're interactive, so don't be shy!<br><br><strong>Note:</strong> Toggle (hide/show) data items by clicking the top rectangle adjacent to the item name. The chart colors are randomly generated on each new selection so click away!",
                //     buttons: { Prev: -1, Next: 1 },
                //     focus: 1,
                //     // position: { container: '#webChartCard', x: 50, y: -235, width: 400, arrow: 'bl' },
                //     submit: tourSubmitFunc
                // },
                {
                    title: "That's it!",
                    html: "We truly hope you enjoy using our product. If you have questions, please don't hesitate to contact us. A link to the glossary is attached to the bottom in case some of the terms need an explanation.<br><br> Next, you will be asked to register a Company with WatchTower.<br><br><strong>Keep Watch</strong>",
                    buttons: { Done: 2 },
                    focus: 0,
                    // position: { container: '.ebook', x: 370, y: 120, width: 275, arrow: 'lt' },
                    submit: tourSubmitFunc
                }
            ];
        $.prompt(tourStates);
        // alert($.cookie("visited"));


    }
    // set cookie
    $.cookie('visited', 'yes', { expires: 1, path: '/' });
}




/**
 *  INITIALIZE THE APP
 */
function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            if (true) { //!emailVerified
            }
        } else {
            // User is signed out.
            window.location = 'login.html';
        }
        currentUserID = firebase.auth().currentUser.uid;
        whatUserTypeAreYou();
        generateCompanyList();
        // calculateHScomponents();
        // calculateHealthScore();
        // HSchange();
        // nextQuarterData();
        document.getElementById('userEmailAddressLabel').innerHTML = firebase.auth().currentUser.email;

        setTimeout(function() {
            var compListItem = document.getElementsByClassName('companyNavItem');
            if (compListItem.length > 0) {
                displayCompanyData(compListItem[0].click());
            } else {
                console.log('No Companies!');
            }
        }, 1500);





        // setTimeout(function() {
        //     logOut();
        // }, 6000000);



    });
    // [END authstatelistener]



}

document.addEventListener("DOMContentLoaded", function(event) {
    // document.addEventListener('touchstart', onTouchStart, {passive: true});

    var clipboard = new Clipboard('.copyButton');
    clipboard.on('success', function(e) {
        console.log(e);
    });
    clipboard.on('error', function(e) {
        console.log(e);
    });

    //do work
    $("#modeToggleButton").hide();
    $("#hlthScoreRatioEditButton2").hide();
    $("#ALLcomponentsEditButton").hide();
    $("#dywChartEditButton").hide();
    $("#aVlChartEditButton").hide();
    $("#sectorDataEditButton").hide();
    $("#compDesEditButton").hide();
    // $("#pastHSdataPointButton").hide();
    // $("#removePastHSdataButton").hide();
    $("#deleteCompanyButton").hide();
    $("#removeFromWatchListButton").hide();
    $("#dywChanEditButton").hide();
    $("#sectorDataEditButton").hide();
    $("#aVlDisplayEditButton").hide();
    $("#fadBalanceEditButton").hide();
    $("#fadIncomeEditButton").hide();
    $("#fadCashFlowEditButton").hide();
    $("#allDataInputsCard").hide();



    // testChart();
    // hideOnScroll();

    quarterCountdown();
    initApp();


    // var layout = document.querySelector('.mdl-layout');
    // layout.MaterialLayout.toggleDrawer();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('js/sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }


    self.addEventListener('install', function(event) {
        // Perform install steps
        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
        );
    });
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
        );
    });
    self.addEventListener('activate', function(event) {

        var cacheWhitelist = ['my-site-cache-v1'];

        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });
})



/**
 * DOWNLOAD SCANS [DEPRECIATED]
 */
/*function downloadScan() {
    var BSstorageRef = firebase.storage().ref('scans-data/' + companySelectionKey + '/' + currentQuarter + '/balanceSheet-' + currentQuarter);
    BSstorageRef.getDownloadURL().then(function(url) {
        console.log(url);
        $("#BSscanButton").attr("href", url);
    }).catch(function(err) {
        // alert("Nothing There...");
    });
    var ISstorageRef = firebase.storage().ref('scans-data/' + companySelectionKey + '/' + currentQuarter + '/incomeStatement-' + currentQuarter);
    ISstorageRef.getDownloadURL().then(function(url) {
        console.log(url);
        $("#ISscanButton").attr("href", url);
    }).catch(function(err) {
        // alert("Nothing There...");
    });
    var CFstorageRef = firebase.storage().ref('scans-data/' + companySelectionKey + '/' + currentQuarter + '/cashFlows-' + currentQuarter);
    CFstorageRef.getDownloadURL().then(function(url) {
        console.log(url);
        $("#CFSscanButton").attr("href", url);
    }).catch(function(err) {
        // alert("Nothing There...");
    });
}*/