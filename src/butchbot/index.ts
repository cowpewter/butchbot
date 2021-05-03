import { PrismaClient } from "@prisma/client";
import Eris from "eris";

import commands from "./commands";
import options from "./options";

const ButchBot = (token: string, prisma: PrismaClient) => {
  const bot = new Eris.CommandClient(token, undefined, options);

  commands.forEach(({ label, generator, options, subCommands }) => {
    const command = bot.registerCommand(label, generator(prisma), options);

    if (subCommands) {
      subCommands.forEach((sub) =>
        command.registerSubcommand(
          sub.label,
          sub.generator(prisma),
          sub.options
        )
      );
    }
  });

  bot.connect();
};

export default ButchBot;
