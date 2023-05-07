import session from "express-session";
import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";

import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router.route("/ignored").get(async (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
	}
	let user = await userData.getUserById(req.session.user._id);
	let dogs = [];
	let allDogs = await dogData.getAllDogs();
	user.disliked.forEach((element) => {
		allDogs.forEach((d) => {
			if (d._id === element) {
				dogs.push(d);
			}
		});
	});
	return res.status(200).render("pages/specificDogs", {
		title: "Ignored Dogs",
		dogs: dogs,
	});
});
router.route("/liked").get(async (req, res) => {
	if (!req.session.user) {
		res.redirect("/");
	}
	let user = await userData.getUserById(req.session.user._id);
	let dogs = [];
	let allDogs = await dogData.getAllDogs();
	user.liked.forEach((element) => {
		allDogs.forEach((d) => {
			if (d._id === element) {
				dogs.push(d);
			}
		});
	});
	return res.status(200).render("pages/specificDogs", {
		title: "Liked Dogs",
		dogs: dogs,
		signedIn: true
	});
});

export default router;
