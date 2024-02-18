import { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Container, Row, Col } from "react-bootstrap";
import PokemonList from "./components/PokemonList";
import PokemonID from "./components/PokemonID";

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState("");

  useEffect(() => {
    const fetchInitialPokemon = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12`
        );
        const { results, count } = response.data;
        const totalPages = Math.ceil(count / 12);
        setTotalPages(totalPages);
        setPokemonList(results);
      } catch (error) {
        console.error("Error fetching initial Pokémon:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (search == "") {
      setSearch("");
      setPokemonData("");
    }

    fetchInitialPokemon();
  }, [search, pokemonData]);

  const handleSearch = (searchTerm) => {
    search.length > 0 ? setPokemonData(searchTerm) : setPokemonData("");
  };

  const handleLoadMore = async () => {
    if (currentPage < totalPages) {
      setIsLoading(true);

      try {
        const nextPage = currentPage + 1;
        const offset = (nextPage - 1) * 12;

        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=12`
        );
        const { results } = response.data;

        setPokemonList([...pokemonList, ...results]);
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Error loading more Pokémon:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("No more Pokémon to load.");
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col xs={12} md={10} lg={12}>
          <div
            className="search-group mb-3 p-3 position-sticky"
            style={{ zIndex: "10", top: "5px" }}
          >
            <input
              type="text"
              className="search-input text-lowercase"
              placeholder="Find your Pokémon..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button
              className="btn-settings search-btn"
              onClick={() => handleSearch(search)}
            >
              <Icon icon="tabler:search" width={24} height={24} />
            </button>
          </div>

          <h1>PokéDex</h1>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="pokemon-grid">
              {search.length == 0 && pokemonList.length > 0 ? (
                <div>
                  <div className="pokemon-grid">
                    {pokemonList.map((pokemon, index) => (
                      <PokemonList key={index} pokemon={pokemon} />
                    ))}
                  </div>
                  <button
                    className="btn-settings load-more mt-3 w-100"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                </div>
              ) : (
                <PokemonID pokemon={pokemonData} />
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
