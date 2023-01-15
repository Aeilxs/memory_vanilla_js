import data from "./data.js";

const app = {
  cards: [],
  selected: [],

  init: () => {
    app.cards = app.createArray();
    app.drawBoard();
  },

  /**
   * Gère la logique suite à un clic du joueur
   * @param {event} event
   */
  handleClick: (event) => {
    if (event.target.classList.contains("img")) return;
    app.selected.push(event.target.childNodes[0].firstChild);
    event.target.classList.add("flipped");

    if (app.selected.length === 2) {
      app.isMatch(app.selected) ? app.hideMatch() : app.resetSelectedCard();
    }
  },

  /**
   * Vérifie si la partie est gagnée
   * @return {boolean}
   */
  isWin: () => {
    return document.querySelectorAll(".match").length === 16;
  },

  /**
   * Affiche le menu après la victoire
   */
  showMenu: () => {
    setTimeout(() => {
      document.getElementById("game").classList.add("fade");
      const menu = document.querySelector(".menu");
      menu.classList.remove("hide");
      menu.classList.add("show");
    }, 850);
    document.getElementById("game").classList.add("hide");
    document
      .querySelector(".menu-button")
      .addEventListener("click", app.restartGame);
  },

  /**
   * Permet de recommencer le jeu après une victoire
   */
  restartGame: () => {
    document.querySelector(".menu").classList.add("hide");
    document.querySelector(".menu").classList.remove("show");
    app.cards = [];
    app.selected = [];
    document.getElementById("game").remove();
    app.init();
  },

  /**
   * Retourne les cartes si le joueur s'est trompé
   */
  resetSelectedCard: () => {
    app.preventSelect();
    setTimeout(() => {
      document
        .querySelectorAll(".flipped:not([data-match]")
        .forEach((card) => card.classList.remove("flipped"));
      app.preventSelect();
    }, 850);
  },

  /**
   * Fais disparaitre les cartes identiques et ajoute un dataset permettant d'éviter le lancement
   * d'une animation sur app.resetSelectCard()
   */
  hideMatch: () => {
    app.preventSelect();
    setTimeout(() => {
      document.querySelectorAll(".flipped").forEach((item) => {
        item.classList.add("match");
        item.dataset.match = true;
      });
      if (app.isWin()) app.showMenu();
      app.preventSelect();
    }, 850);
  },

  /**
   * Empêche de sélectionner pendant les différentes animations ce qui causait des bugs
   */
  preventSelect: () => {
    document
      .querySelectorAll(".card-inner")
      .forEach((card) => card.classList.toggle("preventSelect"));
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
    app.selected = [];
    return match;
  },

  /**
   * Créer un tableau d'objet unique
   * @returns {array}
   */
  createArray: () => {
    while (app.cards.length !== 8) {
      const card = app.selectValidCard();
      if (card) app.cards.push(card);
    }
    return app.shuffleArray([].concat(app.cards, app.cards));
  },

  /**
   * Sélectionne une carte valide
   * @return {Object} card
   */
  selectValidCard: () => {
    const card = data[Math.floor(Math.random() * data.length)];
    const isInvalid = app.cards.some((item) => card.name === item.name);
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
   * Génère le board
   */
  drawBoard: () => {
    const board = app.drawElement("div", document.querySelector(".container"), {
      id: "game",
    });
    app.cards.forEach((item, index) => {
      const card = app.drawElement("div", board, {
        className: "card ",
      });
      const inner = app.drawElement("div", card, {
        className: "card-inner",
        onclick: app.handleClick,
      });
      const back = app.drawElement("div", inner, { className: "card-back" });
      app.drawElement("div", inner, { className: "card-front" });
      const img = app.drawElement("img", back, {
        src: item.img,
        id: index,
        className: `img ${item.name}`,
      });
    });
  },

  /**
   * Créer et ajoute un élément dans un container
   * @param {String} type le type de l'élément html
   * @param {Element} parent élément html où ajouter le nouveau élément
   * @param {Object} options objet avec les attributs du futur élément
   * @returns {Element} le nouvel élément
   */
  drawElement: (type, parent, options) => {
    const element = document.createElement(type);
    Object.assign(element, options);
    parent.appendChild(element);
    return element;
  },
};

document.addEventListener("DOMContentLoaded", app.init);
