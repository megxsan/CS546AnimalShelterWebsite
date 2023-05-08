import session from "express-session";
import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";
import xss from 'xss';

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
		let picArr = [];
		for (let i = 1; i < data.length; i++) {
			picArr.push(data[i]);
		}
		try {
			for (let i = 0; i < picArr; i++) {
				if ((!picArr[i].key.toLowerCase().endWith("jpg")) || (!picArr[i].key.toLowerCase().endWith("jpeg")) || (!picArr[i].key.toLowerCase().endWith("png"))) {
					throw `Error: ${picArr[i].key} is not`
				} 
			}
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			picArr = validation.checkPicArray(picArr, 1);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			if (data.length > 4) throw `Error: Too many photos`;
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render('error', {title: "Add Dog Error", error: error});
			return;
		}
		let formData = data[0]
		try {
			formData.nameInput = validation.checkString(formData.nameInput, "Name");
			formData.nameInput = validation.checkName(formData.nameInput, "Name");
			// formData.nameInput = xss(formData.nameInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			formData.sexInput = validation.checkString(formData.sexInput, "Sex");
			formData.sexInput = validation.checkSex(formData.sexInput, "Sex");
			// formData.sexInput = xss(formData.sexInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			formData.ageInput = formData.ageInput.trim()
			formData.ageInput = parseInt(formData.ageInput)
			formData.ageInput = validation.checkDogAge(formData.ageInput, "Age");
			// formData.ageInput = xss(formData.ageInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			formData.colorInput = formData.colorInput.trim()
			formData.colorInput = formData.colorInput.split(",");
			formData.colorInput = validation.checkStringArray(formData.colorInput, "Color", 1);
			// formData.colorInput = xss(formData.colorInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			formData.breedInput = formData.breedInput.trim()
			formData.breedInput = formData.breedInput.split(",");
			formData.breedInput = validation.checkStringArray(formData.breedInput, "Breeds", 1);
			// formData.breedInput = xss(formData.breedInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			formData.weightInput = formData.weightInput.trim()
			formData.weightInput = parseInt(formData.weightInput)
			formData.weightInput = validation.checkWeight(formData.weightInput, "Weight");
			// formData.weightInput = xss(formData.weightInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			formData.descriptionInput = validation.checkString(formData.descriptionInput, "Description");;
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
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
			// formData.traitInput = xss(formData.traitInput);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
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
			// formData.medicalInput = xss(formData.medicalInput);

		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
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
			// formData.vaccineInput = xss(formData.vaccineInput);

		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		try {
			var newDog = await dogData.addDog(formData.nameInput, formData.sexInput, formData.ageInput, formData.colorInput, formData.breedInput, formData.weightInput, formData.descriptionInput, formData.traitInput, formData.medicalInput, formData.vaccineInput, picArr, req.session.user._id);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Add Dog Error", error: error });
			return;
		}
		res.redirect(`/account/dogs/${newDog._id}`);
		return;
	});

router.route("/:dogId")
	.get(async (req, res) => {
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		try {
			req.params.dogId = validation.checkId(req.params.dogId, "Dog ID");
		} catch (e) {
			res.status(400).render("error", { title: "DogID Error", error: e });
		}
		let dog = {};
		try {
			dog = await dogData.getDogById(req.params.dogId);
		} catch (e) {
			res.status(404).render("error", { title: "DogID Error", error: e });
		}
		// TO DO: Check if user is owner of dog
		res.status(200).render("pages/mySingleDog", {
			dog: dog,
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
		let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
		try {
			req.params.dogId = validation.checkId(req.params.dogId, "Dog ID");
		} catch (e) {
			res.status(400).render("error", { title: "DogID Error", error: e });
		}
		let dog = {};
		try {
			dog = await dogData.getDogById(req.params.dogId);
		} catch (e) {
			res.status(404).render("error", { title: "DogID Error", error: e });
		}
		for (let i in dog.pictures) {
			dog.pictures[i]["index"] = i;
		}
		let isFemale = false;
		if (dog.sex === "female") {
			isFemale = true
		}
		res.status(200).render("pages/editDog", {
			dog: dog,
			signedIn: signedIn,
			dogId: req.params.dogId,
			isFemale: isFemale
		});
    })
    .patch(async (req, res) => {
        /*  Patch
                -Recieving edit dog form form
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
		let picArr = [];
		for (let i = 1; i < data.length; i++) {
			picArr.push(data[i]);
		}
		try {
			for (let i = 0; i < picArr; i++) {
				if ((!picArr[i].key.toLowerCase().endWith("jpg")) || (!picArr[i].key.toLowerCase().endWith("jpeg")) || (!picArr[i].key.toLowerCase().endWith("png"))) {
					throw `Error: ${picArr[i].key} is not`
				} 
			}
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Edit Dog Error", error: error });
			return;
		}
		try {
			picArr = validation.checkPicArray(picArr, 0);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Edit Dog Error", error: error });
			return;
		}
		let formData = data[0];
		let submitData = {};
		if (formData.deletePhotoInput.trim() !== "") {
			try {
				formData.deletePhotoInput = formData.deletePhotoInput.trim();
				var deletePhotosArr = formData.deletePhotoInput.split(",");
				for (let i in deletePhotosArr) {
					validation.checkNumString(deletePhotosArr[i]);
					let photoNum = parseInt(deletePhotosArr[i]);
					if (photoNum > parseInt(formData.currentNumPhotos) || photoNum <= 0) throw 'Error: Not a valid photo to delete';
					deletePhotosArr[i] = photoNum;
				}
			} catch (error) {
				console.log(error);
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Edit Dog Error", error: error });
				return;
			}
		} else {
			var deletePhotosArr = [];
		}
		try {
			if (data.length > 4) throw `Error: Too many photos`;
			if (((data.length - 1) + parseInt(formData.currentNumPhotos) - deletePhotosArr.length) > 3) throw `Error: Too many photos`;
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render('error', {title: "Edit Dog Error", error: error});
			return;
		}
		try {
			var oldDog = await dogData.getDogById(req.params.dogId);
		} catch (error) {
			res.status(400).render("error", { title: "Edit Dog Error", error: error });
			return;
		}
		let isFemale = false;
		if (oldDog.sex === "female") {
			isFemale = true
		}
		if (formData.nameInput.trim() !== "") {
			try {
				formData.nameInput = validation.checkString(formData.nameInput, "Name");
				formData.nameInput = validation.checkName(formData.nameInput, "Name");
				// formData.nameInput = xss(formData.nameInput);
				submitData["nameInput"] = formData.nameInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Edit Dog Error", error: error });
				return;
			}
		} else {
			submitData["nameInput"] = oldDog.name;
		}
		if (formData.sexInput.trim() !== "") {
			try {
				formData.sexInput = validation.checkString(formData.sexInput, "Sex");
				formData.sexInput = validation.checkSex(formData.sexInput, "Sex");
				// formData.sexInput = xss(formData.sexInput);

				submitData["sexInput"] = formData.sexInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["sexInput"] = oldDog.sex;
		}
		if (formData.ageInput.trim() !== "") {
			try {
				formData.ageInput = formData.ageInput.trim()
				formData.ageInput = parseInt(formData.ageInput)
				formData.ageInput = validation.checkDogAge(formData.ageInput, "Age");
				// formData.ageInput = xss(formData.ageInput);
				submitData["ageInput"] = formData.ageInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["ageInput"] = oldDog.age;
		}
		if (formData.colorInput.trim() !== "") {
			try {
				formData.colorInput = formData.colorInput.trim()
				formData.colorInput = formData.colorInput.split(",");
				formData.colorInput = validation.checkStringArray(formData.colorInput, "Color", 1);
				// formData.colorInput = xss(formData.colorInput);
				// console.log(formData.colorInput);
				submitData["colorInput"] = formData.colorInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["colorInput"] = oldDog.color;
		}
		if (formData.breedInput.trim() !== "") {
			try {
				formData.breedInput = formData.breedInput.trim()
				formData.breedInput = formData.breedInput.split(",");
				formData.breedInput = validation.checkStringArray(formData.breedInput, "Breeds", 1);
				// formData.breedInput = xss(formData.breedInput);
				submitData["breedInput"] = formData.breedInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["breedInput"] = oldDog.breeds;
		}
		if (formData.weightInput.trim() !== "") {
			try {
				formData.weightInput = formData.weightInput.trim()
				formData.weightInput = parseInt(formData.weightInput)
				formData.weightInput = validation.checkWeight(formData.weightInput, "Weight");
				// formData.weightInput = xss(formData.weightInput);
				submitData["weightInput"] = formData.weightInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["weightInput"] = oldDog.weight;
		}
		if (formData.descriptionInput.trim() !== "") {
			try {
				formData.descriptionInput = validation.checkString(formData.descriptionInput, "Description");
				// formData.descriptionInput = xss(formData.descriptionInput);
				submitData["descriptionInput"] = formData.descriptionInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["descriptionInput"] = oldDog.description;
		}
		if (formData.traitInput.trim() !== "") {
			try {
				formData.traitInput = formData.traitInput.trim()
				if (formData.traitInput === "" || (formData.traitInput.toLowerCase().trim() === "delete" && oldDog.traits.length === 0)) {
					formData.traitInput = [];
				} else {
					formData.traitInput = formData.traitInput.split(",");
				}
				formData.traitInput = validation.checkStringArray(formData.traitInput, "Traits", 0);
				// formData.traitInput = xss(formData.traitInput);
				submitData["traitInput"] = formData.traitInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["traitInput"] = oldDog.traits;
		}
		if (formData.medicalInput.trim() !== "") {
			try {
				formData.medicalInput = formData.medicalInput.trim();
				if (formData.medicalInput === "" || (formData.medicalInput.toLowerCase().trim() === "delete" && oldDog.medicalInfo.length === 0)) {
					formData.medicalInput = [];
				} else {
					formData.medicalInput = formData.medicalInput.split(",");
				}
				formData.medicalInput = validation.checkStringArray(formData.medicalInput, "Medical Info", 0);
				// formData.medicalInput = xss(formData.medicalInput);
				submitData["medicalInput"] = formData.medicalInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["medicalInput"] = oldDog.medicalInfo;
		}
		if (formData.vaccineInput.trim() !== "") {
			try {
				formData.vaccineInput = formData.vaccineInput.trim()
				if (formData.vaccineInput === ""  || (formData.vaccineInput.toLowerCase().trim() === "delete" && oldDog.vaccines.length === 0)) {
					formData.vaccineInput = [];
				} else {
					formData.vaccineInput = formData.vaccineInput.split(",");
				}
				formData.vaccineInput = validation.checkStringArray(formData.vaccineInput, "Vaccines", 0);
				// formData.vaccineInput = xss(formData.vaccineInput);
				submitData["vaccineInput"] = formData.vaccineInput;
			} catch (error) {
				for (let i in picArr) {
					let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
				}
				res.status(400).render("error", { title: "Add Dog Error", error: error });
				return;
			}
		} else {
			submitData["vaccineInput"] = oldDog.vaccines;
		}
		for (let i in deletePhotosArr) {
			let deletedPhoto = await dogData.deletePhoto(oldDog.pictures[deletePhotosArr[i] - 1].key);
			oldDog.pictures.splice(deletePhotosArr[i] - 1, 1);
		}
		picArr = oldDog.pictures.concat(picArr);
		try {
			// console.log(formData);
			// console.log(oldDog);
			if (formData.nameInput === oldDog.name &&
				formData.sexInput === oldDog.sex &&
				formData.ageInput === oldDog.age &&
				validation.checkArraysEqual(formData.colorInput, oldDog.color) &&
				validation.checkArraysEqual(formData.breedInput, oldDog.breeds) &&
				formData.weightInput === oldDog.weight &&
				formData.descriptionInput === oldDog.description &&
				validation.checkArraysEqual(formData.traitInput, oldDog.traits) &&
				validation.checkArraysEqual(formData.medicalInput, oldDog.medicalInfo) && 
				validation.checkArraysEqual(formData.vaccineInput, oldDog.vaccines)) {
			if ((formData.nameInput !== "" && formData.nameInput === oldDog.name) ||
				(formData.sexInput !== "" && formData.sexInput === oldDog.sex) ||
				(formData.ageInput !== "" && formData.ageInput === oldDog.age) ||
				(formData.colorInput.length !== 0 && validation.checkArraysEqual(formData.colorInput, oldDog.color)) ||
				(formData.breedInput.length !== 0 && validation.checkArraysEqual(formData.breedInput, oldDog.breeds)) ||
				(formData.weightInput !== "" && formData.weightInput === oldDog.weight) ||
				(formData.descriptionInput !== "" && formData.descriptionInput === oldDog.description) ||
				(formData.traitInput.length !== 0 && validation.checkArraysEqual(formData.traitInput, oldDog.traits)) ||
				(formData.medicalInput.length !== 0 && validation.checkArraysEqual(formData.medicalInput, oldDog.medicalInfo)) ||
				(formData.vaccineInput.length !== 0 && validation.checkArraysEqual(formData.vaccineInput, oldDog.vaccines))) {
					throw 'Error: Form item must be different from the original'
				}
			} 
		}catch (error) {
			res.status(400).render("pages/editDog", {
				dog: oldDog,
				signedIn: signedIn,
				dogId: req.params.dogId,
				isFemale: isFemale,
				error: error
			});
			return;
		}
		/*
		try {
			if ((oldDog.traits === [] && formData.traitInput[0].toLowerCase === "delete" && formData.traitInput.length === 1) &&
				(oldDog.medicalInfo === [] && formData.medicalInput[0].toLowerCase === "delete" && formData.medicalInput.length === 1) &&
				(oldDog.vaccines === [] && formData.vaccineInput[0].toLowerCase === "delete" && formData.vaccineInput.length === 1)) {
					throw 'Error: You can not delete info if there was no info';
				}
		} catch (error) {
			res.status(400).render("pages/editDog", {
				dog: oldDog,
				signedIn: signedIn,
				dogId: req.params.dogId,
				isFemale: isFemale,
				error: error
			});
			return;
		}
		*/
		try {
			var editDog = await dogData.updateDog(submitData.nameInput, submitData.sexInput, submitData.ageInput, submitData.colorInput, submitData.breedInput, submitData.weightInput, submitData.descriptionInput, submitData.traitInput, submitData.medicalInput, submitData.vaccineInput, picArr, req.params.dogId);
		} catch (error) {
			for (let i in picArr) {
				let deletedPhoto = await dogData.deletePhoto(picArr[i].key);
			}
			res.status(400).render("error", { title: "Edit Dog Error", error: error });
			return;
		}
		res.redirect(`/account/dogs/${req.params.dogId}`);
		return;
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
		} catch (e) {
			console.log(e)
			// res.status(404).render("error", { title: "Dog Delete Error", error: e });
			return;
		}
		res.redirect("/account/dogs");
		return;
});

router
	.route("/:dogId/applications")
	.get(async (req, res) => {
		if(!req.session.user){
			return res.render('pages/homepage', {title: "Home", signedIn: false});
		}else{
			try{
				let info = await dogData.getDogById(req.params.dogId);		
				return res.render('pages/applicants', {title: "Applicants", dog: info, signedIn: true})
			}catch(e){
				return res.status(500).render('pages/homepage', {title: "Home", signedIn: true});
			}
		}
	})
	.post(async (req, res) => {
		if(!req.session.user){
			return res.render('pages/homepage', {title: "Home", signedIn: true});
		}else{
			//this is where we accept/reject the application
			let user = await userData.getUserById(req.body.userId);
			let dog = await dogData.getDogById(req.params.dogId)

			if(req.body.accept){
				try{
					let accepted = await appData.appStatus(user.application._id.toString(), req.params.dogId, req.body.userId, "accepted")
					dog = await dogData.getDogById(req.params.dogId)
					return res.render('pages/applicants', {title: "Applicants", dog: dog, signedIn: true});
				}catch(e){
					console.log(e)
				}
			}else if(req.body.reject){
				try{
					let rejected = await appData.appStatus(user.application._id.toString(), req.params.dogId, req.body.userId,"rejected")
					dog = await dogData.getDogById(req.params.dogId)
					return res.render('pages/applicants', {title: "Applicants", dog: dog, signedIn: true})

				}catch(e){
					return res.render('pages/applicants', {title: "Applicants", dog: dog, signedIn: true})
				}			
			}
		}
});


export default router;
