import React from "react";
import { render } from "react-dom";
import Results from "./Results";
import Details from "./Details";
import { Router, Link } from "@reach/router";
import SearchParams from "./SearchParams";
import { Provider } from "./SearchContext";
import pf from "petfinder-client";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: "Seattle, WA",
      animal: "",
      breed: "",
      breeds: [],
      handleAnimalChange: this.handleAnimalChange.bind(this),
      handleBreedChange: this.handleBreedChange.bind(this),
      handleLocationChange: this.handleLocationChange.bind(this),
      getBreeds: this.getBreeds
    };

    this.handleAnimalChange = this.handleAnimalChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleBreedChange = this.handleBreedChange.bind(this);
  }

  handleLocationChange(event) {
    this.setState({
      location: event.target.value
    });
  }

  handleAnimalChange(event) {
    this.setState(
      {
        animal: event.target.value
      },
      this.getBreeds
    );
  }

  getBreeds() {
    if (this.state.animal) {
      petfinder.breed
        .list({ animal: this.state.animal })
        .then(data => {
          if (
            data.petfinder &&
            data.petfinder.breeds &&
            Array.isArray(data.petfinder.breeds.breed)
          ) {
            this.setState({
              breeds: data.petfinder.breeds.breed
            });
          } else {
            this.setState({ breeds: [] });
          }
        })
        .catch(console.error);
    } else {
      this.setState({
        breeds: []
      });
    }
  }

  handleBreedChange(event) {
    this.setState({
      breed: event.target.value
    });
  }

  render() {
    return (
      <div>
        <header>
          <Link to="/">
            <h1>Adopt Me!</h1>
          </Link>
          <Link to="/search-params">
            <span aria-label="search" role="img">
              🔍
            </span>
          </Link>
        </header>

        <Provider value={this.state}>
          <Router>
            <Results path="/" />
            <Details path="/details/:id" />
            <SearchParams path="/search-params" />
          </Router>
        </Provider>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
