require('dotenv').config({path: require('path').join(__dirname, '.env')});

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT ||3000;

app.use(express.json({limit: '10kb'}));

//serve the portfolio frontend
app.use(express.static(path.join(__dirname, '../')));

//check the backend is running
app.get("/api/status", (req, res) => {
    res.json({
        message: "Portfolio API is running"
    });
});

//process contact form submissions
app.post("/api/contact", async (req, res) => {

    const { name, email, message } = req.body || {};

    //validate submitted info
    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof message !== 'string' ||
        !name.trim() ||
        !email.trim() ||
        !message.trim() ||
        name.length > 100 ||
        email.length > 100 ||
        message.length > 5000
    ) {
        return res.status(400).json({
            sucess: false,
            message: "Please provide valid contact information."
        });
    }

    const emailAddress = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    //check environment variables
    if (
        !process.env.RESEND_API_KEY ||
        !process.env.CONTACT_EMAIL ||
        !process.env.RESEND_FROM_EMAIL
    ) {
        console.error("Missing email environment variables.");

        return res.status(500).json({
            success: false,
            message: "Email service is not configured."
        });
    }

    try {
        //load resend SDK
        const { Resend } = await import('resend');

        const resend = new Resend(process.env.RESEND_API_KEY);

        //send the email
        const {data, error} = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: [process.env.CONTACT_EMAIL],
            replyTo: emailAddress,
            subject: `New Portfolio Contact: ${name.trim()}`,
            text: `
New Contact Submission!


Name: ${name.trim()} 
Email: ${emailAddress}
Message: ${message.trim()}
`
        });
        if (error) {
            console.error("Resend error:", error);

            return res.status(502).json({
                success: false,
                message: "Email delivery failed. Please try again."
            });
        }

        console.log("Email successfully sent:", data.id);

        return res.json({
            success: true,
            message: "Your message has been sent!"
        });
    } catch (error) {
        console.error("Email sending error:", error);

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred."
        });
    }
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});