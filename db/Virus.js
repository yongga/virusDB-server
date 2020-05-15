var mongoose = require('mongoose');
var schema = mongoose.Schema;
var Citation = require('./Citation');

var virusSchema = new schema({
    species_name: { type: String, unique: true, required: true },
    discoveries: [{
        country: { type: String, required: true },
        date_found: { type: String, required: true },
        citation: { 
            author: { type: String, required: true },
            pub_year: { type: String, required: true },
        },
    }]
},
    { timestamps: true },
    { toObject: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
});

// Retrieve all virus records
virusSchema.statics.getAllViruses = function(cb) {
    var query = {};
    return this.find(query, cb).lean()
                .populate('citations', '-_id')
                .toJSON;
}

// Retrieve a virus record by ID
virusSchema.statics.getVirusByID = function(virus_id, cb) {
    var query = {_id: virus_id };
    return this.findById(query, cb)
                .populate('citations', '-_id')
                .toJSON;
}

// Retrieve a virus record by keyword search
virusSchema.statics.getVirusByKeyword = function(virus_id, cb) {
    var query = {_id: virus_id };
    return this.findById(query, cb)
                .populate('citations')
                .toJSON;
}

// Check if the virus exists before saving
virusSchema.pre('save', async function(doc, next) {
    console.log(`This is the to-be-saved doc \n`, doc);

    var existingSpecies = this.model.findOne({'species_name': doc.species_name});

    console.log(`Found existing species %s with %d records`, existingSpecies.species_name, existingSpecies.discoveries.length);
});


// export Virus.js as a user db model
// 1st arg: explicit virus model name
// 3rd arg: explicit collection title
module.exports = mongoose.model('Virus', virusSchema, 'viruses');
