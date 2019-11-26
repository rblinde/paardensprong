'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Randomly determines next move based on last one
 * @param  {Array}   result Current set of moves
 * @return {Integer}        Next move
 */
function nextMove(result) {
  const moves = {
    0: [5, 7], 1: [6, 8], 2: [3, 7],
    3: [2, 8], 5: [0, 6], 6: [1, 5],
    7: [0, 2], 8: [1, 3],
  };
  const lastMove = result[result.length - 1];
  const nextMoves = moves[lastMove];
  const randomMove = Math.round(Math.random() * 1);
  const randomMovePlayed = result.includes(nextMoves[randomMove]);
  return randomMovePlayed ? nextMoves[Math.abs(randomMove - 1)] : nextMoves[randomMove];
}

/**
 * Generates random sequence for word
 * @return {Array} list of indexes for word
 */
function generateSequence() {
  const result = [];
  let startPos = 4;

  while (startPos === 4) {
    startPos = Math.floor(Math.random() * 8);
  }

  result.push(startPos);

  while (result.length !== 8) {
    const move = nextMove(result)
    result.push(move);
  }

  return result;
}

/**
 * Picks random word from `words.txt`
 * @return {String} word to guess
 */
function pickWord() {
  const file = fs.readFileSync('words.txt', 'utf-8');
  const words = file.split('\n');
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/word', (req, res) => {
  res.json({
    sequence: generateSequence(),
    word: pickWord(),
  });
});

app.listen(PORT, () => console.log(`Paardensprong started at port: ${PORT}.`));
