const express = require("express");
var multer  = require('multer')

var upload = multer({ dest: 'uploads/' })
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

app.post('/upload/exp_images', upload.any(),
    function(req, res){
        console.log(req.files);
        console.log(req.body);
        res.sendStatus(200);
    }
)

app.listen(port, function(){});