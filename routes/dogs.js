import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/:dogId")
	.get(async (req, res) => {
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		/*  Get 
                -Displaying all the data on the dog
                -Seeing likes & comments
        */
		/*if (!req.sessions.user._id) {
			res.render("error", {
				title: "DogID Error",
				error: "Must be signed in to change your settings",
			});
		}*/
		try {
			req.params.dogId = validation.checkId(req.params.dogId, "Dog ID");
		} catch (e) {
			res.status(400).render("error", { title: "DogID Error", error: e });
		}
		let dog = {};
		let user = {};
		try {
			dog = await dogData.getDogById(req.params.dogId);
			user = await userData.getUserById(dog.userId);
		} catch (e) {
			res.status(404).render("error", { title: "DogID Error", error: e });
		}
		res
			.status(200)
			.render("pages/singledog", { dog: dog, user: user, signedIn: signedIn });
	})
	.patch(async (req, res) => {
		/*  Patch 
                -Sending an application
                -Clicking a like
                -Adding a comment
        */
		if (!req.sessions.user._id) {
			res.render("error", {
				title: "DogID Error",
				error: "Must be signed in to change your settings",
			});
		}
		try {
			//checking to make sure only like happened, only comment happened, or only application happened
		} catch (e) {
			res.render("error", { title: "Error" }).status(400);
		}

		let dog = req.params.dogId;
		if (!req.body.likes && !req.body.comments && !req.body.interest) {
			res.render("error", { title: "Error" });
		}
		let foundDog = {};
		try {
			foundDog = await dogData.getDogById(req.params.dogId);
		} catch (e) {
			res.render("error", { title: "DogID Error", error: e }).status(404);
		}
		//doing something different in each case
		if (req.body.like) {
			//increment the likes in the dog by 1
		}
		if (req.body.interest) {
			//?
		}
		if (req.body.comments) {
			//append the comment to the array
		}
	})
	.post(async (req, res) => {
		if (!req.session.user) {
			res.render("error", {
				title: "DogID Error",
				error: "Must be signed in to change your settings",
			});
		}
		let info = req.body;
		let foundDog = {};
		try {
			foundDog = await dogData.getDogById(info.dogId);
		} catch (e) {
			res.render("error", { title: "DogID Error", error: e }).status(404);
		}
		let foundUser = {};
		try {
			foundUser = await userData.getUserById(req.session.user._id);
		} catch (e) {
			res.render("error", { title: "UserID Error", error: e }).status(404);
		}
		try {
			await userData.addIgnoredDog(info.dogId, req.session.user._id);
		} catch (e) {
			console.log(e);
			//res.status(404).render("error", { title: "Ignore Error", error: e });
		}
		res.status(200).redirect("/");
	});

export default router;
