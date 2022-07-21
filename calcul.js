const Value = require("./Value.json");

const timeGodsfall = Value.BuffTime.Godsfall;

const cdGF = Value.SkillProperties.Godsfall;
const cdTB = Value.SkillProperties.Titansbane[0];

const ctTB = Value.SkillProperties.Titansbane[1];

const timeFight = (Value.FightTime[0] * 60 + Value.FightTime[1]) * 1000;
const tank = Value.Tank;
const CDR = Value.CDR;

const acceptableDelay = Value.AcceptableDelayingTime;

function calculRotation(timeBuildVar, forceThreeRagna, glyphe, showInfos) {
  let nextTimeGF = 0;
  let nextTimeTB = 0;

  let currentTime = 0;

  let uptimeGF = 0;
  let uptimeRagna = 0;

  let uptimeGFPerCent = 0;
  let uptimeRagnaPerCent = 0;
  let uptimeBurstPerCent = 0;

  let numberOfCastGF = 0;
  let numberOfCastRagna = 0;
  let numberOfBuild = 0;

  let lastActionBurst = false;

  let timeRagnarok = 0;

  let SC_Cast = 0;
  let remainingTimeinGF = 0;
  let remainingTimeinRagna = 0;

  glyphe
    ? (timeRagnarok = Value.BuffTime.Ragnarok[1])
    : (timeRagnarok = Value.BuffTime.Ragnarok[0]);

  while (currentTime < timeFight) {
    if (!lastActionBurst && currentTime < timeFight) {
      if (currentTime >= nextTimeGF) {
        showInfos
          ? console.log(
              "\x1b[33m",
              "GF",
              "\x1b[0m",
              "start at " +
                Math.floor(((currentTime / 1000) % (60 * 60)) / 60) +
                "min, " +
                Math.ceil(((currentTime / 1000) % (60 * 60)) % 60) +
                "s"
            )
          : "";
        lastActionBurst = true;
        if (timeFight < currentTime + timeGodsfall) {
          showInfos
            ? console.log(
                "\x1b[33m",
                "GF",
                "\x1b[0m",
                " not finished, fight end at " +
                  Value.FightTime[0] +
                  " min : " +
                  Value.FightTime[1] +
                  " s"
              )
            : "";
          remainingTimeinGF = timeFight - currentTime;
          uptimeGF = uptimeGF + (timeFight - currentTime);
          currentTime = timeFight;
        } else {
          nextTimeGF = currentTime + cdGF;
          currentTime = currentTime + timeGodsfall;
          uptimeGF = uptimeGF + timeGodsfall;
          // showInfos
          //   ? console.log(
          //       " Next GF at " +
          //         Math.floor(((nextTimeGF / 1000) % (60 * 60)) / 60) +
          //         "min, " +
          //         Math.ceil(((nextTimeGF / 1000) % (60 * 60)) % 60) +
          //         "s"
          //     )
          //   : "";
        }
        numberOfCastGF++;
      } else {
        if (
          nextTimeGF != 0 &&
          nextTimeGF - currentTime < acceptableDelay &&
          !forceThreeRagna &&
          nextTimeGF > currentTime
        ) {
          showInfos
            ? console.log(
                "Delay to match GF " + (nextTimeGF - currentTime) / 1000 + "s"
              )
            : "";
          currentTime = nextTimeGF;
        } else {
          showInfos
            ? console.log(
                "\x1b[31m",
                "Ragna",
                "\x1b[0m",
                "start at " +
                  Math.floor(((currentTime / 1000) % (60 * 60)) / 60) +
                  "min, " +
                  Math.ceil(((currentTime / 1000) % (60 * 60)) % 60) +
                  "s"
              )
            : "";
          lastActionBurst = true;
          if (timeFight < currentTime + timeRagnarok) {
            showInfos
              ? console.log(
                  "\x1b[31m",
                  "Ragna",
                  "\x1b[0m",
                  "not finished, fight end at " +
                    Value.FightTime[0] +
                    " min : " +
                    Value.FightTime[1] +
                    " s"
                )
              : "";
            remainingTimeinRagna = timeFight - currentTime;
            uptimeRagna = uptimeRagna + (timeFight - currentTime);
            currentTime = timeFight;
          } else {
            currentTime = currentTime + timeRagnarok;
            uptimeRagna = uptimeRagna + timeRagnarok;
          }
          numberOfCastRagna++;
        }
      }
    }

    if (lastActionBurst && currentTime < timeFight) {
      if (
        (currentTime >= nextTimeTB && forceThreeRagna) ||
        (timeFight - currentTime < timeBuildVar && nextTimeTB < currentTime) ||
        (nextTimeGF - currentTime > timeBuildVar * 0.4 &&
          nextTimeTB < currentTime &&
          nextTimeGF > 0)
      ) {
        showInfos
          ? console.log(
              "\x1b[43m",
              "TB",
              "\x1b[0m",
              "start at " +
                Math.floor(((currentTime / 1000) % (60 * 60)) / 60) +
                "min, " +
                Math.ceil(((currentTime / 1000) % (60 * 60)) % 60) +
                "s"
            )
          : "";
        nextTimeTB = currentTime + cdTB;
        currentTime = currentTime + ctTB;
        // showInfos
        //   ? console.log(
        //       " Next TB at " +
        //         Math.floor(((nextTimeTB / 1000) % (60 * 60)) / 60) +
        //         "min, " +
        //         Math.ceil(((nextTimeTB / 1000) % (60 * 60)) % 60) +
        //         "s"
        //     )
        //   : "";
      } else {
        showInfos
          ? console.log(
              " Build start at " +
                Math.floor(((currentTime / 1000) % (60 * 60)) / 60) +
                "min, " +
                Math.ceil(((currentTime / 1000) % (60 * 60)) % 60) +
                "s"
            )
          : "";
        currentTime = currentTime + timeBuildVar;
        numberOfBuild++;
      }
      lastActionBurst = false;
    }
  }
  uptimeRagnaPerCent = Math.floor((uptimeRagna / currentTime) * 100) / 100;
  uptimeGFPerCent = Math.floor((uptimeGF / currentTime) * 100) / 100;

  showInfos
    ? console.log(
        "\x1b[31m",
        "Ragna",
        "\x1b[0m",
        "x" +
          numberOfCastRagna +
          " for an uptime of : " +
          Math.floor((uptimeRagna / currentTime) * 100) +
          "% with Ragna of",
        "\x1b[31m",
        timeRagnarok / 1000,
        "\x1b[0m",
        "s"
      )
    : "";
  showInfos
    ? console.log(
        "\x1b[33m",
        "GF",
        "\x1b[0m",
        "x" +
          numberOfCastGF +
          " for an uptime of : " +
          Math.floor((uptimeGF / currentTime) * 100) +
          "%"
      )
    : "";
  //
  showInfos
    ? console.log(
        "\x1b[33m",
        "BurstUptime :",
        "\x1b[0m",
        +Math.floor(((uptimeGF + uptimeRagna) / currentTime) * 100) + "%"
      )
    : "";
  SC_Cast =
    numberOfCastGF *
      (16 + 4 * (tank == "lancer" ? 1 : 0) + 2 * (tank == "warrior" ? 1 : 0)) +
    numberOfCastRagna * (8 + 1 * Math.floor(timeRagnarok / 28000)) +
    numberOfBuild * (6 - 2 * Math.floor(timeBuildVar / 28500)) -
    (remainingTimeinRagna != 0
      ? 2 * Math.floor(remainingTimeinRagna / 6000)
      : 0) -
    (remainingTimeinGF != 0 ? 2 * Math.floor(remainingTimeinGF / 3000) : 0);
  showInfos
    ? console.log(
        "\x1b[33m",
        "Number of SC Cast :",
        "\x1b[0m",
        +SC_Cast +
          "time, for " +
          Math.floor(SC_Cast / (timeFight / 60000)) +
          "~" +
          Math.floor(SC_Cast / (timeFight / 60000) + 1) +
          " HPM with a " +
          tank
      )
    : "";
  return [uptimeRagnaPerCent, uptimeGFPerCent, timeBuildVar];
}

function calculBuildTime(
  initialBuildTime,
  forceThreeRagna,
  glyphe,
  uptimeRagnaPerCent,
  uptimeGFPerCent,
  showInfos
) {
  let uptimeBurstPerCent = uptimeGFPerCent + uptimeRagnaPerCent;
  if (uptimeBurstPerCent < 44) {
    return false;
  }
  initialBuildTime = initialBuildTime * 1000;
  while (initialBuildTime < 40000) {
    if (
      calculRotation(initialBuildTime, forceThreeRagna, glyphe, false)[0] <=
      uptimeRagnaPerCent / 100
    ) {
      calculRotation(initialBuildTime, forceThreeRagna, glyphe, showInfos);
      let calculedBuildTime = initialBuildTime;
      initialBuildTime = 40000;
      showInfos
        ? console.log("Build time ", "\x1b[32m", calculedBuildTime / 1000, "s")
        : "";
      return calculedBuildTime;
    }
    initialBuildTime = initialBuildTime + 1000;
    // console.log(   calculRotation(initialBuildTime, forceThreeRagna, glyphe, false)[0]  );
  }
}

function calculOptimalRotation(initialBuildTime, showInfos) {
  if (isNaN(initialBuildTime)) {
    return "Uptime burst trop bas ou trop haut";
  }
  const Buildtime = initialBuildTime;
  let allBuildUptime = [];
  let index = 0;
  let maxUptimeGF = 0;
  let maxUptimeRagna = 0;

  initialBuildTime = initialBuildTime * 1000;
  while (initialBuildTime < 40000) {
    allBuildUptime.push([
      calculRotation(initialBuildTime, false, false, false)[0],
      calculRotation(initialBuildTime, false, false, false)[1],
      calculRotation(initialBuildTime, false, false, false)[2],
      false,
      false,
    ]);
    allBuildUptime.push([
      calculRotation(initialBuildTime, true, false, false)[0],
      calculRotation(initialBuildTime, true, false, false)[1],
      calculRotation(initialBuildTime, true, false, false)[2],
      true,
      false,
    ]);
    allBuildUptime.push([
      calculRotation(initialBuildTime, false, true, false)[0],
      calculRotation(initialBuildTime, false, true, false)[1],
      calculRotation(initialBuildTime, false, true, false)[2],
      false,
      true,
    ]);
    allBuildUptime.push([
      calculRotation(initialBuildTime, true, true, false)[0],
      calculRotation(initialBuildTime, true, true, false)[1],
      calculRotation(initialBuildTime, true, true, false)[2],
      true,
      true,
    ]);
    initialBuildTime = initialBuildTime + 1000;
  }
  // console.log(allBuildUptime);
  for (let i = 0; i < allBuildUptime.length; i++) {
    if (maxUptimeGF <= allBuildUptime[i][1]) {
      maxUptimeGF = allBuildUptime[i][1];
      // console.log(allBuildUptime[i]);
    }
  }
  for (let j = 0; j < allBuildUptime.length; j++) {
    if (
      maxUptimeRagna <= allBuildUptime[j][0] &&
      allBuildUptime[j][1] == maxUptimeGF
    ) {
      maxUptimeRagna = allBuildUptime[j][0];
      index = j;
    }
  }

  // console.log(maxUptimeGF);
  // console.log(maxUptimeRagna);
  // console.log("test " + allBuildUptime[index]);
  // console.log(index);
  showInfos
    ? console.log(
        "\x1b[32m",
        "For " +
          Buildtime +
          " to " +
          allBuildUptime[index][2] / 1000 +
          " s of build time best rotation is :",
        "\x1b[0m"
      )
    : "";

  calculRotation(
    allBuildUptime[index][2],
    allBuildUptime[index][3],
    allBuildUptime[index][4],
    showInfos
  );
  showInfos
    ? console.log(
        "Glyphe ? : ",
        "\x1b[32m",
        allBuildUptime[index][4] ? "yes" : "no",
        "\x1b[0m"
      )
    : "";
  // console.log(
  //   "Triple Ragna ? : ",
  //   "\x1b[32m",
  //   allBuildUptime[index][3] ? "yes" : "no",
  //   "\x1b[0m"
  // );
  return [
    Buildtime,
    Math.floor(
      (calculRotation(
        allBuildUptime[index][2],
        allBuildUptime[index][3],
        allBuildUptime[index][4],
        false
      )[0] +
        calculRotation(
          allBuildUptime[index][2],
          allBuildUptime[index][3],
          allBuildUptime[index][4],
          false
        )[1]) *
        100
    ),
  ];
}

// Calcul a rotation with some conditions
// 1 : Inital Build Time -- 2 : Force triple ragna -- 3 : Using Glyphe -- 4 : Show console.log
calculRotation(27000, false, false, true);

// Calcul the build time for the "Percentage Burst uptime targeted"
// 1 : Inital Build Time -- 2 : Force triple ragna -- 3 : Using Glyphe -- 4: Percentage Uptime Burst aim -- 5 : Show console.log
// calculBuildTime(10, false, true, 25, 20, true);

// console.log(calculBuildTime(27, false, true, 30,18, false));

// Calcul the best rotation for a build time to have the best build time possible with this uptime
// calculOptimalRotation(25, true);

// for (let i = 17; i < 40; i++) {
//   console.log(calculOptimalRotation(i, false));
// }
