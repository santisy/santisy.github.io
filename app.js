const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 8080;

const file_root = path.resolve("../materials");

// Static midware
app.use(express.static(file_root));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(port, function(){});