const bossHP = 48000;
const partyDPS = 125;
const FightDuration = bossHP / partyDPS / 60;
const EnragePhaseDuration = 35;
const BossIsBahaar = true;
const DpsDiffNE = 15 * (BossIsBahaar ? 2 : 1);
const DpsDiffE = 40 * (BossIsBahaar ? 2 : 1);
const NonEnragePhaseDuration =
  (bossHP * 0.1) / (partyDPS * (1 - DpsDiffNE / 100));
const ReEnrageCD = 3 * 60 + 20;

let ReEnrage = true;
let CurrentPhase = "enrage";
let CurrentPerCentHP = 100;
let CurrentTime = 3;
let EnrageUptime = 0;

function CalculPhase() {
  console.log(
    "For a fight of " +
      CalculMinSec(FightDuration * 60).min +
      "min" +
      CalculMinSec(FightDuration * 60).sec +
      "s"
  );
  while (CurrentTime < FightDuration * 60) {
    if (CurrentPhase == "enrage" && CurrentTime < FightDuration * 60) {
      CurrentPerCentHP -
        (EnragePhaseDuration * partyDPS * (1 + DpsDiffE / 100)) /
          (bossHP / 100) >=
      0
        ? (CurrentPerCentHP =
            CurrentPerCentHP -
            (EnragePhaseDuration * partyDPS * (1 + DpsDiffE / 100)) /
              (bossHP / 100))
        : (CurrentPerCentHP =
            (EnragePhaseDuration * partyDPS * (1 + DpsDiffE / 100)) /
            (bossHP / 100));
      if (BossIsBahaar && CurrentPerCentHP <= 30) {
        CurrentPhase = "enrage";
        console.log(
          "\x1b[31m",
          "Enrage",
          "\x1b[0m",
          "  between " +
            CalculMinSec(CurrentTime).min +
            "min" +
            CalculMinSec(CurrentTime).sec +
            "s and " +
            CalculMinSec(FightDuration * 60).min +
            "min" +
            CalculMinSec(FightDuration * 60).sec +
            "s, hp end at 0%."
        );
        EnrageUptime = EnrageUptime + (FightDuration * 60 - CurrentTime);
        CurrentTime = FightDuration * 60;
      } else {
        CurrentPhase = "non-enrage";
        console.log(
          "\x1b[31m",
          "Enrage",
          "\x1b[0m",
          "  between " +
            CalculMinSec(CurrentTime).min +
            "min" +
            CalculMinSec(CurrentTime).sec +
            "s and " +
            CalculMinSec(
              CurrentTime + EnragePhaseDuration > FightDuration * 60
                ? FightDuration * 60
                : CurrentTime + EnragePhaseDuration
            ).min +
            "min" +
            CalculMinSec(
              CurrentTime + EnragePhaseDuration > FightDuration * 60
                ? FightDuration * 60
                : CurrentTime + EnragePhaseDuration
            ).sec +
            "s, hp end at " +
            Math.floor(CurrentPerCentHP) +
            "%."
        );
        EnrageUptime =
          EnrageUptime +
          (CurrentTime + EnragePhaseDuration > FightDuration * 60
            ? FightDuration * 60
            : CurrentTime + EnragePhaseDuration - CurrentTime);
        CurrentTime + EnragePhaseDuration > FightDuration * 60
          ? (CurrentTime = FightDuration * 60)
          : (CurrentTime = CurrentTime + EnragePhaseDuration);
      }
    }
    if (CurrentPhase == "non-enrage" && CurrentTime / 60 < FightDuration) {
      if (CurrentTime + NonEnragePhaseDuration > ReEnrageCD && ReEnrage) {
        if (CurrentTime < ReEnrageCD) {
          CurrentPerCentHP -
            ((ReEnrageCD - CurrentTime) / NonEnragePhaseDuration) * 10 >=
          0
            ? (CurrentPerCentHP =
                CurrentPerCentHP -
                ((ReEnrageCD - CurrentTime) / NonEnragePhaseDuration) * 10)
            : (CurrentPerCentHP = 0);
        }
        console.log(
          "Non-enrage between " +
            CalculMinSec(CurrentTime).min +
            "min" +
            CalculMinSec(CurrentTime).sec +
            "s and ",
          "\x1b[31m",
          "re-enrage",
          "\x1b[0m",
          " at " +
            CalculMinSec(CurrentTime > ReEnrageCD ? CurrentTime : ReEnrageCD)
              .min +
            "min" +
            CalculMinSec(CurrentTime > ReEnrageCD ? CurrentTime : ReEnrageCD)
              .sec +
            "s, hp end at " +
            Math.floor(CurrentPerCentHP) +
            "%."
        );
        CurrentPhase = "enrage";
        CurrentTime > ReEnrageCD ? "" : (CurrentTime = ReEnrageCD);
        ReEnrage = false;
      } else {
        CurrentPerCentHP - 10 >= 0
          ? (CurrentPerCentHP = CurrentPerCentHP - 10)
          : (CurrentPerCentHP = 0);
        CurrentPhase = "enrage";
        if (BossIsBahaar && CurrentPerCentHP <= 30) {
          console.log(
            "Non-enrage between " +
              CalculMinSec(CurrentTime).min +
              "min" +
              CalculMinSec(CurrentTime).sec +
              "s and " +
              Math.floor(
                ((CurrentTime +
                  (1 -
                    (30 - CurrentPerCentHP) /
                      ((NonEnragePhaseDuration / (FightDuration * 60)) * 100)) *
                    NonEnragePhaseDuration) %
                  (60 * 60)) /
                  60
              ) +
              "min" +
              Math.ceil(
                ((CurrentTime +
                  (1 -
                    (30 - CurrentPerCentHP) /
                      ((NonEnragePhaseDuration / (FightDuration * 60)) * 100)) *
                    NonEnragePhaseDuration) %
                  (60 * 60)) %
                  60
              ) +
              "s, hp end at 30%."
          );
          CurrentTime =
            CurrentTime +
            (1 -
              (30 - CurrentPerCentHP) /
                ((NonEnragePhaseDuration / (FightDuration * 60)) * 100)) *
              NonEnragePhaseDuration;
        } else {
          console.log(
            "Non-enrage between " +
              CalculMinSec(CurrentTime).min +
              "min" +
              CalculMinSec(CurrentTime).sec +
              "s and " +
              CalculMinSec(
                CurrentTime + NonEnragePhaseDuration > FightDuration * 60
                  ? FightDuration * 60
                  : CurrentTime + NonEnragePhaseDuration
              ).min +
              "min" +
              CalculMinSec(
                CurrentTime + NonEnragePhaseDuration > FightDuration * 60
                  ? FightDuration * 60
                  : CurrentTime + NonEnragePhaseDuration
              ).sec +
              "s, hp end at " +
              Math.floor(CurrentPerCentHP) +
              "%."
          );
          CurrentTime = CurrentTime + NonEnragePhaseDuration;
        }
      }
    }
  }
  console.log(
    "Enrage Uptime is : " +
      Math.floor((EnrageUptime / (FightDuration * 60)) * 100) +
      "%."
  );
}

function CalculMinSec(time) {
  let MinSec = {
    min: Math.floor((time % (60 * 60)) / 60),
    sec: Math.ceil((time % (60 * 60)) % 60),
  };
  return MinSec;
}

CalculPhase();
