import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

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
		let signedOut = true;
		let signedIn = false;
		let loggedOut = false;
		let allDogs = await dogData.getAllDogs();
		res.render('pages/homepage', {dogs: allDogs, signedOut: signedOut, signedIn: signedIn, loggedOut: loggedOut});
    });

router
	.route("/login")
	.get(async (req, res) => {
        /*  Get 
                -Seeing login form
        */
		try {
			res.render('pages/loginForm');
		} catch (e) {
			req.session.error = e;
			res.status(500).json({error: 'Redirect to /error'});
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
			data.emailAddressInput = validation.checkString(data.emailAddressInput, "Email");
			data.emailAddressInput = validation.checkEmail(data.emailAddressInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.passwordInput = validation.checkString(data.passwordInput, "Password");
			data.passwordInput = validation.checkPassword(data.passwordInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			let returnValue = await userData.checkUser(
				data.emailAddressInput,
				data.passwordInput,
			);
			if (errors.length !== 0) {
				let errorObj = {errors: errors};
				res.status(400).render('pages/loginForm', errorObj);
				return;
			}
			req.session.user = {
				firstName: returnValue.firstName, 
				lastName: returnValue.lastName,
				_id: returnValue._id
			}
			res.redirect("/");
			return;
		} catch (e) {
			errors.push(e);
			if (!errors.includes(e)) {
				errors.push(e);
			}
			let errorObj = {errors: errors};
			res.status(400).render('pages/loginForm', errorObj);
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
			res.render('pages/registerForm');
		} catch (e) {
			req.session.error = e;
			res.status(500).json({error: 'Redirect to /error'});
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
			data.firstNameInput = validation.checkString(data.firstNameInput, "First Name");
			data.firstNameInput = validation.checkName(data.firstNameInput, "First Name");
		} catch (e) {
			errors.push(e);
		}
		try {
			data.lastNameInput = validation.checkString(data.lastNameInput, "Last Name");
			data.lastNameInput = validation.checkName(data.lastNameInput, "Last Name");
		} catch (e) {
			errors.push(e);
		}
		try {
			data.emailAddressInput = data.emailAddressInput.toLowerCase();
			data.emailAddressInput = validation.checkString(data.emailAddressInput, "Email");
			data.emailAddressInput = validation.checkEmail(data.emailAddressInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.passwordInput = validation.checkString(data.passwordInput, "Password");
			data.passwordInput = validation.checkPassword(data.passwordInput);
		} catch (e) {
			errors.push(e);
		}
		try {
			data.confirmPasswordInput = validation.checkString(data.confirmPasswordInput, "Confirm Password");
		} catch (e) {
			errors.push(e);
		}
		try {
			if (data.passwordInput !== data.confirmPasswordInput) throw `Error: Password and Confirm Password do not match`;
		} catch (e) {
			errors.push(e);
		}
		try {
			data.ageInput = validation.checkAge(parseInt(data.ageInput));
		} catch (e) {
			errors.push(e);
		}
		try {
			let returnValue = await userData.addUser(
				data.firstNameInput, 
				data.lastNameInput,
				data.ageInput,
				data.emailAddressInput,
				data.passwordInput,
			);
			if (errors.length !== 0) {
				let errorObj = {errors: errors};
				res.status(400).render('pages/registerForm', errorObj);
			return;
			}
			res.redirect('/login');
			return;
		} catch (e) {
			if (!errors.includes(e)) {
			errors.push(e);
			}
			let errorObj = {errors: errors};
			res.status(400).render('pages/registerForm', errorObj);
			return;
		}
    });

router
	.route('/logout')
	.get(async (req, res) => {
		// Code here for GET
		req.session.destroy();
		res.redirect("/");
	  });

export default router;
