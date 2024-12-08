const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://demoortiz1:vgAUM3ZAddQH0PCt@clusterep2.kjr0h.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=ClusterEP2', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
