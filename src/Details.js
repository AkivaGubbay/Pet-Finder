import React from "react";
import pf from "petfinder-client";
import Carousel from "./Carousel";
import Modal from "./Modal";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showModal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  componentDidMount() {
    petfinder.pet
      .get({
        output: "full",
        id: this.props.id
      })
      .then(data => {
        let breed;
        if (Array.isArray(data.petfinder.pet.breeds.breed)) {
          breed = data.petfinder.pet.breeds.breed.join(", ");
        } else {
          breed = data.petfinder.pet.breeds.breed;
        }
        this.setState({
          name: data.petfinder.pet.name,
          animal: data.petfinder.pet.animal,
          location: `${data.petfinder.pet.contact.city}, ${
            data.petfinder.pet.contact.state
          }`,
          description: data.petfinder.pet.description,
          media: data.petfinder.pet.media,
          breed,
          loading: false
        });
      })
      .catch(err => this.setState({ error: err }));
  }
  render() {
    if (this.state.loading) {
      return <h1>loading … </h1>;
    }

    const { name, animal, breed, location, description, media } = this.state;

    return (
      <div className="details">
        <div>
          <Carousel media={media} />
          <h1>{name}</h1>
          <h2>{`${animal} — ${breed} — ${location}`}</h2>
          <button onClick={this.toggleModal}>Adopt {name}</button>
          <p>{description}</p>
          {this.state.showModal ? (
            <Modal>
              <h1>Would you like to adopt {name}?</h1>
              <div className="buttons">
                <button onClick={this.toggleModal}>Yes</button>
                <button onClick={this.toggleModal}>Hell Yes</button>
                <button onClick={this.toggleModal}>Nup</button>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Details;
