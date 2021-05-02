import Eris from "eris";

import roll from "./roll";

export interface Command {
  label: string;
  generator: Eris.CommandGenerator;
  options?: Eris.CommandOptions;
}

const allCommands: Command[] = [roll];

export default allCommands;
