const w1252 = require('./w1252.js');
const buffer = w1252.encode('Paçoca');
const string = w1252.decode(buffer);
