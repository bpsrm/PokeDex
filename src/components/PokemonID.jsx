import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

//bootstrap
import { Container, Row, Col } from "react-bootstrap";

//colors
import { textColors, bgColors, statColors } from "../assets/color";

PokemonID.propTypes = {
  pokemon: PropTypes.string,
};

export default function PokemonID({ pokemon }) {
  // const [pokemonID, setPokemonID] = useState("");
  // const [evolution, setEvolution] = useState();
  // const [formEvolution, setFormEvolution] = useState([]);
  const [bucket, setBucket] = useState([]);
  const [types, setTypes] = useState();
  const [abilities, setAbilities] = useState([]);
  const [stats, setStats] = useState([]);
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
          // console.log(response);
          setBucket(response.data);
          setTypes(response.data.types);
          setAbilities(response.data.abilities);
          setStats(response.data.stats);
          // setPokemonID(response.data.id);

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

    const fetchEvolution = async () => {
      // try {
      //   const response = await axios.get("");
      // } catch (err) {
      //   console.log("error fetching pokemon evolutions: " + err);
      // }
    };

    fetchPokemonData();
    fetchEvolution();
  }, [pokemon]);

  const pokemonCard = {
    padding: "20px",
    backgroundColor: "var(--white)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {isLoading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {pokemon && (
                <div style={pokemonCard}>
                  <div className="w-100 d-flex align-items-center justify-content-center">
                    <img
                      src={bucket?.sprites?.other?.showdown?.front_default}
                      alt={bucket.name}
                      width={100}
                      height={100}
                      className="p-2"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="pokemon-info">
                    <span style={{ fontSize: "12px", color: "var(--dark)" }}>
                      N°{bucket.id}
                    </span>
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
                  <div>
                    <div className="proportion-box">
                      <h6>Height </h6>
                      <p>0.{bucket?.height}m</p>
                    </div>
                    <div className="proportion-box">
                      <h6>Weight </h6>
                      <p>{bucket?.weight}kg</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4>Abilities </h4>
                    <div className="d-flex w-100 justify-content-evenly">
                      {abilities.map((ability, index) => (
                        <div className="proportion-box my-2" key={index}>
                          <p>{ability?.ability?.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Row className="justify-content-center">
                    <h4 className="text-center">Stats</h4>

                    {stats.map((stat, index) => (
                      <Col xs={8} key={index} className="stats-box mt-3">
                        <span
                          style={{
                            backgroundColor: statColors[stat?.stat?.name],
                            color: "var(--white)",
                          }}
                        >
                          {stat?.stat?.name === "attack"
                            ? "ATK"
                            : stat?.stat?.name === "hp"
                            ? "HP"
                            : stat?.stat?.name === "defense"
                            ? "DEF"
                            : stat?.stat?.name === "special-defense"
                            ? "spD"
                            : stat?.stat?.name === "special-attack"
                            ? "spA"
                            : stat?.stat?.name === "speed"
                            ? "SPEED"
                            : stat?.stat?.name}
                        </span>
                        <p className="mb-0">{stat?.base_stat}</p>
                      </Col>
                    ))}
                    <div className="col-8 stats-box mt-3">
                      <span
                        style={{
                          backgroundColor: statColors.total,
                          color: "var(--white)",
                        }}
                      >
                        Total
                      </span>
                      <p className="mb-0">
                        {stats.reduce(
                          (total, stat) => total + (stat?.base_stat || 0),
                          0
                        )}
                      </p>
                    </div>
                  </Row>
                  <Row className="mt-3">
                    <h4 className="text-center">Evolution</h4>
                  </Row>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
