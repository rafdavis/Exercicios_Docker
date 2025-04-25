const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bem vindo ao Servidor em Node.js");
});

const port = 4000
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
