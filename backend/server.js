const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

app.get("/", (req, res) => {
    res.json({ 
        message: "Portfolio API is running" 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;

    console.log("New contact submission:");
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    res.json({
        success: true,
        message: "Your message has been received!"
    });
});

