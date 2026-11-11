const menu = document.querySelector("#menu");
const nav = document.querySelector(".links");

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    nav.classList.toggle('active');
}

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    console.log("Submitting form...");
    console.log({
        name,
        email,
        message
    });

    formStatus.textContent = "Sending...";

    try {
        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, 
                email,
                message
            })     
        });

        const data = await response.json();

        if(data.success) {
            formStatus.textContent = "Message sent successfully!";
            contactForm.reset();
        } else {
            formStatus.textContent = "Something went wrong.";
        }

    } catch (error) {
        console.error("Error:", error);
        formStatus.textContent = "Unable to connect to the server.";
    }
});