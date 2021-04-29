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
        //TODO: Checking exp+dataset replica in dataset
        //TODO: How to determine the image names? 
        //  Everytime a document inserted we should traverse all
        //  through the collection?
        req.files.sort(function(a, b){
            let name_a = a["originalname"];
            let name_b = b["originalname"];
            if (name_a > name_b) return 1;
            if (name_a < name_b) return -1;
            return 0;
            }
        )
        //console.log(req.files);
        let file_paths = new Array();
        let img_names = new Array();
        req.files.map(file => file_paths.push(file["path"]));
        res.status(200).json(
            {"dataset_name": req.body["dataset_name"], 
             "img_file_paths": file_paths,
             "exp_name": req.body["exp_name"], 
             "img_names": img_names,
            }
        );
    }
)

app.listen(port, function(){});