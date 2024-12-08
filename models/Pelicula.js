const mongoose = require('mongoose');


const PeliculaSchema = new mongoose.Schema(
    {
      num_mflix_comments: { type: Number }, 
      title: { type: String }, 
      year: { type: Number }, 
      released: { type: Date }, 
      genres: { type: [String] }
    },
    { collection: 'movies' }
  );

module.exports = mongoose.model('Pelicula', PeliculaSchema);
