import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {};

  goals = [
    "When forty winters shall besiege thy brow,"
    // "And dig deep trenches in thy beauty's field,",
    // "Thy youth's proud livery so gazed on now,"
  ];

  setInitialGame = () =>
    this.setState(
      {
        isInputCorrect: true,
        currentGoalIdx: 0,
        gameStatus: "preStart",
        timer: 10.0
      },
      () => {
        this.input.value = "";
        this.input.focus();
      }
    );

  componentDidMount() {
    this.setInitialGame();
    // fetch(
    //   "https://cors-anywhere.herokuapp.com/http://poetrydb.org/author,title/Shakespeare;Sonnet",
    //   {
    //     headers: {
    //       "content-type": "aplication/json: charset=UTF-8",
    //       apiKey: "92d0fd7ec6d55e40b386a68d8f3e5f6f"
    //     }
    //   }
    // )
    //   .then(data => data.json())
    //   .then(res => console.log({ res }))
    //   .catch(err => console.log({ err }));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  focusInput = () => this.input.focus();

  startTimer = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState(state => {
        const timer = Number.parseFloat(state.timer - 0.01).toFixed(2);
        let { gameStatus } = this.state;
        if (timer <= 0) gameStatus = "lose";
        return {
          timer,
          gameStatus
        };
      });
    }, 10);
  };
  handleInputChange = inputVal =>
    this.setState(state => {
      let { gameStatus, timer, currentGoalIdx } = state;
      let isInputCorrect = false;
      if (gameStatus === "preStart") {
        gameStatus = "start";
        this.startTimer();
      }
      const goal = this.goals[currentGoalIdx];
      const inputValLen = inputVal.length;
      if (inputVal === goal.substring(0, inputValLen)) {
        isInputCorrect = true;
      }
      if (inputVal === goal) {
        timer = Number(timer) + 10;
        currentGoalIdx++;
        if (currentGoalIdx === this.goals.length) gameStatus = "win";
        this.input.value = "";
      }
      return { isInputCorrect, currentGoalIdx, gameStatus, timer };
    });
  render() {
    const { isInputCorrect, currentGoalIdx, gameStatus, timer } = this.state;
    console.log({ gameStatus });
    return (
      <React.Fragment>
        {(gameStatus === "start" || gameStatus === "preStart") && (
          <div className="App">
            <p>{gameStatus === "start" ? timer : "To begin start typing"}</p>
            <p>
              {currentGoalIdx + 1}/{this.goals.length}
            </p>
            <p>{this.goals[currentGoalIdx]}</p>
            <input
              type="text"
              onBlur={this.focusInput}
              ref={input => (this.input = input)}
              onChange={e => this.handleInputChange(e.target.value)}
              style={{
                color: isInputCorrect ? "green" : "red"
              }}
            />
          </div>
        )}
        {gameStatus === "win" && (
          <React.Fragment>
            <p>You Win!!</p>
            <button onClick={this.setInitialGame}>Reset Game</button>
          </React.Fragment>
        )}
        {gameStatus === "lose" && (
          <React.Fragment>
            <p>You Lose!!</p>
            <button onClick={this.setInitialGame}>Reset Game</button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default App;
