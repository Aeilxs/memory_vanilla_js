import data from "./data.js";
import board from "./board.js";

const game = {
  playingCards: [],
  selectedCards: [],

  init: () => {
    game.playingCards = game.createArray();
    board.init();
  },

  /**
   * Créer un tableau d'objet unique
   * @returns {array}
   */
  createArray: () => {
    while (game.playingCards.length !== 8) {
      const card = game.selectValidCard();
      if (card) game.playingCards.push(card);
    }
    return game.shuffleArray([].concat(game.playingCards, game.playingCards));
  },

  /**
   * Sélectionne une carte valide
   * @return {Object} card
   */
  selectValidCard: () => {
    const card = data[Math.floor(Math.random() * data.length)];
    const isInvalid = game.playingCards.some((item) => card.name === item.name);
    if (isInvalid) return;
    return card;
  },

  /**
   * Mélange un array
   * @param {array} array
   * @return {array}
   */
  shuffleArray: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  },

  /**
   * Gère la logique suite à un clic du joueur
   * @param {event} event
   */
  handleClick: (event) => {
    if (event.target.classList.contains("img")) return;
    game.selectedCards.push(event.target.childNodes[0].firstChild);
    event.target.classList.add("flipped");

    if (game.selectedCards.length === 2) {
      game.isMatch(game.selectedCards)
        ? board.hideMatch()
        : board.resetSelectedCard();
    }
  },

  /**
   * Vérifie si les deux cartes sélectionnées par le joueur sont indentiques
   * @param {array} array
   * @returns
   */
  isMatch: (array) => {
    if (array.length < 2) return;
    const match =
      array[0].classList[1] === array[1].classList[1] &&
      array[0].id !== array[1].id;
    game.selectedCards = [];
    return match;
  },

  /**
   * Vérifie si la partie est gagnée
   * @return {boolean}
   */
  isWin: () => {
    return document.querySelectorAll(".match").length === 16;
  },

  /**
   * Permet de recommencer le jeu après une victoire
   */
  restartGame: () => {
    document.querySelector(".menu").classList.add("hide");
    document.querySelector(".menu").classList.remove("show");
    game.playingCards = [];
    game.selectedCards = [];
    document.getElementById("game").remove();
    game.init();
  },
};

export default game;
