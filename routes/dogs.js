import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/:dogId")
	.get(async (req, res) => {
		/*  Get 
                -Displaying all the data on the dog
                -Seeing likes & comments
        */
		if (!req.sessions.user._id) {
			res.render("error", {
				title: "DogID Error",
				error: "Must be signed in to change your settings",
			});
		}
		try {
			req.params.dogId = validation.checkId(req.params.dogId, "Dog ID");
		} catch (e) {
			res.render("error", { title: "DogID Error", error: e }).status(400);
		}
		let dog = {};
		try {
			dog = await dogData.getDogById(req.params.dogId);
			user = await userData.getUserById(dog.userId);
		} catch (e) {
			res.render("error", { title: "DogID Error", error: e }).status(404);
		}
		res.render("singledog", { dog: dog, user: user }).status(200);
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
	});

export default router;
