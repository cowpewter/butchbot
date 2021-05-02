import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();
app.get("/", (_, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
