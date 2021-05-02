import ButchBot from "./butchbot";
import express from "express";

if (!process.env.BOT_TOKEN) {
  throw Error("No BOT_TOKEN provided! Check your env vars.");
}

ButchBot(process.env.BOT_TOKEN);

const PORT = process.env.PORT || 3000;
const app = express();
app.get("/", (_, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
