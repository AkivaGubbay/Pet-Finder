import React from "react";
import { ANIMALS } from "petfinder-client";
import { Consumer } from "./SearchContext";

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: "usa",
      animal: "",
      breed: "",
      breeds: []
    };
  }

  render() {
    return (
      <Consumer>
        {context => (
          <div className="search-params">
            <label htmlFor="location">
              Location
              <input
                id="location"
                value={context.location}
                onChange={context.handleLocationChange}
              />
            </label>

            <label htmlFor="animal">
              Animal
              <select
                id="animal"
                value={context.animal}
                onChange={context.handleAnimalChange}
                onBlur={context.handleAnimalChange}
              >
                <option />
                {ANIMALS.map(animal => (
                  <option key={animal} value={animal}>
                    {animal}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="breed">
              Breed
              <select
                id="breed"
                value={context.breed}
                onChange={context.handleBreedChange}
                onBlur={context.handleBreedChange}
                disabled={context.breeds === 0}
              >
                <option />
                {context.breeds.map(breed => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={this.props.search}>Submit</button>
          </div>
        )}
      </Consumer>
    );
  }
}

export default SearchBox;
