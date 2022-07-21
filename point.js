const data = require("./SkillData.json");

const skills = data.skills;

let list = [];
let valueList = [];
let sortedValueList = [];
let sortedList = [];
function sortByEfficiencyPoint() {}

for (const id in skills) {
  let allCastDelay = 0;
  let allPoints = 0;
  if (Array.isArray(skills[id].castingTime)) {
    for (const element of skills[id].castingTime) {
      allCastDelay = allCastDelay + element;
    }
  } else {
    allCastDelay = skills[id].castingTime;
  }
  if (Array.isArray(skills[id].ragnarokPoint)) {
    for (const element of skills[id].ragnarokPoint) {
      allPoints = allPoints + element;
    }
  } else {
    allPoints = skills[id].ragnarokPoint;
  }
  if (allPoints / allCastDelay > 0 && !isNaN(allPoints / allCastDelay)) {
    list.push([
      skills[id].name,
      id,
      Math.floor((allPoints / allCastDelay) * 100000) / 100,
      0,
    ]);
  }
}

// console.log(list);

for (const element of list) {
  valueList.push(element[2]);
}

valueList.sort((a, b) => -a + b);

for (let i = 0; i < valueList.length; i++) {
  for (let j = 0; j < list.length; j++) {
    if (list[j][2] == valueList[i]) {
      sortedList.push(list[j]);
    }
  }
}

// console.log(sortedList);

// for (let element of sortedList) {
//   if (element[1] != (8 || 17)) {
//     if (
//       element[0] == ("Runeburst" || "Shining Crescent") &&
//       currentRunemark > 6 &&
//       element[3] <= currentTime
//     ) {
//       rotation.push(element[0]);
//       currentPoint = currentPoint + skills.element[1].ragnarokPoint;
//       currentRunemark = 0;
//       element[3] = currentTime + skills.element[1].cooldown;
//     }
//     if (
//       rotation[rotation.lenght - 1] == "Leaping Slash" &&
//       element[0] == ("Ground Bash" || "Glaive Strike")
//     ) {
//       rotation.push(element[0]);
//       currentPoint = currentPoint + skills.element[1].ragnarokPoint;
//       currentRunemark = currentRunemark + skills.element[1].runemark;
//       element[3] = currentTime + skills.element[1].cooldown;
//     }
//   }
// }

let currentRunemark = 0;
let currentPoint = 0;
let currentTime = 0;
let reset = false;

let rotation = [];

// function createRotation() {
//   while (currentPoint < 1001 && currentTime < 40000) {
//     for (let element of sortedList) {
//       if (element[1] != (8 || 17)) {
//         switch (element[0]) {
//           case element[0] == ("Runeburst" || "Shining Crescent") &&
//             currentRunemark > 6 &&
//             element[3] <= currentTime:
//             action(element, currentTime, currentRunemark, currentPoint);
//             break;
//           case rotation[rotation.lenght - 1] == "Leaping Slash" &&
//             element[0] == ("Ground Bash" || "Glaive Strike") &&
//             element[3] <= currentTime:
//             action(element, currentTime, currentRunemark, currentPoint);
//             break;
//           case element[0] !=
//             ("Ground Bash" ||
//               "Glaive Strike" ||
//               "Runeburst" ||
//               "Shining Crescent") && element[3] <= currentTime:
//             action(element, currentTime, currentRunemark, currentPoint);
//             break;
//         }
//       }
//     }
//   }
//   return [rotation, currentTime];
// }

for (let i = 0; currentTime < 40000; i++) {
  element = sortedList[i];
  if (element[0] != "Titansbane" && element[0] != "Balder's Tears") {
    // console.log(element[0]);
    if (
      (element[0] == "Runeburst" || element[0] == "Shining Crescent") &&
      currentRunemark > 6 &&
      element[3] <= currentTime
    ) {
      action(element, currentTime, currentRunemark, currentPoint);
    }
    if (
      rotation[rotation.lenght - 1] == "Leaping Slash" &&
      (element[0] == "Ground Bash" || element[0] == "Glaive Strike") &&
      element[3] <= currentTime
    ) {
      action(element, currentTime, currentRunemark, currentPoint);
    }
    if (element[0] == "Leaping Slash" && reset) {
      action(element, currentRunemark, currentPoint, i);
      element[3] = currentTime;
      reset = false;
    }
    if (
      element[0] != "Runeburst" &&
      element[0] != "Shining Crescent" &&
      element[0] != "Ground Bash" &&
      element[0] != "Glaive Strike" &&
      element[3] <= currentTime
    ) {
      action(element, currentRunemark, currentPoint);
    }
  }
}

// element = sortedList[0];
// console.log(element[0]);

function action(element, currentRunemark, currentPoint) {
  if (element[0] == "Runeburst" || element[0] == "Shining Crescent") {
    currentRunemark = 0;
  } else {
    currentPoint = currentPoint + skills[element[1]].ragnarokPoint;
  }
  if (Array.isArray(skills[element[1]].castingTime)) {
    for (const each of skills[element[1]].castingTime) {
      currentTime = currentTime + each;
    }
  } else {
    currentTime = currentTime + skills[element[1]].castingTime;
  }
  element[0] == "Gungnir's Bite" ||
  element[0] == "Windslash" ||
  element[0] == "Spinning Death" ||
  (element[0] == "Dream Slash" && currentRunemark > 0)
    ? (reset = true)
    : "";
  rotation.push(element[0]);
  currentRunemark = currentRunemark + skills[element[1]].runemark;
  element[3] = currentTime + skills[element[1]].cooldown;
  i = 0;
  return element, currentTime, currentRunemark, currentPoint, i;
}

// console.log(sortedList);
// console.log(rotation);
