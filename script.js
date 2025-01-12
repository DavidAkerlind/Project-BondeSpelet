"use strict";

// =========================
// ===== Globala variablar ======
// =========================
let player1 = {
    name: "Spelare 1",
    money: 10000,
    crops: { potatis: 0, betor: 2, korn: 1, vete: 0, råg: 0 },
    farmType: "Torp",
    placeOnBoard: 0,
};

let season = [
    "0 Årsskifte",
    "1 Första Kvartalet",
    "2 Andra Kvartalet",
    "3 Tredje Kvartalet",
    "4 Fjärde Kvartalet",
];

let startpengar = 10000;

let maxDays = 109;

let plantDays = [28, 33, 38, 43, 48, 53, 58, 63, 68, 78];
let cardDays = [
    7, 12, 19, 24, 31, 36, 43, 48, 55, 60, 67, 72, 79, 84, 91, 96, 103, 108,
];

let hasRolledAgain = false;

let remainingCropsToPlant = 0;
let plantingMessage = document.getElementById("plantingMessage");

// =========================
// ===== Funktioner======
// =========================

function rollDice() {
    let roll = Math.floor(Math.random() * 6) + 1;

    player1.placeOnBoard = player1.placeOnBoard + roll;

    let messageDiv = document.getElementById("message");
    let rollAgainButtonsDiv = document.getElementById("rollAgainButtons");
    let rollAgainButton = document.getElementById("rollAgain");
    let endTurnButton = document.getElementById("endTurn");
    let rollDiceButton = document.getElementById("rollDiceButton");
    let rollDiceSection = document.getElementById("rollDiceSection");

    // Visa resultatet av tärningskastet
    messageDiv.textContent = `Du rullade en ${roll} och hamnade på plats ${player1.placeOnBoard}`;
    console.log(hasRolledAgain);

    if (roll === 6 && !hasRolledAgain) {
        rollDiceButton.style.display = "none";
        rollAgainButton.style.display = "block";
        rollAgainButtonsDiv.style.display = "flex";
        console.log(`Du rullade ${roll}`);

        console.log(hasRolledAgain);

        rollAgainButton.onclick = () => {
            rollAgainButton.style.display = "none";
            rollDice();
            checkPlantDay(player1.placeOnBoard);
        };

        endTurnButton.onclick = () => {
            messageDiv.textContent = `Du har rullat klart och hamnade på plats ${player1.placeOnBoard}`;
            rollAgainButtonsDiv.style.display = "none";
            hasRolledAgain = false;
            rollDiceButton.style.display = "block";
        };
    }
    document.getElementById("placeOnBoard").innerHTML = player1.placeOnBoard;
    return player1.placeOnBoard;
}

function updatePlayerInfo() {
    document.getElementById("farmType").innerHTML = player1.farmType;
    document.getElementById("money").innerHTML = `${player1.money} kr`;
    document.getElementById("placeOnBoard").innerHTML = player1.placeOnBoard;

    // Uppdatera grödorna
    document.getElementById("potatis").innerHTML = player1.crops.potatis;
    document.getElementById("betor").innerHTML = player1.crops.betor;
    document.getElementById("korn").innerHTML = player1.crops.korn;
    document.getElementById("vete").innerHTML = player1.crops.vete;
    document.getElementById("rag").innerHTML = player1.crops.råg;
}

function checkPlantDay(placeOnBoard) {
    for (let i = 0; i < plantDays.length; i++) {
        if (placeOnBoard === plantDays[i]) {
            console.log("Du hamnade på en planterings dag " + placeOnBoard);
            plantingMessage.textContent = "";
            plantDay(placeOnBoard);
        }
    }
}

function plantDay(placeOnBoard) {
    rollDiceSection.style.display = "none";
    document.getElementById("plantingDay").style.display = "block";
    let plantDayMessage = document.getElementById("plantDayMessage");

    plantDayMessage.textContent = `Du har hamnat på plats ${placeOnBoard} vilket är en planteringsdag!
       dra ett kort: `;
    document.getElementById("plantAmountCards").style.display = "block";
    let plantCards = document.querySelectorAll(".plantCard");

    plantCards.forEach((plantCard) => {
        plantCard.addEventListener("click", () => selectCard());
    });
    // rollDiceSection.style.display = "block";
}

function selectCard() {
    document.getElementById("plantAmountCards").style.display = "none";
    document.getElementById("selectedCard").style.display = "block";

    let cropsToPlant = Math.floor(Math.random() * 4) + 1;
    let plantPossibleMessage = document.getElementById("plantPossibleMessage");
    plantPossibleMessage.textContent = `Du valde ett kort och får plantera ${cropsToPlant}! grödor.`;

    createCropButtons(cropsToPlant);
}

function createCropButtons(cropsToPlant) {
    remainingCropsToPlant = cropsToPlant;

    document.getElementById("selectedCard").style.display = "block";
    document.getElementById("cropButtons").style.display = "block";
    let cropButtonsDiv = document.getElementById("cropButtons");

    cropButtonsDiv.innerHTML = ""; //rensa tidigare knappar

    // kollar vilka grödor som vi har planterat redan
    let availableCrops = Object.keys(player1.crops).filter(
        (crop) => player1.crops[crop] > 0
    );
    console.log(" detta är de tillgängliga cropsen " + availableCrops);

    availableCrops.forEach((crop) => {
        let button = document.createElement("button");
        button.textContent = crop;
        button.addEventListener("click", () => plantCrops(crop));
        cropButtonsDiv.appendChild(button);
    });
}

function plantCrops(crop) {
    document.getElementById("plantingMessage").style.display = "block";

    if (remainingCropsToPlant > 0) {
        player1.crops[crop]++;
        remainingCropsToPlant--;
        console.log(crop);
        console.log(remainingCropsToPlant);
        plantingMessage.textContent = `Du planterade 1 ${crop}. Kvar att plantera: ${remainingCropsToPlant}`;

        updatePlayerInfo();
    }
    if (remainingCropsToPlant === 0) {
        plantingMessage.textContent = "Du har planterat alla dina grödor!";
        document.getElementById("plantingDay").style.display = "none";
        document.getElementById("selectedCard").style.display = "none";
        document.getElementById("rollDiceSection").style.display = "block"; // Återställ till tärningsfasen
    }
}

function checkCardDay(placeOnBoard) {
    for (let i = 0; i < cardDays.length; i++) {
        if (placeOnBoard === cardDays[i]) {
            let season = checkSeason(placeOnBoard);
            console.log("Du hamnade på en Röd dag! " + placeOnBoard + season);
        }
    }
}

function checkSeason(placeOnBoard) {
    switch (true) {
        case placeOnBoard === 109:
            console.log(season[0]);
            break;
        case placeOnBoard > 0 && placeOnBoard <= 27:
            console.log(season[1]);
            break;
        case placeOnBoard > 27 && placeOnBoard <= 54:
            console.log(season[2]);
            break;
        case placeOnBoard > 54 && placeOnBoard <= 81:
            console.log(season[3]);
            break;
        case placeOnBoard > 81 && placeOnBoard <= 108:
            console.log(season[4]);
            break;
    }
}

function cardDay(placeOnBoard) {}
// =========================
// ===== Själva spelet======
// =========================

updatePlayerInfo();

document.getElementById("rollDiceButton").addEventListener("click", () => {
    updatePlayerInfo();
    player1.placeOnBoard = rollDice();
    checkPlantDay(player1.placeOnBoard);
    checkCardDay(player1.placeOnBoard);
});

document.addEventListener("DOMContentLoaded", () => {
    // Initiering av eventlisteners och funktioner
});
