import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [tipos, setTipos] = useState([]);

  const traduccionesTipos = {
    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"
  };

  useEffect(() => {
    const cargarPokemones = async () => {
      const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const datos = await respuesta.json();

      const detalles = await Promise.all(
        datos.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      setPokemones(detalles);
    };

    const cargarTipos = async () => {
      const respuesta = await fetch('https://pokeapi.co/api/v2/type');
      const datos = await respuesta.json();
      setTipos(datos.results.map(tipo => tipo.name));
    };

    cargarPokemones();
    cargarTipos();
  }, []);

  const pokemonesFiltrados = pokemones.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroTipo === '' || p.types.some(t => t.type.name === filtroTipo))
  );

  return (
    <div className="app">
      <h1 className="titulo">Pokédex</h1>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>{traduccionesTipos[tipo]}</option>
          ))}
        </select>
      </div>

      <div className="galeria">
        {pokemonesFiltrados.map((pokemon) => (
          <div key={pokemon.id} className="tarjeta">
            <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p><strong>Tipo:</strong> {pokemon.types.map(t => (
              <span key={t.type.name} className={`tipo ${t.type.name}`}>
                {traduccionesTipos[t.type.name]}
              </span>
            ))}</p>
            <p><strong>HP:</strong> {pokemon.stats[0].base_stat}</p>
            <p><strong>Ataque:</strong> {pokemon.stats[1].base_stat}</p>
            <p><strong>Defensa:</strong> {pokemon.stats[2].base_stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


