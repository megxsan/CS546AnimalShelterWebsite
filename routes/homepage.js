import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import { dogs } from "../config/mongoCollections.js";
import validation from "../validation.js";
import xss from "xss";

import { Router } from "express";
const router = Router();

router
	.route("/")
	.get(async (req, res) => {
		/*  Get 
				-Seeing all the dogs
				-Signing in button
				-Signing up button 
		*/
		// if(req.session.user === undefined){
		// Homepage for when signed out
		// let allDogs = await dogData.getAllDogs();
		// res.render('homepage', {dogs: allDogs});
		// }
		//Homepage for when signed in
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		let dogCollection = await dogs();
		let allDogs = await dogCollection.find().toArray();
		let user = null;
		if (signedIn) {
			user = await userData.getUserById(req.session.user._id);
		}
		return res.status(200).render("pages/homepage", {
			dogs: allDogs,
			signedIn: signedIn,
			user: user,
		});
	})
	.post(async (req, res) => {
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		let info = req.body;
		req.body = {};
		let dogCollection = await dogs();
		let obj = {};
		if (info.sexinput) {
			obj.sex = info.sexinput;
		}
		if (info.colorinput) {
			let colorsArray = [];
			if (!Array.isArray(info.colorinput)) {
				colorsArray.push(info.colorinput);
			} else {
				colorsArray = info.colorinput;
			}
			obj.color = { $in: colorsArray };
		}
		if (info.breedinput) {
			let breedsArray = [];
			if (!Array.isArray(info.breedinput)) {
				breedsArray.push(info.breedinput);
			} else {
				breedsArray = info.breedinput;
			}
			obj.breeds = { $in: breedsArray };
		}
		let min = parseInt(info.weightinput[0]);
		let max = parseInt(info.weightinput[1]);
		obj.weight = { $gte: min, $lte: max };
		let dogsArray = await dogCollection.find({ ...obj }).toArray();
		return res.status(200).render("pages/homepage", {
			dogs: dogsArray,
			signedIn: signedIn,
		});
	});

router
	.route("/login")
	.get(async (req, res) => {
		/*  Get 
                -Seeing login form
        */
		try {
			res.render("pages/loginForm");
		} catch (e) {
			req.session.error = e;
			res.status(500).render("pages/error", { title: "Login Error", error: e, signedIn: true});
			return;
		}
	})
	.post(async (req, res) => {
		/*  Post 
            	-Recieving login form
        */
		let errors = [];
		let data = req.body;
		try {
			data.emailAddressInput = data.emailAddressInput.toLowerCase();
			data.emailAddressInput = validation.checkString(
				data.emailAddressInput,
				"Email"
			);
			data.emailAddressInput = validation.checkEmail(data.emailAddressInput);
			data.emailAddressInput = xss(data.emailAddressInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.passwordInput = validation.checkString(
				data.passwordInput,
				"Password"
			);
			data.passwordInput = validation.checkPassword(data.passwordInput);
			data.passwordInput = xss(data.passwordInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			let returnValue = await userData.checkUser(
				data.emailAddressInput,
				data.passwordInput
			);
			if (errors.length !== 0) {
				let errorObj = { errors: errors };
				res.status(400).render("pages/loginForm", errorObj);
				return;
			}
			req.session.user = {
				firstName: returnValue.firstName,
				lastName: returnValue.lastName,
				_id: returnValue._id,
			};
			res.redirect("/");
			return;
		} catch (e) {
			errors.push(e);
			if (!errors.includes(e)) {
				errors.push(e);
			}
			let errorObj = { errors: errors };
			res.status(400).render("pages/loginForm", errorObj);
			return;
		}
	});

router
	.route("/register")
	.get(async (req, res) => {
		/*  Get 
                -Seeing signup form
        */
		try {
			res.render("pages/registerForm");
		} catch (e) {
			req.session.error = e;
			res.status(500).render("pages/error", { title: "Registration Error", error: e, signedIn: true});
			return;
		}
	})
	.post(async (req, res) => {
		/*  Post 
                -Recieving signup form
        */
		let errors = [];
		let data = req.body;
		try {
			data.firstNameInput = validation.checkString(
				data.firstNameInput,
				"First Name"
			);
			data.firstNameInput = validation.checkName(
				data.firstNameInput,
				"First Name"
			);
			data.firstNameInput = xss(data.firstNameInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.lastNameInput = validation.checkString(
				data.lastNameInput,
				"Last Name"
			);
			data.lastNameInput = validation.checkName(
				data.lastNameInput,
				"Last Name"
			);
			data.lastNameInput = xss(data.lastNameInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.emailAddressInput = data.emailAddressInput.toLowerCase();
			data.emailAddressInput = validation.checkString(
				data.emailAddressInput,
				"Email"
			);
			data.emailAddressInput = validation.checkEmail(data.emailAddressInput);
			data.emailAddressInput = xss(data.emailAddressInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.passwordInput = validation.checkString(
				data.passwordInput,
				"Password"
			);
			data.passwordInput = validation.checkPassword(data.passwordInput);
			data.passwordInput = xss(data.passwordInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.confirmPasswordInput = validation.checkString(
				data.confirmPasswordInput,
				"Confirm Password"
			);
			data.confirmPasswordInput = xss(data.confirmPasswordInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			if (data.passwordInput !== data.confirmPasswordInput)
				throw `Error: Password and Confirm Password do not match`;
		} catch (e) {
			errors.push(e);
		}
		try {
			let age = parseInt(data.ageInput);
			data.ageInput = validation.checkAge(age);
			data.ageInput = xss(data.ageInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			let returnValue = await userData.addUser(
				data.firstNameInput,
				data.lastNameInput,
				data.ageInput,
				data.emailAddressInput,
				data.passwordInput
			);
			if (errors.length !== 0) {
				let errorObj = { errors: errors };
				res.status(400).render("pages/registerForm", errorObj);
				return;
			}
			res.redirect("/login");
			return;
		} catch (e) {
			if (!errors.includes(e)) {
				errors.push(e);
			}
			let errorObj = { errors: errors };
			res.status(400).render("pages/registerForm", errorObj);
			return;
		}
	});

router.route("/logout").get(async (req, res) => {
	// Code here for GET
	req.session.destroy();
	res.redirect("/");
});

router
	.route("/filter")
	.get(async (req, res) => {
		// Code here for GET
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		let allDogs = await dogData.getAllDogs();
		let allColors = [];
		let allBreeds = [];
		allDogs.forEach((dog) => {
			if (dog.adopted === false) {
				dog.color.forEach((col) => {
					if (!allColors.includes(col)) {
						allColors.push(col);
					}
				});
				dog.breeds.forEach((breed) => {
					if (!allBreeds.includes(breed)) {
						allBreeds.push(breed);
					}
				});
			}
		});
		res.render("pages/filter", {
			colors: allColors,
			breeds: allBreeds,
			signedIn: signedIn,
		});
	})
	.post(async (req, res) => {});
export default router;
