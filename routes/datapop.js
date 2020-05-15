var express = require('express');
var router = express.Router();
const Virus = require('../db/Virus');

const fs = require('fs');
const csvParser = require('csv-parser');
const excelParser = require('exceljs');

const csvFile = 'D:/Programming Projects/VirusDB/ParasiteRecords.xlsx';

const REGEX_BRCK = /\(|\)/gi;

router.get('/test', function(req, res, next) {
    Virus.find(function(err, doc) {
        console.log(doc.length);
    })
});

// Retrieve all virus records
router.get('/', async function(req, res, next) {

    var workbook =  new excelParser.Workbook();
    await workbook.xlsx.readFile(csvFile);
    
    var worksheet = workbook.getWorksheet(1);

    let dataList = [];

    var curr_species = "";

    worksheet.eachRow(function (row, rowNum) {
        if (rowNum == 1) 
            return;

        let species = {
            'species_name': curr_species,
            'discoveries': [],
        };

        // if species not the same as previous, create a species object
        if (curr_species != row.getCell(1).text.trim()) {
            curr_species = row.getCell(1).text.trim();
            species['species_name'] = curr_species.trim();
            species['discoveries'] = [];
        }
        
        let author_yr = row.getCell(4).text.trim();
        // split by semi-colon to get each ref
        let refs = author_yr.toString().split(';');

        // if (rowNum == 2) {
            for(var i=0;i<refs.length;i++) {
                const repl_txt = refs[i].replace(REGEX_BRCK, '').trim().toString();

                // add current row's data to curr_row object
                let curr_row = {};
                curr_row['country'] = row.getCell(2).text.trim();
                curr_row['date_found'] = row.getCell(3).text.trim();

                curr_row['citation'] = {
                    'pub_year': repl_txt.split(',').length < 2 ? 
                        repl_txt.split(',')[0].toString().trim() : repl_txt.split(',')[1].toString().trim(),
                    'author': repl_txt.split(',').length < 2 ? 
                        refs[0].split(',')[0].toString().trim() : repl_txt.split(',')[0].toString().trim(),
                };
                
                // add new discovery into the species list reference
                species['discoveries'].push(curr_row);
            }
        // }
        
        dataList.push(species);
        
    });
    console.log(`Data size = %d \n ${JSON.stringify(dataList)}`, dataList.length);

    dataList.forEach(function(value, index){
        // var value = dataList[0];
        var query = { species_name: value.species_name };
        var update = { $addToSet: { discoveries: value.discoveries } };
        Virus.findOneAndUpdate(query, update, {useFindAndModify: false, new: true, upsert: true}, function(err, doc) {
            if (err) {
                console.error(`DB Error: ${err}`);
    
                const msg = {"Success": false, "Error": err};
    
                res.json(msg);
            }
            else {
                console.log(`Data populated: `, doc);
            }
        });
    });
    



});

module.exports = router;