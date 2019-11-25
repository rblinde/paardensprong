'use strict';

/**
 * Paardensprong game
 */
class Game {
   /**
    * Adds eventlisteners for keyboard and mouseclick
    */
  constructor() {
    this.squareElems = [...document.querySelectorAll('.grid > div')];
    this.answerElem = document.getElementById('answer');
    this.formElem = document.getElementById('form');
    this.inputElem = document.getElementById('input-text');
    this.resetElem = document.getElementById('reset-button');
    this.timeouts = [];

    document.addEventListener('keydown', e => this.handleSeeAnser(e));
    this.formElem.addEventListener('submit', e => this.handleSubmitAnswer(e));
    this.resetElem.addEventListener('click', e => this.reset());
  }

  /**
   * Fetches data from server
   * @return {Promise} Promise containing {word, sequence}
   */
  getData() {
    return fetch('/word')
      .then(res => res.json());
  }

  /**
   * Cleans board, resets variables, and starts new game
   */
  reset() {
    // Remove current timeouts
    this.timeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
    this.timeouts = [];
    // Clear input field and focus on input
    this.inputElem.value = '';
    this.inputElem.focus();
    // Remove previous correct answers
    this.squareElems.forEach(elem => {
      elem.classList.remove('active');
    });
    // Remove answer
    this.answerElem.innerHTML = '';

    this.start();
  }

  /**
   * Starts new game
   */
  async start() {
    // Fetch word and lay out field
    this.data = await this.getData();
    const letters = [...this.data.word];

    this.data.sequence.forEach((elem, idx) => {
      this.squareElems[elem].innerHTML = letters[idx];
    });
  }

  /**
   * Shows correct anser if <space> is pressed
   * @param  {Event} e fired JavaScript event
   */
  handleSeeAnser(e) {
    if (e.keyCode !== 32) {
      return;
    }

    this.playSequence();
    this.answerElem.innerHTML = this.data.word;
  }

  /**
   * Checks if answer is correct and acts accordingly
   * @param  {Event} e fired JavaScript event
   */
  handleSubmitAnswer(e) {
    const answer = this.inputElem.value;
    e.preventDefault();

    if (answer != this.data.word) {
      this.formElem.classList.add('wrong');
      this.inputElem.focus();
    } else {
      this.formElem.classList.remove('wrong');
      this.playSequence();
      this.answerElem.innerHTML = this.data.word;
    }
  }

  /**
   * Plays correct sequence
   */
  playSequence() {
    this.data.sequence.forEach((item, idx) => {
      const timeout = setTimeout(() => {
        this.squareElems[item].classList.add('active');
      }, 300 * idx);
      this.timeouts.push(timeout);
    });
  }
}

document.addEventListener('DOMContentLoaded', event => {
  const game = new Game();
  game.start();
});
