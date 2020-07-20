let heros = [];
let chosenHero;
let heroIDs = [];
let highlightedHero;
let tournamentHeros = [];

function getHeros() {
  UIreset();
  heros = [];
  clearHighlightedHero();
  clearHeroCircles();

  let heroIDs = randomArray();
  for (let i = 0; i < 10; i++) {
    $.getJSON('https://www.superheroapi.com/api.php/10220957965592385/' + heroIDs[i], (data, status) => {
      heros.push(data);
    })
      .done(function (data) {
        const markup = `<img src="${data.image.url}" alt="${data.name}" id="${data.id}" onclick="displayId(${data.id})"/>`;
        $('.container__body__icons--inner').append(markup);
      })
  }
  setTimeout(() => {
    addUI();
    displayId(heros[0].id);
  }, 600)
}

function randomArray() {
  heroIDs = [];
  for (let i = 0; heroIDs.length < 10; i++) {
    let randomID = Math.ceil(Math.random() * 731);
    if (jQuery.inArray(randomID, heroIDs) === -1) {
      heroIDs.push(randomID);
    }
  }
  return heroIDs;
}

function displayId(myID) {
  clearHighlightedHero();
  highlightHeroCircle(myID);

  myID = myID.toString();
  let displayedHero = heros.find(element => element.id === myID);
  chosenHero = displayedHero;

  const markup = `<img src="${displayedHero.image.url}" alt="slika" />
  <div class="container__body__card__title">${displayedHero.name}</div>`
  $('.container__body__card--inner').append(markup);
}

function clearHighlightedHero() {
  $('.container__body__card--inner').remove();
  let innerMarkup1 = '<div class="container__body__card--inner"></div>';
  $('.container__body__card').append(innerMarkup1);
}

function clearHeroCircles() {
  $('.container__body__icons--inner').remove();
  let innerMarkup2 = '<div class="container__body__icons--inner"></div>';
  $('.container__body__icons').append(innerMarkup2);
}

function randomHero() {
  let randomID = Math.floor(Math.random() * 10);
  displayId(heroIDs[randomID]);
}

function highlightHeroCircle(id) {
  if (highlightedHero !== undefined) {
    $(`#${highlightedHero}`).removeClass("chosen-hero")
  }
  $(`#${id}`).addClass("chosen-hero");
  highlightedHero = id;
}

function switchLeft() {
  let currentHeroIndex = heros.findIndex(element => element.id === chosenHero.id);
  currentHeroIndex--;
  if (currentHeroIndex < 0) {
    currentHeroIndex = 9;
  }
  displayId(heros[currentHeroIndex].id);
}

function switchRight() {
  let currentHeroIndex = heros.findIndex(element => element.id === chosenHero.id);
  currentHeroIndex++;
  if (currentHeroIndex > 9) {
    currentHeroIndex = 0;
  }
  displayId(heros[currentHeroIndex].id);
}

function UIreset() {
  $('.switch__left').remove();
  $('.switch__right').remove();
  $('.container__randomizer').remove();
  $('.container__header--right').empty();
}

function addUI() {
  $('.container__randomizer').remove();
  $(".container__header--right").empty();

  const markupSwitches = '<div class="switch__left"><div class="switch__left--arrow" onclick="switchLeft()">&#8592;</div></div><div class="switch__right"><div class="switch__right--arrow" onclick="switchRight()">&#8594;</div></div>';
  $(".container__body__card").append(markupSwitches);

  const randomizer = '<div class="container__randomizer"><p onclick="randomHero()">Random heroj</p></div>';
  $(".container__body__card").after(randomizer);

  const startTour = '<button onclick="startTournament()">NASTAVI &#8594;</button>'
  $(".container__header--right").append(startTour);
}

//drugi dio
function startTournament() {
  selectEightHeros();
  renderHerosInTournament();
  clearHeader();
  addNewHeader()
  toSemiFinals();
}

function selectEightHeros() {
  tournamentHeros = [];
  tournamentHeros.push(chosenHero);
  let indexOfChosenHero = heros.findIndex(element => element.name === chosenHero.name);
  heros.splice(indexOfChosenHero, 1);
  for (let i = 0; i < 7; i++) {
    let heroToPush = Math.floor(Math.random() * heros.length);
    tournamentHeros.push(heros[heroToPush]);
    heros.splice(heroToPush, 1);
  }
}

let halfFinals = [];
let finalsArray = [];
let finalsResult = [];

function roundResult(firstHeroIndex, sourceContainer) {
  let abilities = ["intelligence", "strength", "speed", "durability", "power", "combat"];
  let heroOneAttack = 0;
  let heroTwoAttack = 0;
  for (let i = 0; i < 2; i++) {
    let ability = abilities[Math.floor(Math.random() * 6)];
    if (eval(sourceContainer)[firstHeroIndex].powerstats[ability] === "null") {
      heroOneAttack += 0;
    } else {
      heroOneAttack += parseInt(eval(sourceContainer)[firstHeroIndex].powerstats[ability]);
    }

    if (eval(sourceContainer)[firstHeroIndex + 1].powerstats[ability] === "null") {
      heroTwoAttack += 0;
    } else {
      heroTwoAttack += parseInt(eval(sourceContainer)[firstHeroIndex + 1].powerstats[ability]);
    }
  }
  if (heroOneAttack === heroTwoAttack) {
    return true;
  } else {
    return heroOneAttack > heroTwoAttack ? true : false;
  }
}

function generateResults(sourceContainer, resultsContainer, tournamentStage) {
  let firstHeroWins = 0;
  let secondHeroWins = 0;

  for (let j = 0; j <= eval(sourceContainer).length - 1; j += 2) {
    firstHeroWins = eval(sourceContainer)[j][tournamentStage];
    secondHeroWins = eval(sourceContainer)[j + 1][tournamentStage];

    if (firstHeroWins < 2 && secondHeroWins < 2) {
      roundResult(j, sourceContainer) ? firstHeroWins++ : secondHeroWins++;
      eval(sourceContainer)[j][tournamentStage] = firstHeroWins;
      eval(sourceContainer)[j + 1][tournamentStage] = secondHeroWins;
    }
  }
}

function toSemiFinals() {
  tournamentHeros.forEach(element => element.semiFinals = 0);
  tournamentHeros.forEach(element => element.halfFinals = 0);
  tournamentHeros.forEach(element => element.endFinals = 0);
  for (let i = 0; i <= 3; i++) {
    setTimeout(() => {
      generateResults("tournamentHeros", "halfFinals", "semiFinals");
      deleteSemiFinals();
      renderSemiFinals();
    }, 2000 * (i + 1));
  }
  setTimeout(() => {
    saveWinners("tournamentHeros", "halfFinals", "semiFinals");
    renderHalfFinalists();
    toHalfFinals();
    semiLoosers();
  }, 9000);
}

function saveWinners(sourceContainer, resultsContainer, tournamentStage) {
  for (let i = 0; i <= eval(sourceContainer).length - 1; i += 2) {
    eval(sourceContainer)[i][tournamentStage] > eval(sourceContainer)[i + 1][tournamentStage] ?
      eval(resultsContainer).push(eval(sourceContainer)[+i]) :
      eval(resultsContainer).push(eval(sourceContainer)[+i + 1]);
  }
}

function semiLoosers() {
  for (let i = 0; i < tournamentHeros.length; i++) {
    if (tournamentHeros[i].semiFinals < 2) {
      const selector = ".hero" + (i + 1);
      $(selector).addClass("loosingChamp");
    }
  }
}

function toHalfFinals() {
  for (let i = 0; i <= 3; i++) {
    setTimeout(() => {
      generateResults("halfFinals", "finalsArray", "halfFinals");
      deleteHalfFinals();
      renderHalfFinals();
    }, 2000 * (i + 1));
  }
  setTimeout(() => {
    saveWinners("halfFinals", "finalsArray", "halfFinals");
    renderFinalists();
    toFinals();
    halfLoosers();
  }, 9000);
}

function halfLoosers() {
  for (let i = 0; i < halfFinals.length; i++) {
    if (halfFinals[i].halfFinals < 2) {
      const selector = ".winner" + (i + 1);
      $(selector).addClass("loosingChamp");
    }
  }
}

function toFinals() {
  for (let i = 0; i <= 3; i++) {
    setTimeout(() => {
      generateResults("finalsArray", "finalsResult", "endFinals");
      deleteFinals();
      renderFinals();
    }, 2000 * (i + 1));
  }
  setTimeout(() => {
    saveWinners("finalsArray", "finalsResult", "endFinals");
    renderWinner();
    finalLooser();
  }, 9000);
}

function finalLooser() {
  for (let i = 0; i < finalsArray.length; i++) {
    if (finalsArray[i].endFinals < 2) {
      const selector = ".winner" + (5 + 1);
      $(selector).addClass("loosingChamp");
    }
  }
}

function deleteSemiFinals() {
  $(".result1").empty();
  $(".result2").empty();
  $(".result3").empty();
  $(".result4").empty();
  $(".result5").empty();
  $(".result6").empty();
  $(".result7").empty();
  $(".result8").empty();
}

function renderSemiFinals() {
  $(".result1").append(tournamentHeros[0].semiFinals);
  $(".result2").append(tournamentHeros[1].semiFinals);
  $(".result3").append(tournamentHeros[2].semiFinals);
  $(".result4").append(tournamentHeros[3].semiFinals);
  $(".result5").append(tournamentHeros[5].semiFinals);
  $(".result6").append(tournamentHeros[4].semiFinals);
  $(".result7").append(tournamentHeros[7].semiFinals);
  $(".result8").append(tournamentHeros[6].semiFinals);
}

function renderHalfFinalists() {
  $(".winner1").append(`<img src="${halfFinals[0].image.url}">`);
  $(".winner2").append(`<img src="${halfFinals[1].image.url}">`);
  $(".winner3").append(`<img style="transform: rotate(180deg);" src="${halfFinals[2].image.url}">`);
  $(".winner4").append(`<img style="transform: rotate(180deg);" src="${halfFinals[3].image.url}">`);
}

function deleteHalfFinals() {
  $(".result9").empty();
  $(".result10").empty();
  $(".result11").empty();
  $(".result12").empty();
}

function renderHalfFinals() {
  $(".result9").append(halfFinals[0].halfFinals);
  $(".result10").append(halfFinals[1].halfFinals);
  $(".result11").append(halfFinals[2].halfFinals);
  $(".result12").append(halfFinals[3].halfFinals);
}

function renderFinalists() {
  $(".winner5").append(`<img src="${finalsArray[0].image.url}">`);
  $(".winner6").append(`<img style="transform: rotate(180deg);" src="${finalsArray[1].image.url}">`);
}

function deleteFinals() {
  $(".result13").empty();
  $(".result14").empty();
}

function renderFinals() {
  $(".result13").append(finalsArray[0].endFinals);
  $(".result14").append(finalsArray[1].endFinals);
}

function renderWinner() {
  $(".winner7").append(`<img src="${finalsResult[0].image.url}">`);
}

function clearHeader() {
  $(".container__header--center").empty();
  $(".container__header--right").empty();
}

function addNewHeader() {
  const newHeader = '<button type="button" onclick="playAgain()">NOVA IGRA</button>';
  $(".container__header--center").append(newHeader);
}

function playAgain() {
  $(".container__header--center").empty();
  const pokreni = '<button type="button" onclick="getHeros()">POKRENI</button>';
  $(".container__header--center").append(pokreni);
  $(".tournament-container").remove();
  const startMenu = `
  <div class="container__body">
    <div class="container__body__title">
      <p>ODABERI SVOG SUPERHEROJA!</p>
    </div>
    <div class="container__body__card">
      <div class="container__body__card--inner">
      </div>
    </div>
    <div class="container__body__icons">
      <div class="container__body__icons--inner">
      </div>
    </div>
  </div>`;
  $(".container").after(startMenu);
  clearVariables();
}

function clearVariables() {
  halfFinals = [];
  finalsArray = [];
  finalsResult = [];
}

function renderHerosInTournament() {
  $('.container__body').remove();

  const markup = `
  <div class="tournament-container">
    <div class="first-clmn">
      <img class="hero1" src=${tournamentHeros[0].image.url}>
      <img class="hero2" src=${tournamentHeros[1].image.url}>
      <img class="hero3" src=${tournamentHeros[2].image.url}>
      <img class="hero4" src=${tournamentHeros[3].image.url}>
    </div>
    <div class="scnd-clmn">
      <div class="battle-winner-container">
        <div class="bracket">
          <p><span class="result1"></span>:<span class="result2"></span></p>
        <div></div>
      </div>
      <div class="winner">
        <div class="winner1">
        </div>
      </div>
    </div>

    <div class="battle-winner-container">
      <div class="bracket">
        <p><span class="result3"></span>:<span class="result4"></span></p>
        <div></div>
      </div>
      <div class="winner">
        <div>
          <div class="winner2">
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="last-row">
    
      <div class="battle-winner-container">
        <div class="bracket">
          <p><span class="result9"></span>:<span class="result10"></span></p>
          <div></div>
        </div>
        <div class="winner">
          <div>
            <div class="winner5">
            </div>
          </div>
        </div>
      </div>

      <div class="battle-winner-container" style="transform: rotate(180deg);">
        <div class="bracket">
          <p style="transform: rotate(180deg);"><span class="result11"></span>:<span class="result12"></span></p>
          <div></div>
        </div>
        <div class="winner">
          <div>
            <div class="winner6">
            </div>
          </div>
        </div>
      </div>


  </div>

  <div class="final-winner">
    <div class="battle-winner-container">
      <p>Winner</p>
      <div>
        <div class="winner7">
        </div>
      </div>
    </div>
    <div class="final-bracket">
      <p><span class="result13"></span>:<span class="result14"></span></p>
      <div></div>
    </div>
  </div>
  <div class="scnd-clmn" style="transform: rotate(180deg);">
    <div class="battle-winner-container">
      <div class="bracket">
        <p style="transform: rotate(180deg);"><span class="result6"></span>:<span class="result5"></span></p>
        <div></div>
      </div>
      <div class="winner">
        <div>
          <div class="winner4">
          </div>
        </div>
      </div>
    </div>
    <div class="battle-winner-container">
      <div class="bracket">
        <p style="transform: rotate(180deg);"><span class="result8"></span>:<span class="result7"></span></p>
        <div></div>
      </div>
      <div class="winner">
        <div>
          <div class="winner3">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="first-clmn">
    <img class="hero5" src=${tournamentHeros[4].image.url}>
    <img class="hero6" src=${tournamentHeros[5].image.url}>
    <img class="hero7" src=${tournamentHeros[6].image.url}>
    <img class="hero8" src=${tournamentHeros[7].image.url}>
  </div>
  `
  $(".container").after(markup);
}
