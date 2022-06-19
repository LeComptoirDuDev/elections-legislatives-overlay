// const url =
// "https://elections-legislatives-overlay-hp532tbz6-lecomptoirdudev.vercel.app/mock.html";
const url =
  "https://www.resultats-elections.interieur.gouv.fr/legislatives-2022/FE.html";
// const url =
//   "https://www.interieur.gouv.fr/Elections/Les-resultats/Legislatives/elecresult__legislatives-2017/(path)/legislatives-2017//FE.html";

const svg = document.querySelector("#hemicycle");

const nuances = {
  "Divers extrême gauche": "DarkRed",
  "Nouvelle union populaire écologique et sociale": "Red",
  "Divers gauche": "Brown",
  Divers: "Grey",
  Régionaliste: "SaddleBrown",
  "Ensemble ! (Majorité présidentielle)": "DarkViolet",
  "Divers centre": "DarkOrange",
  "Union des Démocrates et des Indépendants": "RoyalBlue",
  "Les Républicains": "MediumBlue",
  "Divers droite": "DodgerBlue",
  "Rassemblement National": "Black",
};

let timer;
function fetchData() {
  fetch(url)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      const decoder = new TextDecoder("iso-8859-15");
      const data = decoder.decode(buffer);
      processFetchedData(data);
      clearInterval(timer);
      timer = setInterval(() => fetchData(), 10000);
    });
}
fetchData();

function processFetchedData(resultPage) {
  const doc = new DOMParser().parseFromString(resultPage, "text/html");
  console.log(doc);
  const classResult = "tableau-resultats-listes-ER";

  const table = doc.querySelector(`.${classResult}`);

  const results = parseTable(table);
  fillHemicycle(results);
  console.log(results);
}

function parseTable(tableDOM) {
  const rowsDOM = tableDOM.querySelector("tbody").children;
  const rows = collectionToArray(rowsDOM);
  const results = rows.map((row) => {
    const [politicColor, voices, registered, votes, delegates] =
      collectionToArray(row.children).map((cell) => {
        const content = cell.innerHTML;
        return parseNumber(content) || content;
      });

    return {
      politicColor,
      voices,
      registered,
      votes,
      delegates,
    };
  });

  return results;
}
function collectionToArray(collection) {
  return [].slice.call(collection);
}

function parseNumber(content) {
  return parseFloat(content.replaceAll(" ", "").replaceAll(",", "."));
}

function fillHemicycle(results) {
  const circles = svg.querySelectorAll("g>circle");
  let cursor = 0;
  for (const result of results) {
    const color = nuances[result.politicColor];
    console.log(color, result.politicColor);
    const delegates = +result.delegates;
    for (let i = cursor; i < cursor + delegates; i++) {
      circles[i].setAttribute("style", `fill:${color}`);
    }
    cursor += delegates;
  }
}
