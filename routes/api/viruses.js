var express = require('express');
var router = express.Router();

var Virus = require('../../db/Virus');
var Citation = require('../../db/Citation');

// Retrieve all virus records
router.get('/', function(req, res, next) {
    Virus.getAllViruses(function(err, retrievedViruses) {
        if (err) {
            console.error(err);
            res.json({success: false, msg: `Error occurred: ${err}`});
        }
        else {
            res.json({success: true, data: retrievedViruses});
            console.log("Retrieved Records: ", retrievedViruses);
        }
    })
});

// Retrieve a virus record by ID
router.get('/:id', function(req, res, next) {
    var virus_id = req.params.id;
    Virus.getVirusByID(virus_id, function(err, retrievedVirus) {
        if (err) {
            console.error(err);
            res.json({success: false, msg: `Error occurred: ${err}`});
        }
        else {
            res.json({success: true, data: retrievedVirus});
            console.log("Retrieved Record: ", retrievedVirus);
        }
    })
});

// Insert a new virus record 
router.post('/', function(req, res, next) {
    var body = JSON.parse(JSON.stringify(req.body)),
        species_name = body.species_name,
        discoveries = body.entries;
    
    console.log(`Received = `, body);

    var record = new Virus();
        record.species_name = species_name;
        record.discoveries = discoveries;
    
    // record.discoveries = record.discoveries.map(ele => {
    //     var citation = {};
    //     citation.author = "Me, Goh";
    //     citation.pub_year = "1960";
    //     ele.citation = citation;
    //     return ele;
    // });

    record.save(function(err, saved_record) {
        if (err) {
            console.error(err);
            res.json({success: false, msg: `Error occurred: ${err}`});
        }
        else {
            res.json({success: true, data: saved_record});
            console.log("Retrieved Record: ", saved_record);
        }
    })
   
});

module.exports = router;