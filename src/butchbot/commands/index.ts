import { PrismaClient } from "@prisma/client";
import Eris from "eris";

import roll from "./roll";

export interface Command {
  label: string;
  generator: (prisma: PrismaClient) => Eris.CommandGenerator;
  options?: Eris.CommandOptions;
  subCommands?: Command[];
}

const allCommands: Command[] = [roll];

export default allCommands;
