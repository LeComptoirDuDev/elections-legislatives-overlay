// const url =
// "https://elections-legislatives-overlay-hp532tbz6-lecomptoirdudev.vercel.app/mock.html";
// const url =
//   "https://www.resultats-elections.interieur.gouv.fr/legislatives-2022/FE.html";
const url =
  "https://www.interieur.gouv.fr/Elections/Les-resultats/Legislatives/elecresult__legislatives-2017/(path)/legislatives-2017//FE.html";

const svg = document.querySelector("#hemicycle");

const nuances = {
  "Extrême gauche": "DarkRed",
  "Parti communiste français": "Red",
  "La France insoumise": "Crimson",
  "Parti socialiste": "LightCoral",
  "Parti radical de gauche": "LightSalmon",
  "Divers gauche": "Brown",
  Ecologiste: "Green",
  Divers: "Grey",
  Régionaliste: "SaddleBrown",
  "La République en marche": "DarkViolet",
  Modem: "DarkOrange",
  "Union des Démocrates et Indépendants": "RoyalBlue",
  "Les Républicains": "MediumBlue",
  "Divers droite": "DodgerBlue",
  "Debout la France": "DarkBlue",
  "Front National": "MidnightBlue",
  "Extrême droite": "Black",
};

let timer;
function fetchData(mention) {
  fetch(url)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      console.log("update :", mention);
      const decoder = new TextDecoder("utf-8");
      const data = decoder.decode(buffer);
      processFetchedData(data, mention);
      clearInterval(timer);
      timer = setInterval(() => fetchData(mention), 10000);
    });
}
fetchData();

function processFetchedData(resultPage, mention) {
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
    const [color, delegates] = collectionToArray(row.children).map((cell) => {
      const content = cell.innerHTML;
      return parseNumber(content) || content;
    });

    return {
      color,
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
    const color = nuances[result.color];
    const delegates = +result.delegates;
    for (let i = cursor; i < cursor + delegates; i++) {
      circles[i].setAttribute("style", `fill:${color}`);
    }
    cursor += delegates;
  }
}
