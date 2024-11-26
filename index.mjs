import { createBareServer } from '@tomphttp/bare-server-node';
import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "url";
import chalk from "chalk"; 

const DEBUG = process.env.DEBUG === "true";

const publicPath = fileURLToPath(new URL("./public/", import.meta.url));

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));

app.use((req, res) => {
  log(chalk.red("404 error for:"), req.url);
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    log(chalk.green("Routing request through Bare Server:"), req.url);
    bare.routeRequest(req, res);
  } else {
    log(chalk.blue("Routing request through Express:"), req.url);
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    log(chalk.green("Routing upgrade request through Bare Server:"), req.url);
    bare.routeUpgrade(req, socket, head);
  } else {
    log(chalk.yellow("Upgrade request not handled, closing socket:"), req.url);
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) {
  port = 3000;
}

server.on("listening", () => {
  const address = server.address();
  console.clear();

  const startTime = new Date();
  const formattedTime = startTime.toLocaleString();

  log(chalk.green("🟢 Server started successfully!"));

  console.log(chalk.bgCyan.white.bold("🎉 Server Info"));
  console.log(chalk.bgCyan.white(`🔹 Server started at: ${formattedTime}`));
  console.log(chalk.bgCyan.white(`🔹 Hostname: ${hostname()}`));

  console.log(chalk.bgMagenta.white("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  
  console.log(chalk.bgMagenta.black("🔶 Listening on the following URLs:"));
  console.log(chalk.magenta(`🌐 http://localhost:${address.port}`));
  console.log(chalk.magenta(`🌍 http://${hostname()}:${address.port}`));
  console.log(
    chalk.magenta(
      `🌐 http://${
        address.family === "IPv6" ? `[${address.address}]` : address.address
      }:${address.port}`
    )
  );
  
  console.log(chalk.bgMagenta.white("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  
  console.log(chalk.bgMagenta.black(`🔸 Listening on port: ${address.port}`));
  console.log(chalk.bgMagenta.white("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  log(chalk.red("⚠️ SIGTERM signal received: closing HTTP server"));
  server.close(() => {
    log(chalk.red("🛑 Server closed successfully."));
    bare.close(() => {
      log(chalk.red("🛑 Bare Server closed."));
      process.exit(0);
    });
  });
}

server.listen({ port });

function log(...args) {
  if (DEBUG) {
    console.log(chalk.white("[DEBUG]"), ...args);
  }
}
