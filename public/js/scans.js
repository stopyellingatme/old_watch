 var companySelectionKey,
     selectedCompanyName,
     currentHealthScore,
     currentYear = moment().format("YYYY"),
     currentQuarter = moment().format("Q-YYYY"),
     justTheQ = moment().format("Q"),
     currentUserID;


 function genScanList() {
     $(document).ready(function() {
         var ref = firebase.database().ref("users/" + currentUserID + "/linked-companies").on("child_added", function(snapshot) {
             console.log(snapshot.key);
             firebase.database().ref('company-description-data/' + snapshot.key + '/name').once("value").then(function(snap) {
                 firebase.database().ref('health-score-data/' + snapshot.key + "/" + currentQuarter).once("value").then(function(hlthSnap) {
                     $("#scansNav").append('<a id="' + snapshot.key + '" class="mdl-navigation__link" style="color: #00051e; font-size: 15px;"  onclick="$(document).ready(displayCompanyData(event))"><strong id="' + snapshot.key + '">' + snap.val() + '</strong><br>Health: ' + Number(hlthSnap.child('/HealthScore').val()).toFixed(2) + '</a>');
                 });
             });
             firebase.database().ref('company-description-data/' + snapshot.key + '/name').off('value', ref);
         });
         // ref.off();
     });
 }


 function addScan() {

     var statesdemo = {
         state0: {
             title: 'Scan Upload',
             html: '<br><label>Financial Document: <select name="DocType" required>' +
                 '<option value="balanceSheet" selected>Balance Sheet</option>' +
                 '<option value="incomeStatement">Income Statement</option>' +
                 '<option value="cashFlows" selected>Cash Flows</option>' +
                 '</select></label><br>' +
                 '<input type="file" value="upload" name="scanUploadButton" id="scanUploadButton"><br>' +
                 '<br><input name="qNum" type="number" min="1" max="4" placeholder="Q" required /><br>' +
                 '<input name="yearNum" type="number" min="1999" max="' + currentYear + '" placeholder="Year e.g. 2008" required />',
             focus: 0,
             buttons: { "Yes, I'm Ready": true, "No, Lets Wait": false },
             submit: function(e, v, m, f) {
                 e.preventDefault();
                 if (v == true) {
                     var getFile = document.getElementById('scanUploadButton');
                     var file = getFile.files[0];
                     var qData = f.qNum + "-" + f.yearNum;
                     var storageRef = firebase.storage().ref('scans-data/' + companySelectionKey + '/' + qData + '/' + f.DocType + '-' + qData);
                     var task = storageRef.put(file);
                     task.on('state_changed',
                         function progress(snapshot) {

                         },
                         function error(err) {
                             console.log(err);
                         },
                         function complete() {
                             window.alert('The upload completed!');
                             $.prompt.close();
                         }
                     );

                 } else {
                     $.prompt.close();
                 }
             }
         },

     };
     $.prompt(statesdemo);

 }


 function displayCompanyData(event) {
     $(document).ready(function() {
         document.getElementById('scanListArea').innerHTML = "";
         companySelectionKey = event.target.id;
         var key = event.target.id;
         /**
          * CHEKCS TO SEE IF YOU ARE THE COMPANY ADMINISTRATOR
          */
         firebase.database().ref('company-description-data/' + event.target.id).once('value').then(function(snap) {
             $("#compNameLabel").html(snap.child('/name').val());
             /**
              * CHEKCS TO SEE IF YOU ARE THE COMPANY ADMINISTRATOR
              */
             //  console.log(snap.child('/admin').val());

             if (currentUserID == snap.child('/admin').val()) {
                 $("#addScanButton").show();
                 $("#addScanButtonMain").show();

             } else {
                 $("#addScanButton").hide();
                 $("#addScanButtonMain").hide();
             }
         });

         /**
          * Use 'for loop' to iterate through all quarters and years since 2000. Then, if they match append the paragraph with a link to the non-null downloadURL
          */
         var qArray = [];
         for (i = 1999; currentYear >= i; i++) {
             for (j = 1; 4 >= j; j++) {
                 var qData = j + "-" + i;
                 qArray.push(qData);
             }
         }

         setTimeout(function() {
             for (i = 0; qArray.length > i; i++) {
                 showAllScans(qArray[i]);
             }
         }, 250);


     });
 }
 /**
  *[END] DISPLAY COMPANY WHEN CLICKED [END]
  */

 function showAllScans(q) {
     var qDate = q;
     setTimeout(function() {
         firebase.storage().ref('scans-data/' + companySelectionKey + '/' + qDate + '/balanceSheet-' + qDate).getDownloadURL().then(function(url) {
             //  console.log(qDate);
             $("#scanListArea").append("<br><a href='" + url + "'>" + qDate + " - Balance Sheet </a><br>");
         }).catch(function(err) {
             console.log("Nothing Here...");
         });
         firebase.storage().ref('scans-data/' + companySelectionKey + '/' + qDate + '/incomeStatement-' + qDate).getDownloadURL().then(function(url) {
             //  console.log(url);
             $("#scanListArea").append("<br><a href='" + url + "'>" + qDate + " - Income Statement </a><br>");
         }).catch(function(err) {
             console.log("Nothing Here...");
         });
         firebase.storage().ref('scans-data/' + companySelectionKey + '/' + qDate + '/cashFlows-' + qDate).getDownloadURL().then(function(url) {
             //  console.log(url);
             $("#scanListArea").append("<br><a href='" + url + "'>" + qDate + " - Cash Flows Statement </a><br>");
         }).catch(function(err) {
             console.log("Nothing Here...");
         });
     }, 100);
 }


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
         genScanList();


     });
     // [END authstatelistener]
 }

 $(document).ready(function() {
     //do work

     initApp();


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

 });