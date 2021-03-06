import React, { Component } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./App.css";
import Game from "./Game";
import ChallegeChooser from "./ChallengeChooser";

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

class App extends Component {
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
    console.log("location", window.location.pathname);
    if (err) return <p>{err}</p>;
    return (
      <Router>
        <React.Fragment>
          <Route path="/game/:id" component={Game} />
          <Route path="/" component={ChallegeChooser} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
