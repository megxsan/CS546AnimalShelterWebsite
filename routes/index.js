import homepageRoutes from "./homepage.js";
import dogsRoutes from "./dogs.js";
import appRoutes from "./application.js";
import myDogsRoutes from "./myDogs.js";
import quizRoutes from "./quiz.js";
import settingsRoutes from "./settings.js";
import specificDogsRoutes from "./specificDogs.js";

const constructorMethod = (app) => {
	app.use("/", homepageRoutes);
	app.use("/dogs", dogsRoutes);
	app.use("/account/settings", settingsRoutes);
	app.use("/account/quiz", quizRoutes);
	app.use("/account/dogs", myDogsRoutes);
	app.use("/account/application", appRoutes);
	app.use("/account/specificDogs", specificDogsRoutes);

	app.use("*", (req, res) => {
		res.redirect("/");
	});
};

export default constructorMethod;
