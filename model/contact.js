const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pass: {
        type: String
    }
});


module.exports = Contact;