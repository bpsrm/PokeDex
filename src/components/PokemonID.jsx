import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

//colors
import { textColors, bgColors } from "../assets/color";

PokemonID.propTypes = {
  pokemon: PropTypes.string,
};

export default function PokemonID({ pokemon }) {
  const [bucket, setBucket] = useState([]);
  const [types, setTypes] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (!pokemon) {
      setBucket([]);
      setTypes(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchPokemonData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        );
        if (response.status === 200) {
          setBucket(response.data);
          setTypes(response.data.types);
          setIsLoading(false);
          return response.data.name;
        } else {
          setError("Error: Pokémon not found!");
        }
      } catch (err) {
        setError("Error fetching Pokémon data: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemon]);

  return (
    <div className="pokemon-card position-relative mt-4">
      {isLoading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <img
            src={bucket?.sprites?.front_default}
            alt={bucket.name}
            className="pokemon-source"
          />
          <div className="pokemon-info">
            <span style={{ fontSize: "12px" }}>N°{bucket.id}</span>
            <h5 className="text-capitalize">{bucket.name}</h5>
          </div>
          <div className="ability-box">
            {types?.map((type, index) => (
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
        </>
      )}
    </div>
  );
}
