import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Game from "./Game";

class ChallengeChooser extends Component {
  state = {
    challenges: null,
    err: null
  };
  componentDidMount() {
    fetch("http://localhost:3000/all-challenges", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(challenges => this.setState({ challenges }))
      .catch(err => this.setState({ err }));
  }
  render() {
    const { err, challenges } = this.state;
    if (err) return <p>{err}</p>;
    return (
      <React.Fragment>
        {challenges &&
          challenges.map(challenge => (
            <Link to={`game/${challenge.id}`}>{challenge.name}</Link>
          ))}
      </React.Fragment>
    );
  }
}

export default ChallengeChooser;
