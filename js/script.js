//array objekata heroja
let heros = [];
//odabrani heroj, nalazi se i u glavnoj kartici
let chosenHero;
//array 10 random ID-eva od 1-731
let heroIDs = [];
//highlighted hero za dodavanje boje u kružiće sa ikonama heroja
let highlightedHero;


//dobivanje heroja
function getHeros() {
  //čistka arraya, glavne kartice i ikona heroja zato što se ova fija može više puta pokrenuti
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
  addUI();
  setTimeout(() => { displayId(heros[0].id); }, 600)
}

//niz 10 random brojeva da se učitaju ti heroji
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

//display heroja u centralnu karticu
function displayId(myID) {
  //uklanjanje i dodavanje klase za ikone heroja
  clearHighlightedHero();
  highlightHeroCircle(myID);

  //traženje heroja u glavnom arrayu heroja
  myID = myID.toString();
  let displayedHero = heros.find(element => element.id === myID);
  chosenHero = displayedHero;

  //render heroja u glavnu karticu
  const markup = `<img src="${displayedHero.image.url}" alt="slika" />
  <div class="container__body__card__title">${displayedHero.name}</div>`
  $('.container__body__card--inner').append(markup);
}

//čisti centralnu karticu, kod ponovnog pozivanja iz baze i prilikom odabira drugog heroja
function clearHighlightedHero() {
  $('.container__body__card--inner').remove();
  let innerMarkup1 = '<div class="container__body__card--inner"></div>';
  $('.container__body__card').append(innerMarkup1);
}

//dodaje heroje kao male kružiće u UI
function clearHeroCircles() {
  $('.container__body__icons--inner').remove();
  let innerMarkup2 = '<div class="container__body__icons--inner"></div>';
  $('.container__body__icons').append(innerMarkup2);
}

//za pokretanje turnira, trenutno samo loga odabranog heroja koji se nalazi u centralnoj kartici
function startTournament() {
  console.log(chosenHero);
}

//da se odabere random heroj za u centralnu karticu
function randomHero() {
  let randomID = Math.floor(Math.random() * 10);
  displayId(heroIDs[randomID]);
}

//dodaje chosen-hero klasu da kružić odabranog heroja bude u boji
//kad se stisne novi, poziva se funkcija. highlightedHero služi kao spremnik za ID prethodno označenog heroja
function highlightHeroCircle(id) {
  if (highlightedHero !== undefined) {
    $(`#${highlightedHero}`).removeClass("chosen-hero")
  }
  $(`#${id}`).addClass("chosen-hero");
  highlightedHero = id;
}

//prebacivanje heroja nalijevo
function switchLeft() {
  let currentHeroIndex = heros.findIndex(element => element.id === chosenHero.id);
  currentHeroIndex--;
  if (currentHeroIndex < 0) {
    currentHeroIndex = 9;
  }
  displayId(heros[currentHeroIndex].id);
}

//prebacivanje heroja udesno
function switchRight() {
  let currentHeroIndex = heros.findIndex(element => element.id === chosenHero.id);
  currentHeroIndex++;
  if (currentHeroIndex > 9) {
    currentHeroIndex = 0;
  }
  displayId(heros[currentHeroIndex].id);
}

//dodavanje elemenata u UI pomoću kojih se šaltaju heroji i nastavlja turnir
function addUI() {
  //prvo sve pobrisat ako postoji da se ne bi ui nakrcavao
  $('.gray__container').remove();
  $('.container__randomizer').remove();
  $(".container__header--right").empty();

  const markupSwitches = '<div class="switch__left"><div class="switch__left--arrow" onclick="switchLeft()">&#8592;</div></div><div class="switch__right"><div class="switch__right--arrow" onclick="switchRight()">&#8594;</div></div>';
  $(".container__body__card").append(markupSwitches);

  const randomizer = '<div class="container__randomizer"><p onclick="randomHero()">Random heroj</p></div>';
  $(".container__body__card").after(randomizer);

  const startTour = '<button onclick="startTournament()">NASTAVI &#8594;</button>'
  $(".container__header--right").append(startTour);
}