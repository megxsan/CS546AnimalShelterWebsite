import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import Handlebars from "handlebars";
import methodOverride from "method-override";
import validation from "./validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

Handlebars.registerHelper("includes", function (array, value) {
	if (array && value) {
		try {
			array = validation.checkStringArray(array, "includes array", 0);
		} catch (error) {
			return;
		}
		try {
			value = validation.checkString(value.toString(), "includes value");
		} catch (error) {
			return;
		}
		let i = false;
		array.forEach((element) => {
			if (element === value) {
				i = true;
			}
		});
		return i;
	}
	return;
});

app.use(methodOverride("_method"));

app.use("public", staticDir);
app.use("/", express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
