import express from 'express';

// Serve on PORT on Heroku and on localhost:5000 locally
const PORT = process.env.PORT || '5000';
const app = express();

// Serve the two static assets
app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }));
app.listen(PORT, () => console.log("Server started!"));
