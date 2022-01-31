'use strict'
const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json')

const server = express();
server.use(cors());
server.get('/', handelGet)
server.get('/favorite', handleGetFavorite)
// server.get('*',handleServerErorr)
server.get('*', handleNotFound)


function Data (title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}



function handelGet(req, res) {

let obj=new Data(data.title,data.poster_path,data.overview)

    return res.status(200).json(obj);
}

function handleGetFavorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page")
}

function handleServerErorr(err, req, res, next) {

    return res.status(500).send("Sorry, something went wrong")

}

function handleNotFound(req, res) {

    return res.status(404).send("page not found error")

}


server.listen(3000, () => {
    console.log("my server is run on port 3000")



})