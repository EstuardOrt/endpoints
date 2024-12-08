const Pelicula = require('../models/Pelicula');
const mongoose = require('mongoose');

// Cantidad de Películas por Género
const cantidadPeliculasPorGenero = async (req, res) => {
  try {
    const resultados = await Pelicula.aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres", count: { $sum: 1 } } },
    ]);
    const respuesta = {};
    resultados.forEach(({ _id, count }) => {
      respuesta[_id] = count;
    });
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Promedio de Calificación IMDb por Director
const promedioCalificacionIMDbPorDirector = async (req, res) => {
  try {
    const resultados = await Pelicula.aggregate([
      { $unwind: "$directors" },
      { $group: { _id: "$directors", average_imdb: { $avg: "$imdb.rating" } } },
      { $sort: { average_imdb: -1 } },
    ]);

    const respuesta = {};
    resultados.forEach(({ _id, average_imdb }) => {

      respuesta[_id] = average_imdb != null ? parseFloat(average_imdb.toFixed(1)) : null;
    });

    res.json(respuesta);
  } catch (error) {
    console.error('Error en promedioCalificacionIMDbPorDirector:', error.message);
    res.status(500).json({ error: 'Error al obtener datos', detalles: error.message });
  }
};


// Número Total de Comentarios por Película
const totalComentariosPorPelicula = async (req, res) => {
  const { movieId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: 'El ID proporcionado no es válido' });
  }

  try {
    const pelicula = await Pelicula.findById(new mongoose.Types.ObjectId(movieId), {
      _id: 1,
      num_mflix_comments: 1,
    });

    console.log('Película obtenida:', pelicula); 

    if (!pelicula) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    const commentsCount = pelicula.num_mflix_comments !== undefined ? pelicula.num_mflix_comments : 0;

    console.log('Número de comentarios:', commentsCount); 

    res.json({ movieId, commentsCount });
  } catch (error) {
    console.error('Error en totalComentariosPorPelicula:', error.message);
    res.status(500).json({ error: 'Error al obtener datos', detalles: error.message });
  }
};




// Lista de Películas Lanzadas en un Año Específico
const peliculasPorAnio = async (req, res) => {
  const { year } = req.params;
  try {
    const peliculas = await Pelicula.aggregate([
      { $match: { year: parseInt(year) } },
      { $project: { title: 1, genres: 1, directors: 1, "imdb.rating": 1, _id: 0 } },
    ]);
    res.json({ year: parseInt(year), movies: peliculas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actores Más Frecuentes en Películas por Género
const actoresFrecuentesPorGenero = async (req, res) => {
  const { genre } = req.params;
  try {
    const resultados = await Pelicula.aggregate([
      { $match: { genres: genre } },
      { $unwind: "$cast" },
      { $group: { _id: "$cast", moviesCount: { $sum: 1 } } },
      { $sort: { moviesCount: -1 } },
    ]);
    res.json({ genre, actors: resultados });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Top 5 Películas por Calificaciones de Espectadores en Rotten Tomatoes por Género
const top5PeliculasPorGenero = async (req, res) => {
  const { genre } = req.params;
  try {
    const peliculas = await Pelicula.aggregate([
      { $match: { genres: genre, "tomatoes.viewer.rating": { $exists: true } } },
      { $sort: { "tomatoes.viewer.rating": -1 } },
      { $limit: 5 },
      { $project: { title: 1, "tomatoes.viewer.rating": 1, _id: 0 } },
    ]);
    res.json({ genre, topMovies: peliculas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Películas con Más Premios Ganados por Género
const peliculasMasPremiosPorGenero = async (req, res) => {
  const { genre } = req.params;
  try {
    const peliculas = await Pelicula.aggregate([
      { $match: { genres: genre, "awards.wins": { $exists: true } } },
      { $sort: { "awards.wins": -1 } },
      { $limit: 5 },
      { $project: { title: 1, "awards.wins": 1, _id: 0 } },
    ]);
    res.json({ genre, topMovies: peliculas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Promedio de Duración de Películas por Género
const promedioDuracionPorGenero = async (req, res) => {
  try {
    const resultados = await Pelicula.aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres", average_duration: { $avg: "$runtime" } } },
    ]);
    const respuesta = {};
    resultados.forEach(({ _id, average_duration }) => {
      respuesta[_id] = parseFloat(average_duration.toFixed(1));
    });
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Película Más Reciente por Cada Género
const peliculaMasRecientePorGenero = async (req, res) => {
  try {
    // Obtener géneros únicos
    const generos = await Pelicula.distinct("genres");
    console.log("Géneros encontrados:", generos); 

    const respuesta = {};

    for (const genero of generos) {
      console.log(`Procesando género: ${genero}`); 

      // Buscar la película más reciente para cada género
      const pelicula = await Pelicula.findOne({ genres: genero })
        .sort({ released: -1 })
        .select({ title: 1, year: 1, released: 1 });

      console.log(`Película encontrada para género ${genero}:`, pelicula); 

      if (pelicula) {
        respuesta[genero] = {
          title: pelicula.title || "No title",
          releaseYear: pelicula.year || "No release year",
        };
      } else {
        respuesta[genero] = null; 
      }
    }

    res.json(respuesta);
  } catch (error) {
    console.error("Error en peliculaMasRecientePorGenero:", error.message);
    res.status(500).json({ error: "Error al obtener datos", detalles: error.message });
  }
};




// Top N Directores por Número de Películas
const topNDirectoresPorPeliculas = async (req, res) => {
  const { n } = req.params;
  try {
    const directores = await Pelicula.aggregate([
      { $unwind: "$directors" },
      { $group: { _id: "$directors", moviesCount: { $sum: 1 } } },
      { $sort: { moviesCount: -1 } },
      { $limit: parseInt(n) },
    ]);
    res.json({ topDirectors: directores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  cantidadPeliculasPorGenero,
  promedioCalificacionIMDbPorDirector,
  totalComentariosPorPelicula,
  peliculasPorAnio,
  actoresFrecuentesPorGenero,
  top5PeliculasPorGenero,
  peliculasMasPremiosPorGenero,
  promedioDuracionPorGenero,
  peliculaMasRecientePorGenero,
  topNDirectoresPorPeliculas,
};
