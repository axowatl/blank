let notif = new Notification("test");

notif.onerror = (e) => {
    console.log("error");
};

notif.onshow = (e) => {
    console.log("show");
};
