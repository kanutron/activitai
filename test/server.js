const express = require("express");
const fs = require("fs");
const app = express();
const OUT_FILE = "activitai.jsonl";

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/v1/report", (req, res) => {
  console.log("POST /v1/report:", req.body);
  fs.appendFileSync(OUT_FILE, JSON.stringify(req.body) + "\n");
  res.sendStatus(200);
});

app.patch("/v1/report", (req, res) => {
  console.log("PATCH /v1/report", req.body);
  fs.appendFileSync(OUT_FILE, JSON.stringify(req.body) + "\n");
  res.sendStatus(200);
});

app.listen(4000, () => console.log("Server listening on port 4000"));
