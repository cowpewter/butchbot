import { Character, Prisma, PrismaClient } from "@prisma/client";
import Eris from "eris";

export const formatCharacter = (char: Character): string => {
  return `
Your currently selected character is: "${
    char.fullName || "Please SetMyFullName"
  }" also known as "${char.nickname}".

Someday, this will hopefully be formatted like a character sheet?

Status Dump:
<pre>
${{
  ...char,
}}
</pre>
    `;
};

export function isOfType<T>(arg: any, prop?: string): arg is T {
  return arg && prop ? arg.hasOwnProperty(prop) : true;
}

export const generateUserFromMsg = (prisma: PrismaClient) => async (
  msg: Eris.Message,
  select?: Prisma.UserSelect
) => {
  if (!msg.guildID) {
    throw Error(`This doesn't work in DMs. Please use a channel.`);
  }

  return prisma.user.upsert({
    create: {
      discordId: msg.author.id,
      guildId: msg.guildID,
    },
    update: {
      guildId: msg.guildID,
    },
    where: {
      discordCombinedId: {
        discordId: msg.author.id,
        guildId: msg.guildID,
      },
    },
  });
};

export const generateCharacterById = (prisma: PrismaClient) => async (
  id: number,
  select?: Prisma.CharacterSelect
) => {
  if (!id) {
    throw Error(`Invalid Character ID ${id} specified`);
  }
  return prisma.character.findUnique({
    where: {
      id,
    },
  });
};
