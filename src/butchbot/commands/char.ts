import { Character, PrismaClient } from "@prisma/client";
import { Command } from "./";
import {
  isOfType,
  formatCharacter,
  generateCharacterById,
  generateUserFromMsg,
} from "./utils";

const ERROR_NOT_SUPPORTED_IN_DMS = `Sorry, this command isn't supported in DMs. Please use a channel.`;

const charNew: Command = {
  label: "new",
  options: {
    argsRequired: true,
    description: "Create a new character record.",
    fullDescription: `
Creates a brand new character record, and saves it to your account.

Usage \`$char new nickname\` where \`nickname\` is replaced by a shorthand name you want to use to refer to this character. (No spaces please!)

You'll have the opportunity to set the character's full name and description later.
    `,
    guildOnly: true,
  },
  generator: (prisma: PrismaClient) => async (msg, args) => {
    if (!msg.guildID) {
      return ERROR_NOT_SUPPORTED_IN_DMS;
    }
    if (args.length < 1) {
      return `Sorry, this command requires a nickname to create a new character. Nicknames cannot contain spaces.`;
    }
    const nickname = args[0].trim().toLowerCase();
    if (!nickname || nickname.indexOf(" ") !== -1) {
      return `Sorry, this command requires a nickname to create a new character. Nicknames cannot contain spaces.`;
    }

    const user = await generateUserFromMsg(prisma)(msg);

    const existing = await prisma.character.findUnique({
      where: {
        userIdNickname: {
          nickname,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return `Sorry! You already have a character with that nickname. Please choose another nickname and try again.`;
    }

    const newCharacter = await prisma.character.upsert({
      create: {
        userId: user.id,
        nickname,
        isNpc: false,
        xp: 0,
      },
      update: {
        nickname,
      },
      where: {
        userIdNickname: {
          nickname,
          userId: user.id,
        },
      },
    });

    user.activeCharacterId = newCharacter.id;
    await prisma.user.update({
      data: { ...user },
      where: { id: user.id },
    });

    return `
New character, nicknamed "${nickname}," created and set as currently selected character.

See your character sheet with \`$char\`.

Set up your new character's properties with \`$char set name value\`.

~Choose a Playbook with \`$char set playbook name\` to automatically set up default Moves.~

~Set up your new character's stats with \`$stat set name value\`.~

~Set up any meters required for your new character with \`$meter create name min max currentValue\`.~

~Inflict a Condition on your character with \`$cond create name hasSpecialConditions description\`.~

~Stagger your character with \`$stagger\`.~

~Set up Moves for your character with \`$move add name\`~
    `;
  },
};

const charSet: Command = {
  label: "set",
  options: {
    argsRequired: true,
    description: "Command to set properties directly on your character",
    fullDescription: `
Command to set properties on your character. This will overwrite the existing value.

Available properties:
 - fullName (string)
 - description (string), 
 - xp (number)
 - image (url)
    `,
    guildOnly: true,
  },
  generator: (prisma: PrismaClient) => async (msg, args) => {
    if (!msg.guildID) {
      return ERROR_NOT_SUPPORTED_IN_DMS;
    }

    const user = await generateUserFromMsg(prisma)(msg);
    const char = user.activeCharacterId
      ? await generateCharacterById(prisma)(user.activeCharacterId)
      : null;

    if (!char) {
      return `No character selected! Use \`$char create\` or \`$char select\` to fix this.`;
    }
    if (args.length < 2) {
      return `Missing arguments - did you include both the property name and value?`;
    }

    const prop = args[0].trim().toLowerCase();
    const value = args[1].trim().toLowerCase();

    const data: any = {
      ...char,
    };
    data[prop] = value;

    if (!isOfType<Character>(data)) {
      return `Sorry! I can't find the property ${prop} on characters!`;
    }

    const updated = await prisma.character.update({
      data,
      where: {
        id: char.id,
      },
    });

    const embed = await formatCharacter(updated, prisma);
    msg.channel.client.createMessage(msg.channel.id, {
      content: `Updated ${updated.nickname}.`,
      embed,
    });

    return "";
  },
};

const charSelect: Command = {
  label: "select",
  options: {
    argsRequired: true,
    description: "Command to select your current active character",
    fullDescription: `
Command for selecting the current active character, by nickname. To see all characters, use \`$char list\`.
    `,
    guildOnly: true,
  },
  generator: (prisma: PrismaClient) => async (msg, args) => {
    if (!msg.guildID) {
      return ERROR_NOT_SUPPORTED_IN_DMS;
    }
    const user = await generateUserFromMsg(prisma)(msg);

    if (args.length < 1) {
      return `Don't forget to include the character's nickname! Usage: \`$char select nickname\`.`;
    }

    const nickname = args[0].trim().toLowerCase();
    const char = await prisma.character.findUnique({
      where: {
        userIdNickname: {
          userId: user.id,
          nickname,
        },
      },
    });

    if (!char) {
      return `I couldn't find a character by that nickname. Try \`$char list\` for a list of characters.`;
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activeCharacterId: char.id,
      },
    });

    const embed = await formatCharacter(char, prisma);
    msg.channel.client.createMessage(msg.channel.id, {
      content: `Character ${char.nickname} is now selected.`,
      embed,
    });

    return "";
  },
};

const charList: Command = {
  label: "list",
  options: {
    description: "Command to list your characters",
    fullDescription: `
Lists your created characters.
    `,
    guildOnly: true,
  },
  generator: (prisma: PrismaClient) => async (msg, _) => {
    if (!msg.guildID) {
      return ERROR_NOT_SUPPORTED_IN_DMS;
    }
    const user = await generateUserFromMsg(prisma)(msg);

    const characters = await prisma.character.findMany({
      where: {
        userId: user.id,
      },
    });
    const charStr = characters.map((char) => char.nickname).join(",\n");

    return `
Your characters:
${charStr}
    `;
  },
};

const char: Command = {
  label: "char",
  options: {
    argsRequired: true,
    description: "Command to manage your characters",
    fullDescription: `
Command for creating, listing, and selecting characters. See subcommands (new, list, select, set).
    `,
    guildOnly: true,
  },
  subCommands: [charNew, charList, charSelect, charSet],
  generator: (prisma: PrismaClient) => async (msg, _) => {
    if (!msg.guildID) {
      return ERROR_NOT_SUPPORTED_IN_DMS;
    }

    const user = await generateUserFromMsg(prisma)(msg);
    const char = user.activeCharacterId
      ? await generateCharacterById(prisma)(user.activeCharacterId)
      : null;

    if (!char) {
      return `
You currently have no character selected.
Please use one of \`$char list\`, \`$char new\`, \`$char select\`, \`$char set\`."
      `;
    }

    const embed = await formatCharacter(char, prisma);
    msg.channel.client.createMessage(msg.channel.id, {
      content: `Currently Selected Character is ${char.nickname}`,
      embed,
    });

    return "";
  },
};

export default char;
