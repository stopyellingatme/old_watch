function checkPasswordMatch() {
    let user = firebase.auth().currentUser;
    let userEmail = document.getElementById('email_login').value;
    let password = document.getElementById('currentPassword').value;
    let confirmPassword = document.getElementById('newPassword').value;
    let newPassword = document.getElementById('confirmNewPassword').value;
    const credential = firebase.auth.EmailAuthProvider.credential(
    userEmail, 
    password
    );


    firebase.auth().signInWithEmailAndPassword(userEmail, password).then(() => {
        if (newPassword == confirmPassword) {
            firebase.auth().currentUser.updatePassword(newPassword).then(function() {
                alert('Succesfully changed your password!');
                setTimeout(function() {
                    window.location = 'login.html';
                }, 1000);
            }, function(error) {
                alert(error);
                console.log(error);
            });
            } else {
            alert('Something went wrong.');
        }
    }).catch(error => {
        alert('Error Message: '+error);
    });
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
            // window.location = 'login.html';
        }
        // currentUser = firebase.auth().currentUser;
        // document.getElementById("welcomeLabel").innerHTML = "<strong>Welcome, </strong> " + currentUser.email;
        // document.getElementById("userIDLabel").innerHTML = "<strong>User ID:</strong> " + currentUser.uid;
        


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