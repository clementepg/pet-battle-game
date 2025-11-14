# Beastforge: Rogue Trainer

Beastforge is a browser-based, single player roguelike inspired by monster battlers. Start with a single companion, defeat wild beasts, and recruit every foe that falls in battle. Each victory pushes you deeper into hostile territory where the threats grow in strength, but clever roster management and ability choices can keep the expedition alive.

## Features

- **Roguelike progression** – Survive as many encounters as possible while enemy level and difficulty scale over time.
- **Capture every foe** – Any beast you defeat will join your roster with its own stats and abilities.
- **Tactical combat** – Choose between offensive strikes, defensive stances, heals, and status effects. Swap companions mid-battle to counter enemy tactics.
- **Retro aesthetic** – Minimalist UI with ASCII inspired sprites evokes classic DOS-era dungeon crawlers.

## Getting started

This project is completely client-side with no build step. To play the game locally:

1. Clone the repository.
2. Open `index.html` in any modern desktop browser (Chrome, Firefox, Safari, Edge).

You can also serve the directory with a simple static server if you prefer:

```bash
python -m http.server 8000
```

Then navigate to <http://localhost:8000/>.

## Gameplay tips

- **Starter choice matters.** Granite Shell offers strong defense, Ember Fox brings burst damage, and Viper Fern excels at attrition.
- **Use the roster.** Clicking the "Swap Companion" action lets you bring in any healthy ally at the cost of your turn.
- **Camp wisely.** Press `R` between battles to rest, partially heal, and cleanse your squad at the cost of increasing the next foe's level.
- **Mind status effects.** Poison chips away over time, chilled slows enemies, and guard absorbs incoming damage.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.
