const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please write a title for your event"]
    },
    start: {
        type: Date,
        required: [true, "Please insert the start of your event"],
        min: [new Date(), "Start date can't be in the past!"]
    },
    end: {
        type: Date,
        required: true,
        min: [
            function() {
                const date = new Date(this.start);
                const validDate = new Date(date.setHours(date.getHours() + 1)); // Ensure end time is at least 1 hour ahead of start
                return validDate;
            },
            "Event end must be at least one hour ahead of the start time"
        ],
        default: function() {
            const date = new Date(this.start);
            return new Date(date.setDate(date.getDate() + 1)); // Default end date is 1 day after start
        }
    },
    describe: {
        type: String,
        default: "No description"
    },
    
    client: {
        type: String,  // Correction ici : 'string' => 'String'
        required: true
    },
    participant: {
        type: String,  // Correction ici : 'string' => 'String'
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
