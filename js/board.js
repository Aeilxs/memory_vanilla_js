import game from "./game.js";

const board = {
  init: () => {
    board.drawBoard();
  },

  /**
   * Génère le board
   */
  drawBoard: () => {
    const container = board.drawElement(
      "div",
      document.querySelector(".container"),
      { id: "game" }
    );
    game.playingCards.forEach((item, index) => {
      const card = board.drawElement("div", container, {
        className: "card ",
      });
      const inner = board.drawElement("div", card, {
        className: "card-inner",
        onclick: game.handleClick,
      });
      const back = board.drawElement("div", inner, {
        className: "card-back",
      });
      board.drawElement("div", inner, { className: "card-front" });
      const img = board.drawElement("img", back, {
        src: item.img,
        id: index,
        className: `img ${item.name}`,
      });
    });
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
   * Fais disparaitre les cartes identiques et ajoute un dataset permettant d'éviter le lancement
   * d'une animation sur app.resetSelectCard()
   */
  hideMatch: () => {
    board.preventSelect();
    setTimeout(() => {
      document.querySelectorAll(".flipped").forEach((item) => {
        item.classList.add("match");
        item.dataset.match = true;
      });
      if (game.isWin()) board.showMenu();
      board.preventSelect();
    }, 850);
  },

  /**
   * Retourne les cartes si le joueur s'est trompé
   */
  resetSelectedCard: () => {
    board.preventSelect();
    setTimeout(() => {
      document
        .querySelectorAll(".flipped:not([data-match]")
        .forEach((card) => card.classList.remove("flipped"));
      board.preventSelect();
    }, 850);
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
      .addEventListener("click", game.restartGame);
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

export default board;
