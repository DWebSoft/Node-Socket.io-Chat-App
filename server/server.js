const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

//create app
var app = express();

//setup static midddleware
app.use(express.static(publicPath));

//create server
app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
})