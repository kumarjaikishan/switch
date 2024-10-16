const mongo = require('mongoose');

const switchschema = new mongo.Schema({
    status: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true })



const switche = new mongo.model("switch", switchschema);
module.exports = switche;