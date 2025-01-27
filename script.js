"use strict";

// =========================
// ===== Globala variablar ======
// =========================
let player1 = {
    name: "Spelare 1",
    money: 10000,
    crops: { potatis: 4, betor: 0, korn: 0, vete: 0, råg: 0 },
    farmType: "Torp",
    placeOnBoard: 0,
    hasInsurance: true,
};

let season = [
    "0 Årsskifte",
    "1 första kvartalet",
    "2 andra kvartalet",
    "3 tredje kvartalet",
    "4 fjärde kvartalet",
];

let startpengar = 10000;

let maxDays = 109;

let plantDays = [28, 33, 38, 43, 48, 53, 58, 63, 68, 78];
let cardDays = [
    7, 12, 19, 24, 31, 36, 42, 47, 55, 60, 67, 72, 79, 84, 91, 96, 103, 108,
];

let hasRolledAgain = false;

let remainingCropsToPlant = 0;
let plantingMessage = document.getElementById("plantingMessage");

let cardDayMessage = document.getElementById("cardDayMessage");

let rollDiceSection = document.getElementById("rollDiceSection");

let cardDayCardMessage = document.getElementById("cardDayCardMessage");

let cardDaytThirdMessage = document.getElementById("cardDaytThirdMessage");

const eventCards = {
    1: [
        {
            message: "Du hittade en skatt på din åker! +1000 kr",
            effect: () => (player1.money += 1000),
        },
        {
            message: "En storm förstörde en del av dina grödor! -2 grödor",
            effect: () => removeRandomCrops(2),
        },
        {
            message: "Vädret var gynnsamt och dina grödor växte! +1 gröda",
            effect: () => addRandomCrops(1),
        },
        {
            message: "Din gräsklippare gick sönder. -300 kr",
            effect: () => (player1.money -= 300),
        },
    ],
    2: [
        {
            message: "Vädret var gynnsamt och dina grödor växte! +2 gröda",
            effect: () => addRandomCrops(2),
        },
        {
            message: "Du tog en weekend i Stöckhölm. -3.000 och -1 gröda",
            effect: () => {
                player1.money -= 1800;
                removeRandomCrops(1);
            },
        },
        {
            message: "Du råkade skjuta grannens hund. -1.800kr",
            effect: () => (player1.money -= 1800),
        },
        {
            message: "Du sålde 3 kattungar. +300kr",
            effect: () => (player1.money += 300),
        },
    ],
    3: [
        {
            message: "Vädret var gynnsamt och dina grödor växte! <br> +2 gröda",
            effect: () => addRandomCrops(2),
        },
        {
            message:
                "Du bytte fönster hos jönsons fönster och trädgård. -500kr",
            effect: () => (player1.money -= 500),
        },
        {
            message: "Du vann på travet! +10.000kr",
            effect: () => (player1.money += 10000),
        },
        {
            message:
                "Ditt jordburk brann ned. Betala: Torp: 50.000kr, Gård: 200.000kr, Herrgård: 750.000kr. Om du har försäkrning få samma belopp från banken",
            effect: () => {
                let cost = 0;

                if (player1.farmType === "Torp") {
                    cost = 50000;
                } else if (player1.farmType === "Gård") {
                    cost = 200000;
                } else if (player1.farmType === "Herrgård") {
                    cost = 750000;
                }

                if (player1.hasInsurance) {
                    player1.money += cost;
                    cardDaytThirdMessage.style.backgroundColor =
                        "rgb(144, 240, 141)";
                    cardDaytThirdMessage.textContent = `Du har försäkring! Eftersom har ${player1.farmType} får du ${cost} kr från banken.`;
                    console.log(
                        `Du har försäkring! Eftersom har ${player1.farmType} får du ${cost} kr från banken.`
                    );
                } else {
                    player1.money -= cost;
                    cardDaytThirdMessage.style.backgroundColor =
                        "rgb(240, 141, 141)";
                    cardDaytThirdMessage.textContent = `Ingen försäkring! Du betalar ${cost} kr själv.`;
                    console.log(
                        `Ingen försäkring! Du betalar ${cost} kr själv.`
                    );
                }
                setTimeout(() => {
                    cardDaytThirdMessage.textContent = `Spelarens pengar efter branden: ${player1.money} kr`;
                    console.log(
                        `Dina pengar efter branden: ${player1.money} kr`
                    );
                }, 6000);
            },
        },
    ],
    4: [
        {
            message: "Du sålde 150 julgranar. +7.500kr",
            effect: () => (player1.money += 7500),
        },
        {
            message: "Du köpte julkappar till dina barn. -1.000kr",
            effect: () => (player1.money -= 1000),
        },
        {
            message: "Du råkade skjuta grannens hund igen! -1.800kr",
            effect: () => (player1.money -= 1800),
        },
        {
            message: "Du sålde fisk som du pimplat upp ur sjön. +500kr",
            effect: () => (player1.money += 500),
        },
    ],
};

// =========================
// ===== Funktioner======
// =========================

function rollDice() {
    //let roll = Math.floor(Math.random() * 6) + 1;
    let roll = 79;
    player1.placeOnBoard = player1.placeOnBoard + roll;

    let rollMessageDiv = document.getElementById("rollMessage");
    let rollAgainButtonsDiv = document.getElementById("rollAgainButtons");
    let rollAgainButton = document.getElementById("rollAgain");
    let endTurnButton = document.getElementById("endTurn");
    let rollDiceButton = document.getElementById("rollDiceButton");

    rollMessageDiv.textContent = `Du rullade en ${roll} och hamnade på plats ${player1.placeOnBoard}`;
    console.log("hasRolledAgain: " + hasRolledAgain);
    console.log(`Du rullade: ${roll}`);

    if (roll === 6 && !hasRolledAgain) {
        rollDiceButton.style.display = "none";
        rollAgainButton.style.display = "block";
        rollAgainButtonsDiv.style.display = "flex";
        console.log(`En sexa! : ${roll}`);

        console.log("hasRolledAgain inuti if roll == 6: " + hasRolledAgain);

        rollAgainButton.onclick = () => {
            rollAgainButton.style.display = "none";
            rollDice();
            checkPlantDay(player1.placeOnBoard);
        };

        endTurnButton.onclick = () => {
            rollMessageDiv.textContent = `Du har rullat klart och hamnade på plats ${player1.placeOnBoard}`;
            rollAgainButtonsDiv.style.display = "none";
            hasRolledAgain = false;
            rollDiceButton.style.display = "block";
        };
    }
    document.getElementById("placeOnBoard").innerHTML = player1.placeOnBoard;
    return player1.placeOnBoard;
}

function updatePlayerInfo() {
    document.getElementById("hasInsurance").innerHTML = player1.hasInsurance;
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
            console.log("Du hamnade på en Röd dag! ");
            console.log(
                "placeOnBoard:  " + placeOnBoard + " Säsong: " + season
            );
            cardDay(placeOnBoard, season);
        }
    }
}

function checkSeason(placeOnBoard) {
    switch (true) {
        case placeOnBoard === 109:
            return season[0];
        case placeOnBoard > 0 && placeOnBoard <= 27:
            return season[1];
        case placeOnBoard > 27 && placeOnBoard <= 54:
            return season[2];
        case placeOnBoard > 54 && placeOnBoard <= 81:
            return season[3];
        case placeOnBoard > 81 && placeOnBoard <= 108:
            return season[4];
        default:
            console.log("ogiltigt vätde för placeOnBoard: " + placeOnBoard);
            return "ogiltigt vätde för placeOnBoard: " + placeOnBoard;
    }
}

function cardDay(placeOnBoard, season) {
    document.getElementById("cardDay").style.display = "block";

    rollDiceSection.style.display = "none";
    console.log("cardDay Starts here season: " + season);

    let seasonNowNumber = parseInt(season.charAt(0)); // tar ut första bokstaven i season och konverterar till en siffra
    console.log(`seasonNowNumber är: ${seasonNowNumber}`);

    cardDayMessage.textContent = `Du har hamnat på ruta ${placeOnBoard} som är en röd dag i ${season
        .substring(1)
        .trim()}, och får dra ett händelsekort! `;
    console.log(`Du är i ${season.substring(1).trim()}`);

    let htmlEventCards = document.querySelectorAll(".eventCard");
    let drawcardsDiv = document.getElementById("drawcards");

    let cardsInRightSeason = eventCards[seasonNowNumber]; // denna är alla kort i rätt säsong
    //let randomIndexForCard = Math.floor(
    //    Math.random() * cardsInRightSeason.length         denna är det som ranomiserar vilet kort man får
    // );
    let randomIndexForCard = 3; // denna väljer just nu vilket händelsekort man får
    let chosenCard = cardsInRightSeason[randomIndexForCard];

    htmlEventCards.forEach((card) => {
        card.addEventListener("click", () => {
            // Döljer alla kort efter klick

            drawcardsDiv.style.display = "none";
            document.getElementById("cardDayCard").style.display = "flex";
            cardDayCardMessage.style.display = "block";
            cardDaytThirdMessage.style.display = "block";
            cardDayCardMessage.textContent = chosenCard.message;
            cardDayMessage.textContent = `Du har hamnat på ruta ${placeOnBoard} som är en röd dag i ${season
                .substring(1)
                .trim()}, och har dragit ett kort, kortet lyder: `;
            console.log(`${card.id} klickades!`);
            chosenCard.effect();

            setTimeout(() => {
                updatePlayerInfo();
            }, 2500);
        });
    });
}

function removeRandomCrops(amountToRemove) {
    // Filtrera ut grödor som har fler än 0
    let availableCrops = Object.keys(player1.crops).filter(
        (crop) => player1.crops[crop] > 0
    );

    console.log("availableCrops: " + availableCrops);

    // Om det inte finns några grödor, avsluta funktionen
    if (availableCrops.length === 0) {
        cardDaytThirdMessage.textContent = "Inga grödor att ta bort!";
        console.log("Inga grödor att ta bort!");
        return;
    }
    cardDaytThirdMessage.style.backgroundColor = "rgb(240, 141, 141)";
    cardDaytThirdMessage.textContent = `Du mister ${amountToRemove} grödor`;

    // Ta bort "amountToRemove" grödor slumpmässigt
    for (let i = 0; i < amountToRemove; i++) {
        if (availableCrops.length === 0) break; // Avsluta om inga grödor finns kvar
        console.log("availableCrops: " + availableCrops);

        // Slumpa en gröda från de tillgängliga
        let randomIndex = Math.floor(Math.random() * availableCrops.length);
        let randomCrop = availableCrops[randomIndex];

        // Minska grödans antal
        player1.crops[randomCrop]--;

        // Ta bort grödan från listan om den nu är tom
        if (player1.crops[randomCrop] === 0) {
            availableCrops.splice(randomIndex, 1);
        }

        let cropSpan = document.getElementById(randomCrop);
        let indicatorSpan = document.createElement("span");
        indicatorSpan.className = "indicator-span";

        indicatorSpan.textContent = "-1";
        indicatorSpan.style.backgroundColor = "rgb(240, 141, 141)";
        console.log(
            `randomCrop: ${randomCrop} cropspan: ${cropSpan} indicatorSpan: ${indicatorSpan}`
        );
        cropSpan.appendChild(indicatorSpan);

        setTimeout(() => {
            indicatorSpan.textContent = "";
        }, 2400);

        console.log(`-1 ${randomCrop}`);
    }

    console.log("Uppdaterade grödor:", player1.crops);
}

function addRandomCrops(amountToAdd) {
    // Lista över grödor som kan läggas till
    let availableCrops = Object.keys(player1.crops).filter(
        (crop) => player1.crops[crop] > 0
    );
    console.log("availableCrops: " + availableCrops);
    cardDaytThirdMessage.style.backgroundColor = "rgb(144, 240, 141)";
    cardDaytThirdMessage.textContent = `Du får +${amountToAdd} gröda`;

    // Lägg till "amountToAdd" grödor slumpmässigt
    for (let i = 0; i < amountToAdd; i++) {
        // Slumpa en gröda från tillgängliga grödor
        let randomIndex = Math.floor(Math.random() * availableCrops.length);
        let randomCrop = availableCrops[randomIndex];

        // Lägg till en enhet av den slumpmässiga grödan
        player1.crops[randomCrop]++;

        // Ta bort grödan från listan om den nu är tom
        if (player1.crops[randomCrop] === 0) {
            availableCrops.splice(randomIndex, 1);
        }

        let cropSpan = document.getElementById(randomCrop);
        let indicatorSpan = document.createElement("span");

        indicatorSpan.textContent = "+1";
        indicatorSpan.style.backgroundColor = "rgb(144, 240, 141)";

        console.log(
            `randomCrop: ${randomCrop} cropspan: ${cropSpan} indicatorSpan: ${indicatorSpan}`
        );
        cropSpan.appendChild(indicatorSpan);

        setTimeout(() => {
            indicatorSpan.textContent = "";
        }, 5000);

        console.log(`+1 ${randomCrop}`);
    }

    console.log("Uppdaterade grödor:", player1.crops);
}

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
