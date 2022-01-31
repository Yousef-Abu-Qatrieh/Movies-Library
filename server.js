'use strict'
const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json')

const server = express();
server.use(cors());
server.get('/', handelGet)
server.get('/favorite', handleGetFavorite)
server.get('*',handleServerErorr)
server.get('*', handleNotFound)






function handelGet(req, res) {



    return res.status(200).json(data);
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