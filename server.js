'use strict'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const data = require('./Movie Data/data.json')
const PORT = process.env.PORT
const server = express();


server.use(cors());
server.get('/', handelGet)
server.get('/favorite', handleGetFavorite)
server.get('/trending', handleTrending)
server.get('/search', handelSearch)
server.use('*', handleNotFound)
server.use(handleServerErorr)

function Data(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Trending(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview
}




let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`
let newurl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2`

function handelGet(req, res) {

    let obj = new Data(data.title, data.poster_path, data.overview)

    return res.status(200).json(obj);
}


function handleTrending(req, res) {

    axios.get(url)
        .then((tren) => {
            // console.log(tren.data.results);

            let trends = tren.data.results.map(trend => {
                return new Trending(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
            });
            res.status(200).json(trends);


        }).catch((err) => {

        })



}
function handelSearch(req, res) {

    axios.get(newurl)
        .then((ren) => {
            // console.log(ren.data.results);

            let searchs = ren.data.results.map(search =>{
                return new Trending(search.id,search.title,search.release_date,search.poster_path,search.overview);
            });
            res.status(200).json(searchs);  


        }).catch((err) => {

        })
}



function handleGetFavorite(req, res) {
    return res.status(200).send("Welcome to Favorite Page")
}

function handleServerErorr(error, req, res) {
    const err = { status: 500, message: error }
    res.status(500).send(err)

}

function handleNotFound(req, res) {

    return res.status(404).send("page not found error")

}
server.listen(PORT, () => {
    console.log(`listen to port ${PORT}`);

})
