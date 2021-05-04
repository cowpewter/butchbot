import { Character, Prisma, PrismaClient } from "@prisma/client";
import Eris, { Embed as ErisEmbed } from "eris";
import Embed from "../embed";

export const formatCharacter = async (
  char: Character,
  prisma: PrismaClient
): Promise<ErisEmbed> => {
  const embed = new Embed();
  embed.setTitle(char.fullName || char.nickname);
  if (char.description) {
    embed.setDescription(char.description);
  }
  if (char.image) {
    embed.setImage({ url: char.image, width: 250 });
  }

  // Get and display meters
  const meters = await prisma.meter.findMany({
    where: {
      character: char,
    },
  });

  meters.forEach((meter) => {
    embed.addField({
      name: meter.name,
      value: `${meter.value}/${meter.max}`,
    });
  });

  // Get and display stats
  const stats = await prisma.meter.findMany({
    where: {
      character: char,
    },
  });

  stats.forEach((stat) => {
    embed.addField({
      name: stat.name,
      value: stat.value > 0 ? `+${stat.value}` : `${stat.value}`,
    });
  });

  return embed.getEris();
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
