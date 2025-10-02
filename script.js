let notif = new Notification("test");

notif.onerror = (e) => {
    console.log("error");
    let toast = document.createElement(HTMLDivElement);
    toast.style = "position: fixed; bottom: 20px; right: 20px; z-index: 1000;";
    toast.innerHTML = `<p>${message}</p>`;
};

notif.onshow = (e) => {
    console.log("show");
};
