import Eris from "eris";

import commands from "./commands";
import options from "./options";

const ButchBot = (token: string) => {
  const bot = new Eris.CommandClient(token, undefined, options);

  commands.forEach(({ label, generator, options }) =>
    bot.registerCommand(label, generator, options)
  );

  bot.connect();
};

export default ButchBot;
