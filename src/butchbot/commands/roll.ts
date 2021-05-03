import { PrismaClient } from "@prisma/client";
import { DiceRoll } from "rpg-dice-roller";
import { Command } from "./";

const roll: Command = {
  label: "roll",
  options: {
    argsRequired: true,
    fullDescription: `
    Roll any number of polyhedral dice, with optional modifiers.

    For full syntax, see https://greenimp.github.io/rpg-dice-roller/guide/notation/

    You can also substitue any stat with \${statname}: ie, \`2d6 + \${heart}\` so long as you have a character selected.
    `,
    description: "Roll any number of polyhedral dice, with optional modifiers",
  },
  generator: (prisma: PrismaClient) => (msg, args) => {
    let rollString = args.join(" ");
    try {
      const result = new DiceRoll(rollString);
      return `Roll 'em! ${result.output}`;
    } catch (err) {
      return `Wah, I'm still just a baby bot. I'm learning as I go. I didn't quite understand you, and I got an error! ${err}`;
    }
  },
};

export default roll;
