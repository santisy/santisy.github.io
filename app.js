const express = require("express");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/mainStore', {useNewUrlParser: true, useUnifiedTopology: true});
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

const ExpScheme = new mongoose.Schema({'exp_name': String, 'img_paths': [String]});
const DatasetScheme = new mongoose.Schema({ 'dataset_name': String, 'exps': [ExpScheme]}); 

app.post('/upload/exp_images', upload.any(),
    function(req, res){
        //TODO: Checking exp+dataset replica in dataset
        //TODO: How to determine the image names? 
        //  Everytime a document inserted we should traverse all
        //  through the collection?
        let user_name = req.body["user_name"];
        let dataset_name = req.body["dataset_name"];
        let exp_name = req.body["exp_name"];
        const model = mongoose.model(user_name, DatasetScheme);

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
        let img_names = new Array(); // Find the most common one or any other skills?
        req.files.map(file => file_paths.push(file["path"]));

        const new_exp = new ExpScheme({'exp_name': exp_name, 'img_paths': file_paths});
        // After pre-processing, we start to update the dataset
        model.updateOne({'dataset_name': dataset_name}, 
            {"$push": { "exps": new_exp} },
            function (err, raw) {
                if (err) return handleError(err);
                console.log('The raw response from Mongo was ', raw);
            }
        );
        model.findOne({ 'dataset_name': dataset_name, 'exps.exp_name': exp_name}, 
            'name occupation', 
            function (err, x) {
            if (err) return handleError(err);

            // update an existing dataset with a new exp
            // TODO: Then update an array value
            
        });

        res.status(200).json(
            {"dataset_name": dataset_name, 
             "img_file_paths": file_paths,
             "exp_name": exp_name, 
             "img_names": img_names,
            }
        );
    }
)

app.listen(port, function(){});