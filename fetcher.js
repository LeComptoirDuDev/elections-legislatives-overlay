// const url =
// "https://elections-legislatives-overlay-hp532tbz6-lecomptoirdudev.vercel.app/mock.html";
const url =
  "https://www.resultats-elections.interieur.gouv.fr/legislatives-2022/FE.html";

let timer;
function initDataBarDirectValue(mention) {
  fetch(url)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      console.log("update :", mention);
      const decoder = new TextDecoder("iso-8859-15");
      const data = decoder.decode(buffer);
      processFetchedData(data, mention);
      clearInterval(timer);
      timer = setInterval(() => initDataBarDirectValue(mention), 10000);
    });
}

function processFetchedData(resultPage, mention) {
  const doc = new DOMParser().parseFromString(resultPage, "text/html");
  console.log(doc);
  const classResult = "tableau-mentions";

  const table = doc.querySelector(`.${classResult}`);

  const mentions = parseTable(table);
  displayResults(mentions, mention);
}

function parseTable(tableDOM) {
  const rowsDOM = tableDOM.querySelector("tbody").children;
  const rows = collectionToArray(rowsDOM);
  const mentions = rows.map((row) => {
    const [mention, voices, voterCast] = collectionToArray(row.children).map(
      (cell) => {
        const content = cell.innerHTML;
        return parseNumber(content) || content;
      }
    );

    return {
      mention,
      voices,
      voterCast,
    };
  });

  return mentions;
}

function displayResults(mentions, mention) {
  const dataBar = document.querySelector("data-bar");
  dataBar.setAttribute("cast", getDataFromMention(mention, mentions).voterCast);
  dataBar.setAttribute("voices", getDataFromMention(mention, mentions).voices);
}

function getDataFromMention(mention, mentions) {
  const data = mentions.find((m) => m.mention === mention);
  return data;
}

function collectionToArray(collection) {
  return [].slice.call(collection);
}

function parseNumber(content) {
  return parseFloat(content.replaceAll(" ", "").replaceAll(",", "."));
}
