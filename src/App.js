import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";
import Keyboard from "./Keyboard.js";
import Sprite from "./Sprites.js";
// import { Box, Grid } from "@mui/material";

let globalWordDisplay = "";

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all letters a user has guessed so far
      guessedLetters: [],
      guessedCorrectly: false,
      // wordDisplayed: ["_"],
      // guess displays the placeholder in the input field
      guess: "Key in your first guess here",
      // Insert num guesses left state here
      numGuessLeft: 10,
      characterInput: "",
      maxSpaceWidth: 750,
      minSpaceWidth: 0,
      roundNumber: 1,
      scoreData: [],
    };
    // bind handleChange and handleSubmit methods to component instance,to keep the reference
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    // for...of is a string and array iterator that does not use index
    for (let letter of this.state.currWord) {
      if (this.state.guessedLetters.includes(letter)) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    globalWordDisplay = wordDisplay.join(" ");
    // this.setState({ wordDisplayed: wordDisplay });
    return globalWordDisplay;
  };

  // Insert form callback functions handleChange
  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  // handleSubmit to check validation of input to allow only 1 alphabet to be inputted
  handleSubmit = (e) => {
    e.preventDefault();
    const { guessedLetters, guess, numGuessLeft } = this.state;
    if (guess.length !== 1) {
      alert("Please input a letter instead");
    } else {
      this.setState({
        guessedLetters: [...guessedLetters, guess],
        guess: "",
        numGuessLeft: numGuessLeft - 1,
      });
    }
  };

  // handleRestart resets all the states
  handleRestart = () => {
    this.setState({
      currWord: getRandomWord(),
      guessedLetters: [],
      wordDisplay: [],
      guessedCorrectly: false,
      guess: "Key in your first guess here",
      numGuessLeft: 10,
    });
  };

  handleInput = (character) => {
    const { guessedLetters, numGuessLeft } = this.state;
    this.setState({
      guessedLetters: [...guessedLetters, character],
      numGuessLeft: numGuessLeft - 1,
    });
  };

  componentDidMount() {
    // Add event listener for keydown on the document object
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    // Remove event listener when component is unmounted
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    // Check if the key pressed is the "Enter" key (keyCode 13)
    if (event.keyCode === 13) {
      // Trigger a click event on the "Restart" button
      const restartButton = document.getElementById("restart-button");
      restartButton.click();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.numGuessLeft !== this.state.numGuessLeft) {
      // Update state based on a conditional
      if (!globalWordDisplay.includes("_")) {
        this.setState({
          // roundNumber: prevState.roundNumber + 1,
          scoreData: [
            ...prevState.scoreData,
            { round: this.state.currWord, guess: globalWordDisplay },
          ],
        });
      } else if (this.state.numGuessLeft === 0) {
        this.setState({
          // roundNumber: prevState.roundNumber + 1,
          scoreData: [
            ...prevState.scoreData,
            { round: this.state.currWord, guess: globalWordDisplay },
          ],
        });
      }
    }
  }

  render() {
    const {
      numGuessLeft,
      currWord,
      guessedLetters,
      scoreData,
      maxSpaceWidth,
      minSpaceWidth,
    } = this.state;
    let wordDisplayed = this.generateWordDisplay();
    return (
      <div className="App">
        <header className="App-header">
          <h1>Guess The Word 🚀</h1>
          <Sprite
            numGuessLeft={numGuessLeft}
            maxSpaceWidth={maxSpaceWidth}
            minSpaceWidth={minSpaceWidth}
            globalWordDisplay={globalWordDisplay}
          />
          <h3>Word Display</h3>
          {this.generateWordDisplay()}
          <h3>Guessed Letters</h3>
          {guessedLetters.length > 0
            ? "[" + guessedLetters.join(" ") + "]"
            : "[ ]"}
          {wordDisplayed.includes("_") ? (
            numGuessLeft === 0 ? (
              <div style={{ marginBottom: 0 }}>
                <h3 style={{ marginBottom: 0 }}>
                  Game over. The word is "{currWord}".
                  <br />
                  <br />
                  <button
                    className="Button"
                    id="restart-button"
                    onClick={this.handleRestart}
                  >
                    Restart
                  </button>
                </h3>
              </div>
            ) : (
              <div style={{ marginBottom: 0 }}>
                <br />
                <Keyboard onClick={this.handleInput} />
                {/* <h3>Key in your guess here:</h3>
  <form className="Form" onSubmit={this.handleSubmit}>
    <label>
      <input
        name="guess"
        type="text"
        value={this.state.guess}
        onChange={this.handleChange}
      />
    </label>
    <input className="Button" type="submit" value="Submit" />
  </form> */}
                <p>
                  <em>No. of guesses left: {numGuessLeft}</em>
                </p>
              </div>
            )
          ) : (
            <div style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 0 }}>
                Congrats! You guessed the word!
                <br />
                <br />
                <button
                  className="Button"
                  id="restart-button"
                  onClick={this.handleRestart}
                >
                  Next Word
                </button>
              </h3>
            </div>
          )}
          {/* Keep score here */}
          <div style={{ marginBottom: 30 }}>
            {scoreData.length === 0 ? null : (
              <>
                <h3 style={{ marginBottom: 10 }}>Score</h3>
                {scoreData.map((item, index) => (
                  <p key={index} style={{ margin: 0 }}>
                    {item.round + " : " + item.guess}
                  </p>
                ))}
              </>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
