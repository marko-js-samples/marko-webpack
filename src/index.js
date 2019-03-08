import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import initServices from "./services/routes";
import HomePage from "./pages/home";

const app = express();
const port = process.env.PORT || 8080;

// Enable gzip compression for all HTTP responses
app.use(compression());

// Allow all of the generated files to be served up by Express
app.use("/static", serveStatic("dist/client"));

// Initialize mock service routes
initServices(app);

// Map the "/" route to the home page
app.get("/", HomePage);

// Start the server
app.listen(port, err => {
  if (err) {
    throw err;
  }

  if (port !== "0") {
    console.log(`Listening on port ${port}`);
  }
});
