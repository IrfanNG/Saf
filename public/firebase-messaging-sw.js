importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBcJm_x6hnrWdhW50JqAZXkW7_yOSYo8Fc",
    authDomain: "saf-mosque-community-pwa.firebaseapp.com",
    projectId: "saf-mosque-community-pwa",
    storageBucket: "saf-mosque-community-pwa.firebasestorage.app",
    messagingSenderId: "817451590426",
    appId: "1:817451590426:web:978d2bc8e426ecc1bec2a3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
