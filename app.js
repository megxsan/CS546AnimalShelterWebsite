import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import Handlebars from "handlebars";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");
app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

Handlebars.registerHelper("includes", function (array, value) {
	let i = false;
	array.forEach((element) => {
		if (element === value.toString()) {
			i = true;
		}
	});
	return i;
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
	// If the user posts to the server with a property called _method, rewrite the request's method
	// To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
	// rewritten in this middleware to a PUT route
	if (req.body && req.body._method) {
		req.method = req.body._method;
		delete req.body._method;
	}

	// let the next middleware run:
	next();
};

app.use("/public", staticDir);
app.use("/", express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());

app.use(
	session({
		name: "AuthCookie",
		secret: "some secret string!",
		resave: false,
		saveUninitialized: false,
	})
);

// Middleware
app.use("/login", (req, res, next) => {
	if (req.session && req.session.user) {
		return res.redirect("/");
	} else {
		next();
	}
});

app.use("/register", (req, res, next) => {
	if (req.session && req.session.user) {
		return res.redirect("/");
	} else {
		next();
	}
});

app.use("/logout", (req, res, next) => {
	if (req.session && req.session.user) {
		next();
	} else {
		return res.redirect("/");
	}
});

app.use("/account", (req, res, next) => {
	if (req.session && req.session.user) {
		next();
	} else {
		return res.redirect("/");
	}
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});
