/**
 * Handles the sign up button press.
 */
function writeNewUserStuffToDB() {
    var email = document.getElementById('email_register').value;
    var password = document.getElementById('password_register_confirm').value;
    var passwordInit = document.getElementById('password_register').value;

    if (password == passwordInit) {
        var promise = firebase.auth().createUserWithEmailAndPassword(email, passwordInit);
        promise
            .then(user => signUpDBHelper(email, "Investor", (user.uid)))
            // .then(user => {(window.location = 'main.html')})
            .catch(e => alert("Error: "+e));
    } else {
        console.log("Not gonna let you through...");
    }
}

function signUpDBHelper(email, type, uid) {
    // Create References and push email and type to DB.
    var dbRefObject = firebase.database().ref().child('users/' + uid);
    dbRefObject.set({
        'email': email,
        'type': type
    });
    firebase.database().ref().child('users/' + uid + '/linked-companies/-KmCywWCZrV5pBv2CR6n').set(true);
    // firebase.database().ref().child('users/' + uid + '/linked-companies/-KmCi0m8cV0F0adILFz4').set(true);
    // firebase.database().ref().child('users/' + uid + '/linked-companies/-KmCf4jJ8UHvpg-8ha2l').set(true);
    // firebase.database().ref().child('users/' + uid + '/linked-companies/-KjtG0F0t5ToBFgbD0l8').set(true);
    setTimeout(function() {
        sendEmailVerification();
    }, 1000);


}

function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        console.log('Email Verification Sent!');

        // [END_EXCLUDE]
        setTimeout(function() {
            window.location = "login.html";
        }, 800);
    });
    // [END sendemailverification]

}




function IsTermChecked() {
    if (!$("input:checkbox").is(":checked")) {
        $("#checkTheBoxLabel").show();

    } else
        $("#checkTheBoxLabel").hide();

}


document.addEventListener("DOMContentLoaded", function(event) {
    //do work
    // document.getElementById('signupButton').addEventListener('click', function() {
    //     writeNewUserStuffToDB();
    // });
    var form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        if (!$("input:checkbox").is(":checked")) {
            $("#checkTheBoxLabel").show();

        } else {
            $("#checkTheBoxLabel").hide();
            writeNewUserStuffToDB();
        }

        event.preventDefault();
    });

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


    // document.getElementById('email_login').onkeydown = function (e) {
    //     if (e.keyCode == 13) {
    //         // submit
    //         signIn();
    //     }



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