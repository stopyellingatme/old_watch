// function investorSubscribe(){

//     var myForm = document.getElementById('checkout-form');

//     var customer = braintree.client.create()




//     braintree.setup('production_7p32fnpx_83ddfgbz68w3rhvn', 'dropin', {
//         container: 'dropin-container',
//         form: 'checkout-form',
//         onPaymentMethodReceived: function (obj) {
//             // Do some logic in here.
//             // When you're ready to submit the form:
//             myForm.submit();
//         },
//         onError: function (obj) {
//             if (obj.type == 'VALIDATION') {
//             // Validation errors contain an array of error field objects:
//             console.log(obj.details.invalidFields);

//             } else if (obj.type == 'SERVER') {
//             // If the customer's browser cannot connect to Braintree:
//             obj.message; // "Connection error"

//             // If the credit card failed verification:
//             obj.message; // "Credit card is invalid"
//             obj.details; // Object with error-specific information
//             }
//         }
//     });

// }























document.addEventListener("DOMContentLoaded", function (event) {




    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('js/sw.js').then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }


    self.addEventListener('install', function (event) {
        // Perform install steps
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    console.log('Opened cache');
                    return cache.addAll(urlsToCache);
                })
        );
    });
    self.addEventListener('fetch', function (event) {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
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
                        function (response) {
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
                                .then(function (cache) {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        }
                    );
                })
        );
    });
    self.addEventListener('activate', function (event) {

        var cacheWhitelist = ['my-site-cache-v1'];

        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });



});


