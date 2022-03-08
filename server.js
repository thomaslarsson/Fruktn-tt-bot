import express from 'express';

const PORT = process.env.PORT || '5000';
const app = express();

// Use the public folder
app.use(express.static('public'));
app.listen(PORT, () => console.log("Server started!"));
