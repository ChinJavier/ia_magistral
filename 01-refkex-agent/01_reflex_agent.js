// MIT License
// Copyright (c) 2020 Luis Espino

const statesArray = [
  {
    cleanerPos: "A",
    aBox: "DIRTY",
    bBox: "DIRTY",
    stateNumber: 1,
  },
  {
    cleanerPos: "B",
    aBox: "DIRTY",
    bBox: "DIRTY",
    stateNumber: 2,
  },
  {
    cleanerPos: "A",
    aBox: "DIRTY",
    bBox: "CLEAN",
    stateNumber: 3,
  },
  {
    cleanerPos: "B",
    aBox: "DIRTY",
    bBox: "CLEAN",
    stateNumber: 4,
  },
  {
    cleanerPos: "A",
    aBox: "CLEAN",
    bBox: "DIRTY",
    stateNumber: 5,
  },
  {
    cleanerPos: "B",
    aBox: "CLEAN",
    bBox: "DIRTY",
    stateNumber: 6,
  },
  {
    cleanerPos: "A",
    aBox: "CLEAN",
    bBox: "CLEAN",
    stateNumber: 7,
  },
  {
    cleanerPos: "B",
    aBox: "CLEAN",
    bBox: "CLEAN",
    stateNumber: 8,
  },
];

const finishIteration = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

const isFinishIteration = () => {
  let finish = true;
  finishIteration.forEach((state) => {
    if (!state) finish = false;
  });
  return finish;
};

// 0 = no hizo nada  [00, 10]
// 1 = basura en A   [11, 30]
// 2 = basura en B   [31, 50]
const generateRandomTrash = (max, min) => {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  if (randomNumber >= 0 && randomNumber < 11) return 0;
  if (randomNumber >= 11 && randomNumber < 31) return 1;
  return 2;
};

const getState = (cleanerPos, aBox, bBox) => {
  const actualState = statesArray.find((state) => {
    return (
      state.cleanerPos === cleanerPos &&
      state.aBox === aBox &&
      state.bBox === bBox
    );
  });
  finishIteration[actualState.stateNumber - 1] = true;
  return actualState.stateNumber;
};

const timeToSleep = (time) => {
  return new Promise((res) => setTimeout(res, time));
};

const paintHmtl = (cleanerPos, action_result, aBox, bBox) => {
  const stateNumber = getState(cleanerPos, aBox, bBox);
  document.getElementById("log").innerHTML += "<br>Cleaner in: "
    .concat(cleanerPos)
    .concat(" | Action: ")
    .concat(action_result)
    .concat(" | State: ")
    .concat(stateNumber);
  const idToPaint = "state" + stateNumber;
  document.getElementById(idToPaint).style.backgroundColor = "green";
};

const reflex_agent = (location, state) => {
  if (state == "DIRTY") return "CLEAN";
  else if (location == "A") return "RIGHT";
  else if (location == "B") return "LEFT";
};

const test = async (states) => {
  let loopFlag = true;

  while (loopFlag) {
    var location = states[0];
    var state = states[0] == "A" ? states[1] : states[2];
    var action_result = reflex_agent(location, state);

    paintHmtl(location, action_result, states[1], states[2]);

    if (action_result == "CLEAN") {
      if (location == "A") states[1] = "CLEAN";
      else if (location == "B") states[2] = "CLEAN";
    } else if (action_result == "RIGHT") states[0] = "B";
    else if (action_result == "LEFT") states[0] = "A";
    await timeToSleep(1000);

    const trash = generateRandomTrash(0, 50);
    if (trash != 0) {
      states[trash] = "DIRTY";
      document.getElementById(
        "log"
      ).innerHTML += `<br>************ SE AGREGA BASURA EN ${trash}************`;
    }
    if (isFinishIteration()) {
      document.getElementById(
        "log"
      ).innerHTML += `<br>-----------HEMOS FINALIZADO-----------`;
      loopFlag = false;
    }
  }
};

var states = ["A", "DIRTY", "DIRTY"];
test(states);
