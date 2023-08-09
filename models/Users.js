var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: String
});

module.exports = mongoose.model('UsersInfo', UsersSchema);