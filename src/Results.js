import React from "react";
import Pet from "./Pet";
import pf from "petfinder-client";
import SearchBox from "./SearchBox";
import { Consumer } from "./SearchContext";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pets: [],
      api_err: false
    };

    this.search = this.search.bind(this);
  }
  componentDidMount() {
    this.search();
  }

  search() {
    petfinder.pet
      .find({
        location: this.props.searchParams.location,
        animal: this.props.searchParams.animal,
        breed: this.props.searchParams.breed,
        output: "full"
      })
      .then(data => {
        let pets;
        if (data.petfinder.pets && data.petfinder.pets.pet) {
          if (Array.isArray(data.petfinder.pets.pet)) {
            pets = data.petfinder.pets.pet;
          } else {
            pets = [data.petfinder.pets.pet];
          }
        } else {
          pets = [];
        }
        this.setState({
          pets
        });
      })
      .catch(err => {
        console.log("bad request to pet finder api...");
        //console.log("key: " + process.env.API_KEY);
        //console.log("secret: " + process.env.API_SECRET);
        this.setState({ api_err: true });
      });
  }

  render() {
    if (this.state.api_err) {
      return (
        <div>
          <h2>api error</h2>
        </div>
      );
    }
    return (
      <h1 className="search">
        <SearchBox search={this.search} />
        {this.state.pets.map(pet => {
          let breed;
          if (Array.isArray(pet.breeds.breed)) {
            breed = pet.breeds.breed.join(", ");
          } else {
            breed = pet.breeds.breed;
          }
          return (
            <Pet
              animal={pet.animal}
              key={pet.id}
              name={pet.name}
              breed={breed}
              media={pet.media}
              location={`${pet.contact.city}, ${pet.contact.state}`}
              id={pet.id}
            />
          );
        })}
      </h1>
    );
  }
}

/*
 exporting this function instead of just 'Results' is coz
 in the lifecycle method 'componentDidMount()' I want to be
able to access the search parameters - so I need access to 
context.
So what I'm exporting here is the Resulst component together with
context as it's props. 
Anther way to deal with this is when I instantiate Results in App, to 
send it context. This way is better because doing the other way, would
require me to added context to prop for every instatiation of Results.
*/
export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {context => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
