import session from "express-session";
import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
	let signedIn = true;
	if (!req.session.user) {
		signedIn = false;
	}
	/*  Get 
                -Seeing all your dogs
        */
	if (!req.session.user._id) {
		res.render("error", {
			title: "Dog Error",
			error: "Must be signed in to access your dogs",
		});
	}
	try {
		let dogs = await dogData.getMyDogs(req.session.user._id);
		res.render("pages/myDogs", {
			title: "MyDogs",
			dogs: dogs,
			signedIn: signedIn,
		});
	} catch (e) {
		res.status(500).render("error", { title: "MyDogs Error", error: e });
	}
});

router
	.route("/add")
	.get(async (req, res) => {
		/*  Get 
                -Seeing add dog form
        */
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		if (!req.session.user._id) {
			res.render("error", {
				title: "Dog Error",
				error: "Must be signed in to post your dog",
			});
		}
		try {
			res.render("pages/addDog", { title: "Add Dog", signedIn: signedIn });
		} catch (error) {
			res.status(500).render("error", { title: "Add Dog Error", error: e });
		}
	})
	.post(async (req, res) => {
		/*  Post 
					-Recieving add dog form form
			*/
			let signedIn = true;
			if (!req.session.user){
					signedIn = false;
			}
			if(!req.session.user._id){
					res.render('error', {title: "Dog Error", error: "Must be signed in to post your dog"});
					return;
			}
			try {
				var data = await dogData.uploadPhoto(req);
			} catch (error) {
				res.status(500).render('error', {title: "Server Error", error: error});
				return;
			}
			// TO DO: Delete photos if other parameters fails
			let formData = data[0]
			try {
				formData.nameInput = validation.checkString(formData.nameInput, "Name");
				formData.nameInput = validation.checkName(formData.nameInput, "Name");
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.sexInput = validation.checkString(formData.sexInput, "Sex");
				formData.sexInput = validation.checkSex(formData.sexInput, "Sex");
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.ageInput = formData.ageInput.trim()
				formData.ageInput = parseInt(formData.ageInput)
				formData.ageInput = validation.checkDogAge(formData.ageInput, "Age");
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.colorInput = formData.colorInput.trim()
				formData.colorInput = formData.colorInput.split(",");
				formData.colorInput = validation.checkStringArray(formData.colorInput, "Color", 1);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.breedInput = formData.breedInput.trim()
				formData.breedInput = formData.breedInput.split(",");
				formData.breedInput = validation.checkStringArray(formData.breedInput, "Breeds", 1);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.weightInput = formData.weightInput.trim()
				formData.weightInput = parseInt(formData.weightInput)
				formData.weightInput = validation.checkWeight(formData.weightInput, "Weight");
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.descriptionInput = validation.checkString(formData.descriptionInput, "Description");;
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.traitInput = formData.traitInput.trim()
				if (formData.traitInput === "") {
					formData.traitInput = [];
				} else {
					formData.traitInput = formData.traitInput.split(",");
				}
				formData.traitInput = validation.checkStringArray(formData.traitInput, "Traits", 0);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.medicalInput = formData.medicalInput.trim()
				if (formData.medicalInput === "") {
					formData.medicalInput = [];
				} else {
					formData.medicalInput = formData.medicalInput.split(",");
				}
				formData.medicalInput = validation.checkStringArray(formData.medicalInput, "Medical Info", 0);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				formData.vaccineInput = formData.vaccineInput.trim()
				if (formData.vaccineInput === "") {
					formData.vaccineInput = [];
				} else {
					formData.vaccineInput = formData.vaccineInput.split(",");
				}
				formData.vaccineInput = validation.checkStringArray(formData.vaccineInput, "Vaccines", 0);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			// TO DO: Check pic array size (max 3)
			let picArr = [];
			for (let i = 1; i < data.length; i++) {
				picArr.push(data[i]);
			}
			try {
				picArr = validation.checkPicArray(picArr, 1);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			try {
				let newDog = await dogData.addDog(formData.nameInput, formData.sexInput, formData.ageInput, formData.colorInput, formData.breedInput, formData.weightInput, formData.descriptionInput, formData.traitInput, formData.medicalInput, formData.vaccineInput, picArr, req.session.user._id);
			} catch (error) {
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
			res.redirect("/account/dogs");
			return;
	});

router.route("/:dogId").get(async (req, res) => {
	let signedIn = true;
	if (!req.session.user) {
		signedIn = false;
	}
	try {
		req.params.dogId = validation.checkId(req.params.dogId, "Dog ID");
	} catch (e) {
		//res.status(400).render("error", { title: "DogID Error", error: e });
	}
	let dog = {};
	let user = {};
	try {
		dog = await dogData.getDogById(req.params.dogId);
		user = await userData.getUserById(dog.userId);
	} catch (e) {
		//res.status(404).render("error", { title: "DogID Error", error: e });
	}
	res.status(200).render("pages/mySingleDog", {
		dog: dog,
		user: user,
		signedIn: signedIn,
		dogId: req.params.dogId,
	});
});

router
	.route("/:dogId/edit")
	.get(async (req, res) => {
	/*  Get 
			-Seeing edit dog form
	*/

    })
    .patch(async (req, res) => {
        /*  Patch
                -Recieving edit dog form form
        */

    })

router
	.route("/:dogId/delete")
    .delete(async (req, res) => {
        /*  Delete
                -Delete dog
        */
	let signedIn = true;
	if (!req.session.user) {
		signedIn = false;
	}
	if (!req.session.user._id) {
		res.render("error", {
			title: "Dog Delete Error",
			error: "Must be signed in to delete your dog",
		});
		return;
	}
	try {
		let deletedDog = await dogData.removeDog(req.params.dogId);
	} catch (error) {
		res.status(404).render("error", { title: "Dog Delete Error", error: e });
		return;
	}
	res.redirect("/account/dogs");
	return;
});

export default router;
