const webpack = require("webpack");
const DevServer = require("webpack-dev-server");
const configs = require("./webpack.config");
const spawnedServer = configs.spawnedServer;
const compiler = webpack(configs);
const PORT = process.env.PORT || 8080; // Default to port 8080 on dev server.
process.env.PORT = 0; // Start spawned server on any available port.

const server = new DevServer(compiler, {
  quiet: true,
  inline: true,
  overlay: true,
  contentBase: false,
  stats: "errors-only",
  clientLogLevel: "error",
  watchOptions: { ignored: [/node_modules/] },
  proxy: {
    "**": {
      target: true,
      router: () => `http://localhost:${spawnedServer.address.port}`
    }
  },
  before(app) {
    app.use((req, res, next) => {
      if (spawnedServer.listening) next();
      else spawnedServer.once("listening", next);
    });
  }
}).listen(PORT);

spawnedServer.once("listening", () => {
  console.log(`DevServer started on port '${server.address().port}'.\n`);
});
