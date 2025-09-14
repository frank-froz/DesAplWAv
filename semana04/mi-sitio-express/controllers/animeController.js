// Array para almacenar animes en memoria
let animes = [
  {
    id: 1,
    titulo: "Attack on Titan",
    genero: "Acción",
    episodios: 75,
    año: 2013,
    estudio: "Studio Pierrot",
    calificacion: 9.0,
    imagen: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  {
    id: 2,
    titulo: "Demon Slayer",
    genero: "Sobrenatural",
    episodios: 32,
    año: 2019,
    estudio: "Ufotable",
    calificacion: 8.7,
    imagen: "https://m.media-amazon.com/images/M/MV5BMWU1OGEwNmQtNGM3MS00YTYyLThmYmMtN2FjYzQzNzNmNTE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  }
];

let nextId = 3;

const animeController = {
  // Mostrar la página principal de animes
  index: (req, res) => {
    res.render('animes/index', { animes });
  },

  // Mostrar formulario para crear nuevo anime
  create: (req, res) => {
    res.render('animes/create');
  },

  // Procesar el formulario y guardar nuevo anime
  store: (req, res) => {
    const { titulo, genero, episodios, año, estudio, calificacion, imagen } = req.body;
    
    const nuevoAnime = {
      id: nextId++,
      titulo: titulo.trim(),
      genero: genero.trim(),
      episodios: parseInt(episodios),
      año: parseInt(año),
      estudio: estudio.trim(),
      calificacion: parseFloat(calificacion),
      imagen: imagen.trim() || "https://via.placeholder.com/300x400/6c5ce7/ffffff?text=No+Image"
    };

    animes.push(nuevoAnime);
    res.redirect('/animes');
  },

  // Eliminar anime
  delete: (req, res) => {
    const id = parseInt(req.params.id);
    animes = animes.filter(anime => anime.id !== id);
    res.redirect('/animes');
  }
};

module.exports = animeController;