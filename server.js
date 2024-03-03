const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/chessgame";

mongoose
  .connect(uri, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));
const userModel = require("./models/user");
const { connected } = require("process");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//css
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const connectedUsers = new Set();
wss.on("connection", (ws) => {
  console.log("Client connected");

  //  messages from clients
  ws.on("message", (message) => {
    const jsonString = message.toString("utf-8");
    const { username } = JSON.parse(jsonString);
    connectedUsers.add(username);
    const usersData = JSON.stringify([...connectedUsers]);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(usersData);
      }
    });
  });

  //  disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    console.log(connectedUsers, "/////////////////");
    // connectedUsers.delete(username);

    const usersData = JSON.stringify({ ...connectedUsers });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(usersData);
      }
    });
  });
});

app.get("/login", (req, res) => {
  try {
    res.render("loginpage");
  } catch (error) {
    console.log(error);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await userModel.findOne({ name });
    if (user) {
      if (user.password === password) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "login", username: name }));
            let username = name;
            connectedUsers.add(username);
          }
        });

        return res.render("index", { connectedUsers: [...connectedUsers] });
      }
      return res.render("loginpage");
    } else {
      return res.render("loginpage");
    }
    return res.render("loginpage");
  } catch (error) {
    console.log(error);
  }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
