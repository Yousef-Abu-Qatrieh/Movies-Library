'use strict'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const pg = require('pg');
const data = require('./Movie Data/data.json')
const PORT = process.env.PORT
const server = express();
const client = new pg.Client(process.env.DATABASE_URL)


server.use(cors());
server.use(express.json())
server.get('/', handelGet)
server.get('/favorite', handleGetFavorite)
server.get('/trending', handleTrending)
server.get('/search', handelSearch)
server.post('/addMovie', addMovieHandler)
server.get('/getMovies', handleGetMovies)
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
            handleServerErorr(error,req,res)

        })



}
function handelSearch(req, res) {

    axios.get(newurl)
        .then((ren) => {
            // console.log(ren.data.results);

            let searchs = ren.data.results.map(search => {
                return new Trending(search.id, search.title, search.release_date, search.poster_path, search.overview);
            });
            res.status(200).json(searchs);


        }).catch((err) => {
            handleServerErorr(error,req,res)

        })
}

function addMovieHandler(req,res){
    const movie = req.body;
       console.log(movie)
      let sql = `INSERT INTO movies(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
      let values=[movie.title,movie.release_date,movie.poster_path,movie.overview];
      client.query(sql,values).then(data =>{
          res.status(200).json(data.rows);
      }).catch(error=>{
        handleServerErorr(error,req,res)
      });


}
function handleGetMovies(req,res){
    let sql = `SELECT * FROM movies;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        handleServerErorr(error,req,res)
    });
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

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listining to port ${PORT}`)
    })
})