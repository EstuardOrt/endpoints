const express = require('express');
const router = express.Router();
const queries = require('../queries/queries');

router.get('/genres/movie-count', queries.cantidadPeliculasPorGenero);
router.get('/directors/average-imdb-rating', queries.promedioCalificacionIMDbPorDirector);
router.get('/movies/:movieId/comments/count', queries.totalComentariosPorPelicula);
router.get('/movies/year/:year', queries.peliculasPorAnio);
router.get('/actors/most-frequent/:genre', queries.actoresFrecuentesPorGenero);
router.get('/movies/top-rotten-tomatoes/:genre', queries.top5PeliculasPorGenero);
router.get('/movies/top-awards/:genre', queries.peliculasMasPremiosPorGenero);
router.get('/genres/average-duration', queries.promedioDuracionPorGenero);
router.get('/genres/latest-movie', queries.peliculaMasRecientePorGenero);
router.get('/directors/top/:n', queries.topNDirectoresPorPeliculas);

module.exports = router;
