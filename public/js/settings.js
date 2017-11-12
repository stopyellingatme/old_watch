let currentUser;



/**
 * LOG-OUT FUNCTION 
 */
function logOut() {
    firebase.auth().signOut();
    // console.log('Well... i hope the user got logged out...');
    // window.location = 'login.html';
}
/**
 * CHANGE PASSWORD
 */
function checkPasswordMatch() {
    var password = document.getElementById('currentPassInput').value;
    var confirmPassword = document.getElementById('currentPassInputConfirm').value;
    var newPassword = document.getElementById('newPassInput').value;


    if (newPassword == confirmPassword) {
        firebase.auth().currentUser.updatePassword(newPassword).then(function() {
            alert('Succesfully changed your password!');
        }, function(error) {
            alert(error);
            console.log(error);
        });
    } else {
        alert('Something went wrong.');
    }
}

/**
 * DELETE ACCOUNT
 */

function deleteAccount() {
    $.prompt("Take a second...", {
        title: "Think about it.",
        buttons: { "Yes, Delete Me": true, "No, Lets Not!": false },
        submit: function(e, v, m, f) {
            // use e.preventDefault() to prevent closing when needed or return false.
            // e.preventDefault();

            if (v == true) {
                currentUser.delete().then(function() {
                    alert("Your account has been removed from WatchTower. You will now be redirected to PayPal's unsubscribe page. If you are subscribed via ChargeBee, you will have to go to their website or check your last email invoice.");
                    window.location = "https://www.paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=SGGGX43FAKKXN&switch_classic=true";
                }, function(error) {
                    // An error happened.
                });
            } else {
                console.log('Didnt even delete himself');
                // window.location = "https://www.paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=SGGGX43FAKKXN&switch_classic=true";
            }
        }
    });


}
function areYouSure(){
    $("#deleteAccountButton").toggle();
}

function changeAccountType() {
    $.prompt("We do not allow you to change your account type at this time. Currently, you must delete your account, then open a new one with the appropriate user type. We are sorry for the inconvenience.");
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
        currentUser = firebase.auth().currentUser;
        document.getElementById("userEmailLabel").innerHTML = "<strong>Email:</strong> " + currentUser.email;
        document.getElementById("userIDLabel").innerHTML = "<strong>User ID:</strong> " + currentUser.uid;
        firebase.database().ref("users/"+currentUser.uid+"/type").once("value", function(snap) {
            if (snap.val() == "Accountant"){
                document.getElementById("userTypeLabel").innerHTML = "<strong>User Type:</strong> You're a <strong>Financial Professional</strong>! Probably know your way around a calculator, huh?";
            }
            else if(snap.val() == "Entrepreneur"){
                document.getElementById("userTypeLabel").innerHTML = "<strong>User Type:</strong> You're an <strong>Entrepreneur</strong>! Tougher than a two dollar steak, am i right?";
            }
            else if(snap.val() == "Investor"){
                document.getElementById("userTypeLabel").innerHTML = "<strong>User Type:</strong> You're an <strong>Investor</strong>! I mean, it's better than buring that money i guess.";
            }
        });


        setTimeout(function() {
            logOut();
        }, 5000000);


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