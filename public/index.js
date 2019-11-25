'use strict';

/**
 * Plays correct sequence
 * @param {Array} sequence    answer sequence
 * @param {Array} squareElems DOM elements to style
 */
function playSequence(sequence, squareElems) {
  sequence.forEach((item, idx) => {
    setTimeout(() => {
      squareElems[item].classList.add('active');
    }, 300 * idx);
  });
}

/**
 * Starts game and adds eventlisteners for keyboard
 * @param {Object} data word and sequence from back-end
 */
function init(data) {
  const squareElems = [...document.querySelectorAll('.grid > div')];
  const answerElem = document.getElementById('answer');
  const { word, sequence } = data;
  const letters = [...word];

  sequence.forEach((elem, idx) => {
    squareElems[elem].innerHTML = letters[idx];
  });

  document.addEventListener('keydown', event => {
    if (event.keyCode === 32) {
      playSequence(sequence, squareElems);
      answerElem.innerHTML = word;
    }

    if (event.keyCode === 82) {
      location.reload();
    }
   });
}

document.addEventListener('DOMContentLoaded', event => {
  fetch('/word').then(res => res.json()).then(res => init(res));
});
