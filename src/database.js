const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {})
.then(db => console.log('Database working'))
.catch(err => console.error(err))