//const ModelFilm = require('../models/Film');
//const ModelComment = require('../models/Comment');
//const api = require('../libs/general-api');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const axios = require('axios');
const weather = 'https://www.metaweather.com/api/location/';



class WeatherController {

    constructor() {
    }

    async getWeather(req, res, next) {
    try{
        const weather_url1 = weather + 'search/?query=Istanbul';
        const weather_response1 = await fetch(weather_url1);
        const weather_data1 = await weather_response1.json();

        const weather_url2 = weather + 'search/?query=Berlin';
        const weather_response2 = await fetch(weather_url2);
        const weather_data2 = await weather_response2.json();

        const weather_url3 = weather + 'search/?query=London';
        const weather_response3= await fetch(weather_url3);
        const weather_data3 = await weather_response3.json();

        const weather_url4 = weather + 'search/?query=Helsinki';
        const weather_response4= await fetch(weather_url4);
        const weather_data4 = await weather_response4.json();

        const weather_url5 = weather + 'search/?query=Dublin';
        const weather_response5= await fetch(weather_url5);
        const weather_data5 = await weather_response5.json();

        const weather_url6 = weather + 'search/?query=Vancouver';
        const weather_response6= await fetch(weather_url6);
        const weather_data6 = await weather_response6.json();


        const result = {
            Istambul: weather_data1,
            Berlin: weather_data2,
            London: weather_data3,
            Helsinki: weather_data4,
            Dublin: weather_data5,
            Vancouver: weather_data6
        };

        res.json(result);
    } catch(err){
        res.status(500).json({
            error: err
        });
      }
    }
    

    async getCoordinates(req, res, next) {
        console.log("in route");
    try{
        const latlon = req.query.latlon.split(',');
        console.log(latlon);
        const lat = latlon[0];
        const lon = latlon[1];
        console.log(lat, lon);
        const weather_url6 = weather + 'search/?lattlong=' + lat + ',' + lon;
        const weather_response6 = await fetch(weather_url6);
        const weather_data6 = await weather_response6.json();

        const result2 = {
            data: weather_data6,
          };

        res.json(result2);
        } catch(err){
            res.status(500).json({
                error: err
            });
      }
    }
    
}
module.exports = WeatherController;
