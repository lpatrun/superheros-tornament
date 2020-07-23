class Hero {
  constructor(heroObject) {
    this.name = heroObject.name;
    this.image = heroObject.image.url;
    this.id = heroObject.id;
    this.powerstats = {
      'intelligence': heroObject.powerstats.intelligence,
      'strength': heroObject.powerstats.strength,
      'speed': heroObject.powerstats.speed,
      'durability': heroObject.powerstats.durability,
      'power': heroObject.powerstats.power,
      'combat': heroObject.powerstats.combat
    };
    this.inTournament = this.semiFinals = this.halfFinals = this.endFinals = 0;
  }

  toTournament() {
    this.inTournament = 2;
  }

  fightRound(attacker, defender, tournamentStage) {
    if (attacker > defender) {
      this[tournamentStage] = this[tournamentStage] + 1;
    }
  }
}

let heros = [];
let chosenHero;
let highlightedHero;

function getHeros() {
  heros = [];
  chosenHero = null;
  clearHighlightedHero();
  clearHeroCircles();

  let heroIDs = randomArray();
  for (let i = 0; i < 10; i++) {
    $.getJSON('https://www.superheroapi.com/api.php/10220957965592385/' + heroIDs[i], (data, status) => {
      heros.push(new Hero(data));
    })
      .done(function (data) {
        if (heros.length === 10) {
          showUI();
          generateHeros();
        }
      })
      .fail(function (textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
      });
  }
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

function showUI() {
  $(".container__body").css("display", "block");
  $(".container__header--right-button").css("display", "block");
  $(".container__body__icons--inner").empty();
}

function generateHeros() {
  heros.forEach(element => {
    const markup = `
        <img src="${element.image}" onerror="this.onerror=null;this.src='http://via.placeholder.com/80/dddd44/000000?text=${element.name}'"
        alt="${element.name}" id="${element.id}" onclick="displayId(${element.id})"/>`;
    $('.container__body__icons--inner').append(markup);
  })
  displayId(heros[0].id);
}

function displayId(myID) {
  clearHighlightedHero();
  highlightHeroCircle(myID);

  myID = myID.toString();
  let displayedHero = heros.find(element => element.id === myID);
  chosenHero = displayedHero;

  const markup = `<img src="${displayedHero.image}"
  alt="slika" onerror="this.onerror=null;this.src='http://via.placeholder.com/150/dd1d44/000000?text=${displayedHero.name}'" />
  <div class="container__body__card__title">${displayedHero.name}</div>`
  $('.container__body__card--inner').append(markup);
}

function clearHighlightedHero() {
  $('.container__body__card--inner').empty();
}

function clearHeroCircles() {
  $('.container__body__icons--inner').empty();
}

function highlightHeroCircle(id) {
  if (highlightedHero !== undefined) {
    $(`#${highlightedHero}`).removeClass("chosen-hero")
  }
  $(`#${id}`).addClass("chosen-hero");
  highlightedHero = id;
}

function randomHero() {
  let randomID = Math.floor(Math.random() * 10);
  displayId(heroIDs[randomID]);
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

function startTournament() {
  clearStartMenu();
  clearHeader();
  selectEightHeros(heros, chosenHero);
  renderHerosInTournament();
  toSemiFinals();
}

function clearStartMenu() {
  $('.container__body').css('display', 'none');
  $('.container__body__icons--inner').empty();
  $('.container__body__card--inner').empty();
}

function clearHeader() {
  $(".start-game").css("display", "none");
  $(".container__header--right-button").css("display", "none");
}

function selectEightHeros() {
  const indexOfChosenHero = heros.findIndex(element => element.name === chosenHero.name);
  heros[indexOfChosenHero].toTournament();
  const chosenHeroObject = heros[indexOfChosenHero];
  heros.splice(indexOfChosenHero, 1);
  heros.unshift(chosenHeroObject);
  let herosInTournament;
  do {
    herosInTournament = heros.filter(x => x.inTournament === 2);
    const heroToTournament = Math.floor(Math.random() * 10);
    heros[heroToTournament].toTournament();
  } while (herosInTournament.length < 8);
}

function renderHerosInTournament() {
  const tournamentHeros = heros.filter(x => x.inTournament === 2);
  $('.tournament-container').css('display', 'flex');

  for (let i = 0; i <= 3; i++) {
    $('.first-clmn').append(`<img class="big-pic hero${i + 1}" src=${tournamentHeros[i].image}
      onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${tournamentHeros[i].name}'">`)
  }

  for (let i = 4; i <= 7; i++) {
    $('.seventh-clmn').append(`
      <img class="big-pic hero${i + 1}" src=${tournamentHeros[i].image}
      onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${tournamentHeros[i].name}';">`)
  }
}

function toSemiFinals() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      generateResults("inTournament", "semiFinals");
      deleteSemiFinals();
      renderSemiFinals();
    }, 2000 * (i + 1));
  }
  setTimeout(() => {
    renderHalfFinalists();
    semiLoosers();
    toHalfFinals();
  }, 8200);
}

function generateResults(previousStage, tournamentStage) {
  let firstHeroWins = 0;
  let secondHeroWins = 0;

  let herosToFight = heros.filter(x => x[previousStage] === 2);
  for (let j = 0; j < herosToFight.length; j += 2) {
    firstHeroWins = herosToFight[j][tournamentStage];
    secondHeroWins = herosToFight[j + 1][tournamentStage];

    if (firstHeroWins < 2 && secondHeroWins < 2) {
      roundResult(j, herosToFight, tournamentStage);
    }
  }
}

function roundResult(firstHeroIndex, herosToFight, tournamentStage) {
  let abilities = ["intelligence", "strength", "speed", "durability", "power", "combat"];
  let heroOneAttack = 0;
  let heroTwoAttack = 0;
  for (let i = 0; i < 2; i++) {
    let ability = abilities[Math.floor(Math.random() * 6)];

    herosToFight[firstHeroIndex].powerstats[ability] === "null" ?
      heroOneAttack += 0 :
      heroOneAttack += parseInt(herosToFight[firstHeroIndex].powerstats[ability]);

    herosToFight[firstHeroIndex + 1].powerstats[ability] === "null" ?
      heroTwoAttack += 0 :
      heroTwoAttack += parseInt(herosToFight[firstHeroIndex + 1].powerstats[ability]);
  }
  if (heroOneAttack === heroTwoAttack) {
    heroOneAttack++;
  }
  herosToFight[firstHeroIndex].fightRound(heroOneAttack, heroTwoAttack, tournamentStage);
  herosToFight[firstHeroIndex + 1].fightRound(heroTwoAttack, heroOneAttack, tournamentStage);
}

function deleteSemiFinals() {
  for (let i = 1; i <= 8; i++) {
    $(".result" + i).empty();
  }
}

function renderSemiFinals() {
  const tournamentHeros = heros.filter(x => x.inTournament === 2);
  for (let i = 0; i < 8; i++) {
    $(".result" + (i + 1)).append(tournamentHeros[i].semiFinals);
  }
}

function renderHalfFinalists() {
  let halfFinals = heros.filter(x => x.semiFinals === 2)
  $(".winner1").append(`<img src="${halfFinals[0].image}" class="small-pic"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${halfFinals[0].name}'">`);
  $(".winner2").append(`<img src="${halfFinals[1].image}" class="small-pic"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${halfFinals[1].name}'">`);
  $(".winner3").append(`<img style="transform: rotate(180deg);" src="${halfFinals[2].image}" class="small-pic"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${halfFinals[2].name}'">`);
  $(".winner4").append(`<img style="transform: rotate(180deg);" src="${halfFinals[3].image}" class="small-pic"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${halfFinals[3].name}'">`);
}

function semiLoosers() {
  const tournamentHeros = heros.filter(x => x.inTournament === 2);
  for (let i = 0; i < tournamentHeros.length; i++) {
    if (tournamentHeros[i].semiFinals < 2) {
      const selector = ".hero" + (i + 1);
      $(selector).addClass("loosingChamp");
    }
  }
}

function toHalfFinals() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      generateResults("semiFinals", "halfFinals");
      deleteHalfFinals();
      renderHalfFinals();
    }, 2000 * (i + 1));
  }
  setTimeout(() => {
    renderFinalists();
    halfLoosers();
    toFinals();
  }, 8200);
}

function deleteHalfFinals() {
  for (let i = 9; i <= 12; i++) {
    $(".result" + i).empty();
  }
}

function renderHalfFinals() {
  const halfFinals = heros.filter(x => x.semiFinals === 2)
  for (let i = 0; i <= 3; i++) {
    $(".result" + (i + 9)).append(halfFinals[i].halfFinals);
  }
}

function renderFinalists() {
  const finalsArray = heros.filter(x => x.halfFinals === 2);
  $(".winner5").append(`<img src="${finalsArray[0].image}" class="small-pic"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${finalsArray[0].name}'"
  >`);
  $(".winner6").append(`<img style="transform: rotate(180deg);" src="${finalsArray[1].image}" class="small-pic"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${finalsArray[1].name}'"
  >`);
}

function halfLoosers() {
  const halfFinals = heros.filter(x => x.semiFinals === 2);
  for (let i = 0; i < halfFinals.length; i++) {
    if (halfFinals[i].halfFinals < 2) {
      const selector = ".winner" + (i + 1);
      $(selector).addClass("loosingChamp");
    }
  }
}

function toFinals() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      generateResults("halfFinals", "endFinals");
      deleteFinals();
      renderFinals();
    }, 2000 * (i + 1));
  }
  setTimeout(() => {
    renderWinner();
    finalLooser();
    addNewHeader();
  }, 8200);
}

function deleteFinals() {
  $(".result13").empty();
  $(".result14").empty();
}

function renderFinals() {
  const finalsArray = heros.filter(x => x.halfFinals === 2);
  $(".result13").append(finalsArray[0].endFinals);
  $(".result14").append(finalsArray[1].endFinals);
}

function renderWinner() {
  const finalsResult = heros.filter(x => x.endFinals === 2);
  $(`<img src="${finalsResult[0].image}" class="heroWinner"
  onerror="this.onerror=null;this.src='http://via.placeholder.com/80/FFFF00/000000?text=${finalsResult[0].name}'">`
  ).appendTo(".winner7");
}

function finalLooser() {
  const finalsArray = heros.filter(x => x.halfFinals === 2);
  for (let i = 0; i < finalsArray.length; i++) {
    if (finalsArray[i].endFinals < 2) {
      const selector = ".winner" + (5 + i);
      $(selector).addClass("loosingChamp");
    }
  }
}

function addNewHeader() {
  $(".new-game").css('display', 'block');
}

function playAgain() {
  $(".start-game").css('display', 'block');
  $(".new-game").css('display', 'none');
  $(".tournament-container").css('display', 'none');
  $('.container__body').css('display', 'block');
  removePreviousResults();
  clearBody();
}

function removePreviousResults() {
  $(".first-clmn").empty();
  $(".seventh-clmn").empty();
  for (let i = 1; i <= 7; i++) {
    $(`.winner` + i).empty();
  }
  for (let i = 1; i <= 14; i++) {
    $(`.result` + i).empty();
  }
  for (let i = 0; i < 7; i++) {
    const selector = ".winner" + (i + 1);
    $(selector).removeClass("loosingChamp");
  }
}

function clearBody() {
  $(".container__body").css("display", "none");
}
