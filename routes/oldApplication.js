//routes for app
import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();
//add imports

router
	.route("/:account/app")
	.get(async (req, res) => {
		//code here for GET
		if (!ObjectId.isValid(req.params.account)) {
			return res.render("error", { title: "Invalid ID" });
		}
		res.render("application", { title: "Application", id: req.params.account });
	})
	.post(async (req, res) => {
		//code here for POST
		let application = req.body;
		if (!application || Object.keys(application).length != 14) {
			res.render("error", { title: "missing application input" });
		}

		//now error check for the application
		try {
			application.children = validation.checkBool(
				application.children,
				"Children Boolean"
			);
			application.animals = validation.checkBool(
				application.animals,
				"Animals Boolean"
			);
			application.age = validation.checkNum(application.age, "Age");
			application.phone = validation.checkNum(application.phone, "Phone");
			application.timeAlone = validation.checkNum(
				application.timeAlone,
				"Time Alone"
			);

			//insert checking age/time/phone ranges
			application.firstName = validation.checkString(
				application.firstName,
				"First Name"
			);
			application.lastName = validation.checkString(
				application.lastName,
				"Last Name"
			);
			application.email = validation.checkEmail(application.email);
			application.livingAccomodations = validation.checkString(
				application.livingAccomodations,
				"Living Accommodations"
			);
			application.reasoning = validation.checkString(
				application.reasoning,
				"Reasoning"
			);
			validation.nameChecker(firstName);
			validation.nameChecker(lastName);

			//include checking email and living accom
			application.childrenAges = validation.checkNumArray(
				application.childrenAges,
				"Children Ages",
				0
			);
			application.typeAnimals = validation.checkStringArray(
				application.typeAnimals,
				"Animal Types",
				0
			);
			application.yard = validation.checkStringArray(
				application.yard,
				"Yard",
				0
			);
			//go back and check these values
		} catch (e) {
			res.render("error", { title: "incorrect application input", error: e });
		}
		if (!ObjectId.isValid(application.userId)) {
			res.render("error", { title: "invalid userID", error: e });
		}

		const {
			userId,
			firstName,
			lastName,
			age,
			email,
			phone,
			livingAccommodations,
			children,
			childrenAges,
			timeAlone,
			animals,
			typeAnimals,
			yard,
			reasoningExperience,
		} = application;
		const newApp = await appData.create(
			userId,
			firstName,
			lastName,
			age,
			email,
			phone,
			livingAccommodations,
			children,
			childrenAges,
			timeAlone,
			animals,
			typeAnimals,
			yard,
			reasoningExperience
		);
		return res.status(200).render("posts", { title: "New Post", app: newApp });
	});

export default router;
