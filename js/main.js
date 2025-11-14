const abilityLibrary = {
  feralSwipe: {
    id: "feralSwipe",
    name: "Feral Swipe",
    description: "Deliver a slashing blow based on attack power.",
    execute: (context) => {
      const { user, target, rng } = context;
      const variance = rng(0, 2);
      const base = getAttackPower(user) + variance;
      const damage = applyDamage(target, base, context, {
        type: "slash",
      });
      return [`${user.name} slashes ${target.name} for ${damage} damage.`];
    },
  },
  emberBurst: {
    id: "emberBurst",
    name: "Ember Burst",
    description: "Ignite the foe for high damage. Ignores shields.",
    execute: (context) => {
      const { user, target, rng } = context;
      const base = getAttackPower(user) + 4 + rng(0, 3);
      const damage = applyDamage(target, base, context, {
        ignoreShield: true,
        type: "fire",
      });
      return [`${user.name} hurls embers at ${target.name} for ${damage} searing damage!`];
    },
  },
  stoneGuard: {
    id: "stoneGuard",
    name: "Stone Guard",
    description: "Raise a protective barrier that reduces the next hit.",
    execute: ({ user }) => {
      const oldShield = user.shield;
      user.shield = Math.min(8, user.shield + 4);
      const gained = user.shield - oldShield;
      return [
        gained > 0
          ? `${user.name} braces up, gaining ${gained} guard.`
          : `${user.name}'s guard is already at its peak.`,
      ];
    },
  },
  soothingChant: {
    id: "soothingChant",
    name: "Soothing Chant",
    description: "Restore health to the active companion.",
    execute: ({ user }) => {
      const heal = Math.min(user.maxHp - user.hp, Math.floor(user.maxHp * 0.35) + 3);
      user.hp = Math.min(user.maxHp, user.hp + heal);
      return heal > 0
        ? [`${user.name} hums an ancient tune, restoring ${heal} vitality.`]
        : [`${user.name} is already at full vitality.`];
    },
  },
  venomStrike: {
    id: "venomStrike",
    name: "Venom Strike",
    description: "Deal damage and apply poison over two turns.",
    execute: (context) => {
      const { user, target, rng } = context;
      const base = getAttackPower(user) + 1 + rng(0, 2);
      const damage = applyDamage(target, base, context, {
        type: "toxin",
      });
      target.status.poison = {
        turns: 2,
        damage: 3,
      };
      return [
        `${user.name} injects venom into ${target.name} for ${damage} damage!`,
        `${target.name} is poisoned!`,
      ];
    },
  },
  auroraBolt: {
    id: "auroraBolt",
    name: "Aurora Bolt",
    description: "Unleash radiant energy, dealing reliable damage.",
    execute: (context) => {
      const { user, target } = context;
      const base = getAttackPower(user) + 3;
      const damage = applyDamage(target, base, context, {
        ignoreShield: true,
        type: "arcane",
      });
      return [`A torrent of light from ${user.name} scorches ${target.name} for ${damage} damage.`];
    },
  },
  galeDash: {
    id: "galeDash",
    name: "Gale Dash",
    description: "Quickly strike and increase evasion briefly.",
    execute: (context) => {
      const { user, target, rng } = context;
      const base = getAttackPower(user) + rng(0, 2);
      const damage = applyDamage(target, base, context, {
        type: "wind",
      });
      user.status.evasion = {
        turns: 1,
        value: 0.25,
      };
      return [
        `${user.name} dashes through ${target.name} for ${damage} damage!`,
        `${user.name} becomes harder to hit next turn.`,
      ];
    },
  },
  frostNova: {
    id: "frostNova",
    name: "Frost Nova",
    description: "Deal damage and slow the enemy's next action.",
    execute: (context) => {
      const { user, target, rng } = context;
      const base = getAttackPower(user) + 2 + rng(0, 1);
      const damage = applyDamage(target, base, context, {
        type: "frost",
      });
      target.status.chilled = {
        turns: 1,
        modifier: -2,
      };
      return [
        `${user.name} unleashes a nova of frost dealing ${damage} damage!`,
        `${target.name}'s movements slow in the chill.`,
      ];
    },
  },
  naturePulse: {
    id: "naturePulse",
    name: "Nature Pulse",
    description: "Restore health and cleanse poison.",
    execute: ({ user }) => {
      const heal = Math.floor(user.maxHp * 0.25) + 4;
      const amount = Math.min(user.maxHp - user.hp, heal);
      user.hp = Math.min(user.maxHp, user.hp + amount);
      if (user.status.poison) {
        delete user.status.poison;
      }
      return [
        amount > 0
          ? `Nature's pulse mends ${user.name} for ${amount} vitality.`
          : `${user.name} is already rejuvenated.`,
      ];
    },
  },
};

const speciesCatalog = [
  {
    id: "ember-fox",
    name: "Ember Fox",
    ascii: " /\\_/\\\n( o.o )\n > ^ <",
    description: "Pyromantic trickster with aggressive bursts.",
    baseHp: 22,
    baseAttack: 6,
    baseSpeed: 7,
    abilities: [abilityLibrary.feralSwipe, abilityLibrary.emberBurst],
  },
  {
    id: "granite-shell",
    name: "Granite Shell",
    ascii: "  ____\n / __ \\\n| |  | |\n| |__| |\n \\____/",
    description: "Living bulwark, excels at attrition.",
    baseHp: 30,
    baseAttack: 4,
    baseSpeed: 4,
    abilities: [abilityLibrary.feralSwipe, abilityLibrary.stoneGuard],
  },
  {
    id: "viper-fern",
    name: "Viper Fern",
    ascii: "  /\\/\\\n <(' )=\n  \\//",
    description: "Toxic hybrid with debilitating strikes.",
    baseHp: 24,
    baseAttack: 5,
    baseSpeed: 6,
    abilities: [abilityLibrary.venomStrike, abilityLibrary.naturePulse],
  },
  {
    id: "aurora-ray",
    name: "Aurora Ray",
    ascii: " .-^-.\n( o_o )\n '---'",
    description: "Radiant manta gliding on polar winds.",
    baseHp: 20,
    baseAttack: 6,
    baseSpeed: 8,
    abilities: [abilityLibrary.auroraBolt, abilityLibrary.galeDash],
  },
  {
    id: "glacier-owl",
    name: "Glacier Owl",
    ascii: "  ,_,\n (o,o)\n /)  )\n  ^^",
    description: "Mystic owl freezing foes in place.",
    baseHp: 21,
    baseAttack: 5,
    baseSpeed: 6,
    abilities: [abilityLibrary.frostNova, abilityLibrary.soothingChant],
  },
];

const starterPool = ["ember-fox", "granite-shell", "viper-fern"];

const gameState = {
  level: 1,
  player: {
    roster: [],
    activeIndex: 0,
  },
  enemy: null,
  turn: "player",
  awaiting: false,
  log: [],
  rngSeed:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Math.random()}`,
};

const logEl = document.querySelector("#log");
const playerCardEl = document.querySelector("#player-active");
const rosterEl = document.querySelector("#roster");
const playerStatsEl = document.querySelector("#player-stats");
const enemyStatsEl = document.querySelector("#enemy-stats");
const enemyCardEl = document.querySelector("#enemy-card");
const abilityBarEl = document.querySelector("#ability-bar");
const playerSpriteEl = document.querySelector("#player-sprite");
const enemySpriteEl = document.querySelector("#enemy-sprite");
const starterDialog = document.querySelector("#starter-dialog");
const starterOptionsEl = document.querySelector("#starter-options");
const gameOverDialog = document.querySelector("#gameover-dialog");
const gameOverMessageEl = document.querySelector("#gameover-message");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getAttackPower(pet) {
  const chillPenalty = pet.status?.chilled ? pet.status.chilled.modifier : 0;
  return Math.max(1, pet.attack + chillPenalty);
}

function rngFactory(seed) {
  let x = cyrb128(seed);
  let idx = 0;
  return () => {
    const t = sfc32(x[idx % 4], x[(idx + 1) % 4], x[(idx + 2) % 4], x[(idx + 3) % 4]);
    idx += 1;
    return t();
  };
}

function cyrb128(str) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

function sfc32(a, b, c, d) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

const rng = rngFactory(gameState.rngSeed);

function buildStarterSelection() {
  starterOptionsEl.innerHTML = "";
  starterPool.forEach((id) => {
    const data = getSpecies(id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "starter-card";
    const title = document.createElement("strong");
    title.textContent = data.name;
    const art = document.createElement("pre");
    art.textContent = data.ascii;
    const desc = document.createElement("p");
    desc.textContent = data.description;
    const stats = document.createElement("p");
    const statsSmall = document.createElement("small");
    statsSmall.textContent = `HP ${data.baseHp} | ATK ${data.baseAttack} | SPD ${data.baseSpeed}`;
    stats.appendChild(statsSmall);
    card.append(title, art, desc, stats);
    card.addEventListener("click", () => {
      starterDialog.close("start");
      beginExpedition(data.id);
    });
    starterOptionsEl.appendChild(card);
  });
}

function beginExpedition(speciesId) {
  resetState();
  const starter = createPet(speciesId, 1);
  gameState.player.roster.push(starter);
  gameState.player.activeIndex = 0;
  logEvent(`You bonded with ${starter.name}!`);
  renderRoster();
  spawnEnemy();
}

function resetState() {
  gameState.level = 1;
  gameState.player.roster = [];
  gameState.player.activeIndex = 0;
  gameState.enemy = null;
  gameState.turn = "player";
  gameState.awaiting = false;
  logEl.innerHTML = "";
  abilityBarEl.innerHTML = "";
}

function getSpecies(id) {
  return speciesCatalog.find((s) => s.id === id);
}

function createPet(speciesId, level) {
  const species = getSpecies(speciesId);
  const modifier = 1 + (level - 1) * 0.18;
  const hp = Math.round(species.baseHp * modifier);
  const attack = Math.round(species.baseAttack * modifier);
  const speed = Math.round(species.baseSpeed * modifier);
  return {
    speciesId,
    name: species.name,
    level,
    maxHp: hp,
    hp,
    attack,
    speed,
    shield: 0,
    status: {},
    abilities: species.abilities,
  };
}

function spawnEnemy() {
  const levelVariance = Math.max(0, Math.floor(rng() * 2));
  const enemyLevel = gameState.level + levelVariance;
  const species = speciesCatalog[Math.floor(rng() * speciesCatalog.length)];
  gameState.enemy = createPet(species.id, enemyLevel);
  gameState.turn = "player";
  gameState.awaiting = false;
  logEvent(`A wild ${gameState.enemy.name} (Lv.${enemyLevel}) appears!`);
  renderBattle();
}

function renderBattle() {
  renderActivePetCard();
  renderEnemyCard();
  renderStats();
  renderAbilities();
  renderRoster();
}

function renderActivePetCard() {
  const pet = getActivePet();
  if (!pet) {
    playerCardEl.classList.add("empty");
    playerCardEl.textContent = "No active companion";
    playerSpriteEl.dataset.name = "";
    return;
  }
  playerCardEl.classList.remove("empty");
  playerCardEl.innerHTML = `
    <strong>${pet.name}</strong>
    <span>Level ${pet.level}</span>
    <span>HP ${pet.hp}/${pet.maxHp}</span>
    <span>ATK ${pet.attack} | SPD ${pet.speed}</span>
  `;
  const species = getSpecies(pet.speciesId);
  playerSpriteEl.dataset.name = species.ascii;
}

function renderEnemyCard() {
  if (!gameState.enemy) {
    enemyCardEl.classList.add("empty");
    enemyCardEl.textContent = "No foe";
    enemySpriteEl.dataset.name = "";
    return;
  }
  const foe = gameState.enemy;
  enemyCardEl.classList.remove("empty");
  enemyCardEl.innerHTML = `
    <strong>${foe.name}</strong>
    <span>Level ${foe.level}</span>
    <span>HP ${foe.hp}/${foe.maxHp}</span>
    <span>ATK ${foe.attack} | SPD ${foe.speed}</span>
  `;
  const species = getSpecies(foe.speciesId);
  enemySpriteEl.dataset.name = species.ascii;
}

function renderRoster() {
  rosterEl.innerHTML = "";
  if (!gameState.player.roster.length) {
    const slot = document.createElement("div");
    slot.className = "pet-card empty";
    slot.textContent = "No companions yet.";
    rosterEl.appendChild(slot);
    return;
  }
  gameState.player.roster.forEach((pet, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.index = index;
    button.className = index === gameState.player.activeIndex ? "active" : "";
    button.innerHTML = `
      <strong>${pet.name}</strong>
      <span>Lv.${pet.level}</span>
      <span>HP ${pet.hp}/${pet.maxHp}</span>
    `;
    button.disabled = pet.hp <= 0;
    button.addEventListener("click", () => attemptSwitch(index));
    rosterEl.appendChild(button);
  });
}

function renderStats() {
  const player = getActivePet();
  const enemy = gameState.enemy;
  playerStatsEl.innerHTML = player ? createStatBlock(player, "Trainer Companion") : "";
  enemyStatsEl.innerHTML = enemy ? createStatBlock(enemy, "Wild Threat") : "";
}

function createStatBlock(pet, label) {
  const hpRatio = Math.max(0, Math.min(1, pet.hp / pet.maxHp));
  const hpClass = hpRatio < 0.34 ? "hp-bar danger" : "hp-bar";
  const statusText = formatStatuses(pet.status);
  return `
    <strong>${label}</strong><br />
    ${pet.name} (Lv.${pet.level})<br />
    ATK ${pet.attack} | SPD ${pet.speed}<br />
    Guard ${pet.shield}<br />
    HP ${pet.hp}/${pet.maxHp}
    <div class="${hpClass}"><span style="width:${hpRatio * 100}%"></span></div>
    ${statusText ? `<div>${statusText}</div>` : ""}
  `;
}

function formatStatuses(status) {
  const entries = [];
  if (status.poison) {
    entries.push(`Poison (${status.poison.turns})`);
  }
  if (status.evasion) {
    entries.push(`Evasive (${Math.round(status.evasion.value * 100)}%)`);
  }
  if (status.chilled) {
    entries.push(`Chilled (${status.chilled.turns})`);
  }
  return entries.join(" | ");
}

function renderAbilities() {
  const pet = getActivePet();
  abilityBarEl.innerHTML = "";
  if (!pet) {
    return;
  }
  pet.abilities.forEach((ability) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ability-btn";
    button.innerHTML = `<strong>${ability.name}</strong><br><span>${ability.description}</span>`;
    button.disabled = gameState.turn !== "player" || gameState.awaiting;
    button.addEventListener("click", () => useAbility(ability));
    abilityBarEl.appendChild(button);
  });
  if (gameState.player.roster.filter((p) => p.hp > 0).length > 1) {
    const swapBtn = document.createElement("button");
    swapBtn.type = "button";
    swapBtn.className = "ability-btn";
    swapBtn.textContent = "Swap Companion\nChange to another pet (ends turn).";
    swapBtn.disabled = gameState.turn !== "player" || gameState.awaiting;
    swapBtn.addEventListener("click", () => {
      logEvent("Choose a companion to send out.");
      gameState.awaiting = true;
      abilityBarEl
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = true));
    });
    abilityBarEl.appendChild(swapBtn);
  }
}

function logEvent(message) {
  const p = document.createElement("p");
  p.textContent = message;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
  gameState.log.push(message);
}

function getActivePet() {
  return gameState.player.roster[gameState.player.activeIndex];
}

function attemptSwitch(index) {
  if (gameState.awaiting && gameState.turn === "player") {
    executeSwitch(index, true);
    return;
  }
  if (gameState.turn !== "player" || gameState.awaiting) {
    return;
  }
  if (index === gameState.player.activeIndex) {
    return;
  }
  executeSwitch(index, true);
}

async function executeSwitch(index, costTurn) {
  const pet = gameState.player.roster[index];
  if (!pet || pet.hp <= 0) {
    return;
  }
  const prev = getActivePet();
  gameState.player.activeIndex = index;
  gameState.awaiting = false;
  logEvent(`${prev ? prev.name : ""} retreats! ${pet.name} takes the field.`);
  renderBattle();
  if (costTurn) {
    await enemyTurn();
  }
}

async function useAbility(ability) {
  if (gameState.turn !== "player" || gameState.awaiting) {
    return;
  }
  const user = getActivePet();
  const target = gameState.enemy;
  if (!user || !target || user.hp <= 0) {
    return;
  }
  gameState.awaiting = true;
  const context = buildAbilityContext(user, target, ability);
  ability.execute(context).forEach((msg) => logEvent(msg));
  applyEndOfTurn(user);
  renderBattle();
  const defeated = checkDefeat();
  if (defeated) {
    gameState.awaiting = false;
    return;
  }
  await wait(400);
  await enemyTurn();
}

function buildAbilityContext(user, target, ability) {
  return {
    user,
    target,
    ability,
    rng: (min = 0, max = 1) => {
      const value = rng();
      return Math.floor(value * (max - min + 1)) + min;
    },
  };
}

async function enemyTurn() {
  const enemy = gameState.enemy;
  const player = getActivePet();
  if (!enemy || !player || enemy.hp <= 0) {
    return;
  }
  gameState.turn = "enemy";
  renderAbilities();
  await wait(250);
  const ability = chooseEnemyAbility(enemy);
  const context = buildAbilityContext(enemy, player, ability);
  ability.execute(context).forEach((msg) => logEvent(msg));
  applyEndOfTurn(enemy);
  renderBattle();
  const defeated = checkDefeat();
  if (defeated) {
    gameState.turn = "player";
    gameState.awaiting = false;
    renderAbilities();
    return;
  }
  gameState.turn = "player";
  gameState.awaiting = false;
  renderAbilities();
}

function chooseEnemyAbility(enemy) {
  if (enemy.hp / enemy.maxHp < 0.45) {
    const healAbility = enemy.abilities.find((a) => a.id === "soothingChant" || a.id === "naturePulse");
    if (healAbility) {
      return healAbility;
    }
  }
  return enemy.abilities[Math.floor(rng() * enemy.abilities.length)];
}

function applyDamage(target, amount, context, options = {}) {
  const { ignoreShield } = options;
  let mitigated = amount;
  if (shouldDodge(target)) {
    logEvent(`${target.name} evades the blow!`);
    return 0;
  }
  if (!ignoreShield) {
    const shieldBlock = Math.min(target.shield, mitigated);
    if (shieldBlock > 0) {
      target.shield -= shieldBlock;
      mitigated -= shieldBlock;
    }
  }
  mitigated = Math.max(0, Math.round(mitigated));
  target.hp = Math.max(0, target.hp - mitigated);
  return mitigated;
}

function shouldDodge(target) {
  if (!target.status.evasion) {
    return false;
  }
  const chance = target.status.evasion.value;
  const roll = rng();
  const dodged = roll < chance;
  target.status.evasion.turns -= 1;
  if (target.status.evasion.turns <= 0) {
    delete target.status.evasion;
    logEvent(`${target.name}'s evasive stance fades.`);
  }
  return dodged;
}

function applyEndOfTurn(user) {
  tickStatus(user);
}

function tickStatus(pet) {
  if (!pet) return;
  if (pet.status.poison) {
    const { damage } = pet.status.poison;
    pet.hp = Math.max(0, pet.hp - damage);
    logEvent(`${pet.name} suffers ${damage} poison damage.`);
    pet.status.poison.turns -= 1;
    if (pet.status.poison.turns <= 0) {
      delete pet.status.poison;
      logEvent(`${pet.name} shakes off the poison.`);
    }
  }
  if (pet.status.chilled) {
    pet.status.chilled.turns -= 1;
    if (pet.status.chilled.turns <= 0) {
      delete pet.status.chilled;
      logEvent(`${pet.name} breaks free of the frost.`);
    }
  }
}

function checkDefeat() {
  const player = getActivePet();
  const enemy = gameState.enemy;
  if (enemy && enemy.hp <= 0) {
    onVictory();
    return true;
  }
  if (player && player.hp <= 0) {
    logEvent(`${player.name} collapses!`);
    const nextIndex = gameState.player.roster.findIndex((pet) => pet.hp > 0);
    if (nextIndex !== -1) {
      gameState.player.activeIndex = nextIndex;
      logEvent(`${gameState.player.roster[nextIndex].name} takes their place!`);
      renderBattle();
      return false;
    }
    onDefeat();
    return true;
  }
  return false;
}

function onVictory() {
  const enemy = gameState.enemy;
  if (!enemy) return;
  logEvent(`${enemy.name} yields! You capture the beast.`);
  captureEnemy(enemy);
  gameState.enemy = null;
  gameState.level += 1;
  const healPercent = 0.2;
  gameState.player.roster.forEach((pet) => {
    if (pet.hp > 0) {
      const heal = Math.floor(pet.maxHp * healPercent);
      pet.hp = Math.min(pet.maxHp, pet.hp + heal);
    }
    pet.shield = 0;
    pet.status = {};
  });
  renderRoster();
  renderBattle();
  logEvent("Your squad takes a brief respite before the next foe.");
  setTimeout(() => {
    spawnEnemy();
  }, 1000);
}

function captureEnemy(enemy) {
  const captured = createPet(enemy.speciesId, enemy.level);
  logEvent(`${captured.name} joins your roster!`);
  gameState.player.roster.push(captured);
}

function onDefeat() {
  logEvent("Your expedition is over.");
  gameOverMessageEl.textContent = `You reached depth ${gameState.level}.`;
  gameOverDialog.showModal();
}

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    restCamp();
  }
});

gameOverDialog.addEventListener("close", () => {
  if (gameOverDialog.returnValue === "restart") {
    starterDialog.showModal();
  }
});

function restCamp() {
  if (gameState.turn !== "player" || gameState.awaiting) {
    return;
  }
  if (gameState.enemy && gameState.enemy.hp > 0) {
    logEvent("You can't rest while a foe threatens you!");
    return;
  }
  gameState.player.roster.forEach((pet) => {
    if (pet.hp > 0) {
      const heal = Math.floor(pet.maxHp * 0.4);
      pet.hp = Math.min(pet.maxHp, pet.hp + heal);
    }
    pet.shield = 0;
    pet.status = {};
  });
  logEvent("You set up camp and tend to your companions. The next foe will be fiercer.");
  gameState.level += 1;
  renderBattle();
  spawnEnemy();
}

buildStarterSelection();
starterDialog.showModal();
