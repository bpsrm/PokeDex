import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

//colors
import { textColors, bgColors } from "../assets/color";

export default function PokemonList({ pokemon }) {
  const [pokemonBucket, setPokemonBucket] = useState([]);
  const [typesBucket, setTypesBucket] = useState([]);

  const pokemonData = async () => {
    const url = pokemon.url;
    const response = await axios.get(url);
    setPokemonBucket(response.data);
    setTypesBucket(response.data.types);
  };

  useEffect(() => {
    pokemonData();
  });

  return (
    <div className="pokemon-card position-relative mt-4" key={pokemon.name}>
      <img
        src={pokemonBucket.sprites?.front_default}
        alt={pokemon.name}
        className="pokemon-source"
      />
      <div className="pokemon-info">
        <span style={{ fontSize: "12px", color: "var(--dark)" }}>
          N°{pokemonBucket.id}
        </span>
        <h5 className="text-capitalize">{pokemon.name}</h5>
      </div>
      <div className="ability-box">
        {typesBucket.map((type, index) => (
          <div key={index}>
            <p
              className="types-box"
              style={{
                backgroundColor: bgColors[type.type.name],
                color: textColors[type.type.name],
              }}
            >
              {type.type.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
PokemonList.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};
