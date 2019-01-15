import React, { Component } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  state = {};

  setInitialGame = () =>
    this.setState(
      {
        isInputCorrect: true,
        currentGoalIdx: 0,
        gameStatus: "preStart",
        remainingTime: 10.0,
        overallTime: 1.0
      },
      () => {
        if (this.input) {
          this.input.value = "";
          this.input.focus();
        }
      }
    );

  componentDidMount() {
    this.setInitialGame();
    fetch("http://localhost:3000/challenge", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(challenge => this.setState({ goals: challenge }))
      .catch(err => console.log({ err }));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate() {
    const { gameStatus } = this.state;
    if ((gameStatus === "win" || gameStatus === "lose") && this.restartButton)
      this.restartButton.focus();
  }

  focusInput = () => this.input.focus();

  startTimer = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState(state => {
        const remainingTime = Number.parseFloat(
          state.remainingTime - 0.01
        ).toFixed(2);

        let { gameStatus } = this.state;
        if (remainingTime <= 0) {
          gameStatus = "lose";
          clearInterval(this.timer);
        }
        return {
          remainingTime,
          gameStatus,
          overallTime: state.overallTime + 0.01
        };
      });
    }, 10);
  };
  handleInputChange = inputVal =>
    this.setState(state => {
      let { gameStatus, remainingTime, currentGoalIdx } = state;
      let isInputCorrect = false;
      if (gameStatus === "preStart") {
        gameStatus = "start";
        this.startTimer();
      }
      const goal = state.goals[currentGoalIdx];
      const inputValLen = inputVal.length;
      if (inputVal === goal.substring(0, inputValLen)) {
        isInputCorrect = true;
      }
      if (inputVal === goal) {
        remainingTime = Number(remainingTime) + 8;
        currentGoalIdx++;
        if (currentGoalIdx === state.goals.length) {
          gameStatus = "win";
          clearInterval(this.timer);
        }
        this.input.value = "";
      }
      return { isInputCorrect, currentGoalIdx, gameStatus, remainingTime };
    });
  render() {
    const {
      isInputCorrect,
      currentGoalIdx,
      gameStatus,
      remainingTime,
      overallTime,
      goals
    } = this.state;
    console.log({ overallTime });

    if (goals)
      return (
        <div className="App Main">
          {(gameStatus === "start" || gameStatus === "preStart") && (
            <React.Fragment>
              <h2>
                {gameStatus === "start"
                  ? remainingTime
                  : "To begin start typing"}
              </h2>
              <h3>
                {currentGoalIdx + 1}/{goals.length}
              </h3>
              <p>{goals[currentGoalIdx]}</p>
              <input
                type="text"
                onBlur={this.focusInput}
                ref={input => (this.input = input)}
                onChange={e => this.handleInputChange(e.target.value)}
                style={{
                  color: isInputCorrect ? "green" : "red"
                }}
              />
            </React.Fragment>
          )}
          {gameStatus === "win" && (
            <React.Fragment>
              <p>
                You Win! You completed the task in{" "}
                {Number.parseFloat(overallTime).toFixed(2)} seconds
              </p>
              <button
                className="btn btn-primary"
                onClick={this.setInitialGame}
                ref={restartButton => (this.restartButton = restartButton)}
              >
                Reset Game
              </button>
            </React.Fragment>
          )}
          {gameStatus === "lose" && (
            <React.Fragment>
              <p>You Lose!!</p>
              <button
                className="btn btn-primary"
                ref={restartButton => (this.restartButton = restartButton)}
                onClick={this.setInitialGame}
              >
                Reset Game
              </button>
            </React.Fragment>
          )}
        </div>
      );
    return <p>Loading...</p>;
  }
}

export default App;
