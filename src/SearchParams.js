import React from "react";
import SearchBox from "./SearchBox";

class SearchParams extends React.Component {
  search() {
    navigate("/");
  }
  render() {
    return <SearchBox search={this.search} />;
  }
}

export default SearchParams;
