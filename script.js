const OriginalNotification = window.Notification;

function createToast(message) {
    // Create the main container if it doesn't exist
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    `;
        document.body.appendChild(container);
    }

    // Create the toast element
    const toast = document.createElement("div");
    toast.style.cssText = `
    display: flex;
    align-items: center;
    background-color: #333;
    color: white;
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  `;
    toast.innerHTML = `<p style="margin: 0; padding: 0;">${message}</p>`;

    // Append the new toast and animate it in
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);

    // Automatically remove the toast after a few seconds with an exit animation
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        // Wait for the exit transition to finish before removing the element
        setTimeout(() => {
            toast.remove();
            // Remove container if it becomes empty
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 3000);
}

window.Notification = function (...args) {
    // Create the new notification instance using the original constructor
    const newNotification = new OriginalNotification(...args);

    // Attach your global error handler to the new instance
    newNotification.addEventListener('error', (e) => {
        createToast(args[0]);
    });

    // Return the new instance
    return newNotification;
};
