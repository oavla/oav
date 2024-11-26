import { createBareServer } from '@tomphttp/bare-server-node';
import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "url";
import chalk from "chalk"; 

// Enable debugging based on environment variable
const DEBUG = process.env.DEBUG === "true";

const publicPath = fileURLToPath(new URL("./public/", import.meta.url));

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));

app.use((req, res) => {
  log("404 error for:", req.url);
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    log("Routing request through Bare Server:", req.url);
    bare.routeRequest(req, res);
  } else {
    log("Routing request through Express:", req.url);
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    log("Routing upgrade request through Bare Server:", req.url);
    bare.routeUpgrade(req, socket, head);
  } else {
    log("Upgrade request not handled, closing socket:", req.url);
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) {
  port = 3000;
}

server.on("listening", () => {
  const address = server.address();

  console.log(chalk.green("Server is up and running!"));
  console.log(chalk.cyan("Server listening on:"));
  console.log(chalk.yellow(`\thttp://localhost:${address.port}`));
  console.log(chalk.yellow(`\thttp://${hostname()}:${address.port}`));
  console.log(
    chalk.yellow(
      `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address}:${address.port}`
    )
  );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    log("Server closed successfully.");
    bare.close(() => {
      log("Bare Server closed.");
      process.exit(0);
    });
  });
}

server.listen({ port });

function log(...args) {
  if (DEBUG) {
    console.log(chalk.blue("[DEBUG]"), ...args);
  }
}
