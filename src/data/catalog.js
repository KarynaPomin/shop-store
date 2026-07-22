export const asset = (path) => `/assets/${path}`;

export const homeHero = {
  image: asset("photos/without_bg/baner-1.png"),
  tone: "#4f90b2",
};

export const categories = {
  woman: {
    label: "Woman",
    hero: asset("photos/without_bg/baner-woman.png"),
    cardImage: asset("photos/without_bg/categories-woman.png"),
    tone: "#4f91b3",
    menu: [
      "Show full catalog",
      "Coats and parkas",
      "Jackets",
      "Dresses",
      "Bluzy",
      "Jeans",
    ],
  },
  kids: {
    label: "Kids",
    hero: asset("photos/without_bg/baner-kids.png"),
    cardImage: asset("photos/without_bg/categories-kids.png"),
    tone: "#5798b9",
    menu: ["Show all", "For girls", "For boys", "For babies"],
  },
  man: {
    label: "Man",
    hero: asset("photos/without_bg/baner-man.png"),
    cardImage: asset("photos/without_bg/categories-man.png"),
    tone: "#3f7697",
    menu: [
      "Show full catalog",
      "Coats and parkas",
      "Jackets",
      "Sweatpants",
      "Bluzy",
      "Jeans",
    ],
  },
};
