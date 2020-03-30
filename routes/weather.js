const express = require('express');
const router = express.Router();
const WeatherController = require('../controllers/WeatherController');
const weatherController = new WeatherController();



router.get('/weather',weatherController.getWeather.bind(weatherController));
router.get('/weather/coordinates',weatherController.getCoordinates.bind(weatherController),function (req, res){
	console.log("test");
});
router.get('/weather/get_woeid',weatherController.getWoeId.bind(weatherController),function (req, res){
	console.log("test");
});
// router.get(
//     '/api/films',
//     filmController.index.bind(filmController));
// router.get(
//     '/api/films/getAll',
//     filmController.getAll.bind(filmController));

// router.post(
//     '/api/films/add',
//     uploader.uploadUserImage('photo', {
//         customFileName: "film_pic",
//         path: "/films",
//         overideFileName: true
//     }),
//     filmController.addFilm.bind(filmController));

// router.get(
//     '/api/films/del/:id',
//     filmController.delete.bind(filmController));
    
// router.get(
//     '/api/films/get/:id',
//     filmController.get.bind(filmController));

// router.post(
//     '/api/films/update',
//     auth.isAuthorized,
//     filmController.updateFilm.bind(filmController));

// router.get(
//     '/api/films/slug/:slug',
//     filmController.getFilmSlug.bind(filmController));

// router.post(
//     '/api/films/comment',
//     auth.isAuthorized,
//     filmController.addComment.bind(filmController));



module.exports = router;
