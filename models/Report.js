const mongoose  = require("mongoose");

const ReportSchema = new mongoose.Schema({
        reportKey: {
            type: String,
            required: true,
            unique: true,
        },
        subject: {
            type: String,
            required: true,
        },
        incidentDate: {
            type: Date,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        categories: {
            type: Array,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        file:{
            type:String, 
            required: false,
        },
    }, 
    {timestamps: true}
);

module.exports = mongoose.model("Report", ReportSchema);