(function () {
	function checkString(strVal, varName) {
		if (!strVal) throw `Error: You must supply a ${varName}!`;
		if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
		if (varName.toLowerCase().trim() !== "password") {
			strVal = strVal.trim();
		}
		if (strVal.length === 0)
			throw `Error: ${varName} cannot be an empty string or string with just spaces`;
		if (!isNaN(strVal))
			throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
		let regExp = /[a-zA-Z]/g;
		if (!regExp.test(strVal))
			`Error: ${strVal} is not a valid value for ${varName} as it does not contain letters`;
		return strVal;
	}

	function checkNumString(strVal, varName) {
		if (!strVal) throw `Error: You must supply a ${varName}!`;
		if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
		if (strVal.length === 0)
			throw `Error: ${varName} cannot be an empty string or string with just spaces`;
		let regExp = /^\d+$/;
		if(!regExp.test(strVal)) `Error: ${strVal} is not a valid value for ${varName} as it contains letters`;
		return strVal;
	}

	function checkName(name, varName) {
		var regName = /^[a-z'-]+$/i;
		if (!regName.test(name)) throw `Error: Invalid ${varName} given`;
		if (name.length < 2 || name.length > 25)
			throw `Error: Invalid ${varName} given`;
		return name;
	}

	function checkPassword(password) {
		if (/\s/.test(password)) throw `Error: Invalid Password given`;
		if (!/(?=.*\d)(?=.*[A-Z])(?=.*\W)/.test(password))
			throw `Error: Invalid Password given`;
		if (password.length < 8) throw `Error: Invalid Password given`;
		return password;
	}

	function checkEmail(email) {
		if (!email) throw "Error: You must provide an email";
		if (typeof email !== "string") throw "Error: Email must be a string";
		email = email.trim();
		if (email.length === 0)
			throw "Error: Email must be more than an empty string";
		let at = email.indexOf("@");
		let end = email.indexOf(".");
		if (!(at < end)) throw `Error: Not a valid email`;
		if (at === -1 || end === -1) throw `Error: Not a valid email`;
		let emailEnd = email.slice(-4);
		if (
			emailEnd !== ".com" &&
			emailEnd !== ".net" &&
			emailEnd !== ".edu" &&
			emailEnd !== ".gov" &&
			emailEnd !== ".org"
		)
			throw "Error: You must provide a valid email";
		return email;
		/* Do we want to use this email validator instead?
		var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!regEmail.test(email)) throw `Error: Invalid Email given`;
		return email;
		*/
	}

	function checkAge(num) {
		if (!num) throw "Error: You must supply an age";
		if (typeof num != "number") throw "Error: Age must be a number";
		if (!Number.isInteger(num)) throw "Error: Age must be an integer";
		if (num < 18 || num > 120)
			throw "Error: You are too young or have provided a fake age";
		return num;
	}
	function checkStringArray(arr, varName, minLength) {
		if (!arr || !Array.isArray(arr))
			throw `Error: You must provide an array of ${varName}`;
		if (arr.length < minLength)
			throw `Error: ${varName} must have at least ${minLength} element(s)`;
		for (let i in arr) {
			if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
				throw `Error: One or more elements in ${varName} array is not a string or is an empty string`;
			}
			arr[i] = arr[i].trim();
		}
		return arr;
	}

	function checkWeight(weight, varName) {
		if (!weight) throw `Error: You must supply a ${varName}!`;
		if (typeof weight !== "number") throw `Error: ${varName} must be a number!`;
		if (weight < 0) throw `Error: ${varName} cannot be less than 0`;
		weight = weight.toFixed(1);
		weight = parseFloat(weight);
		return weight;
	}

	function checkSex(sex, varName) {
		if (!sex) throw `Error: You must supply a ${varName}!`;
		if (typeof sex !== "string") throw `Error: ${varName} must be a string!`;
		sex = sex.trim();
		sex = sex.toLowerCase();
		if (sex.length === 0)
			throw `Error: ${varName} cannot be an empty string or string with just spaces`;
		if (!isNaN(sex))
			throw `Error: ${sex} is not a valid value for ${varName} as it only contains digits`;
		if (sex !== "male" && sex !== "female")
			throw `Error: ${varName} must be either \'male\' or \'female\'`;
		return sex;
	}

	function checkDogAge(age, varName) {
		if (!age) throw `Error: You must supply a ${varName}!`;
		if (typeof age !== "number") throw `Error: ${varName} must be a number!`;
		if (age < 0 || age > 30)
			throw `Error: ${varName} cannot be less than 0 or greater than 30`;
		return age;
	}

	const editDogForm = document.getElementById("edit-dog-form"); 

	console.log(editDogForm);

	if (editDogForm) {
		editDogForm.addEventListener("submit", (event) => {
			alert("CLIENT SIDE EDIT DOG FORM");

			let name = document.getElementById("nameInput");
			let sex = document.getElementById("sexInput");
			let age = document.getElementById("ageInput");
			let color = document.getElementById("colorInput");
			let breed = document.getElementById("breedInput");
			let weight = document.getElementById("weightInput");
			let description = document.getElementById("descriptionInput");
			let trait = document.getElementById("traitInput");
			let medical = document.getElementById("medicalInput");
			let vaccine = document.getElementById("vaccineInput");
			let photo = document.getElementById("photoInput");
			let numPhotos = document.getElementById("numPhotos");
			let deletePhotos = document.getElementById("deletePhotoInput");
			let currentNumPhotos = document.getElementById("currentNumPhotos");

			let error1 = document.getElementById("error1");
			let error2 = document.getElementById("error2");
			let error3 = document.getElementById("error3");
			let error4 = document.getElementById("error4");
			let error5 = document.getElementById("error5");
			let error6 = document.getElementById("error6");
			let error7 = document.getElementById("error7");
			let error8 = document.getElementById("error8");
			let error9 = document.getElementById("error9");
			let error10 = document.getElementById("error10");
			let error11 = document.getElementById("error11");
			let error12 = document.getElementById("error12");
			let error13 = document.getElementById("error13");
			let emptyError = document.getElementById("emptyError");

			error1.hidden = true;
			error2.hidden = true;
			error3.hidden = true;
			error4.hidden = true;
			error5.hidden = true;
			error6.hidden = true;
			error7.hidden = true;
			error8.hidden = true;
			error9.hidden = true;
			error10.hidden = true;
			error11.hidden = true;
			error12.hidden = true;
			error13.hidden = true;
			emptyError.hidden = true;

			if (name.value.trim() === "" && 
				sex.value.trim() === "" && 
				age.value.trim() === "" && 
				color.value.trim() === "" && 
				breed.value.trim() === "" &&
				weight.value.trim() === "" && 
				description.value.trim() === "" && 
				trait.value.trim() === "" && 
				medical.value.trim() === "" && 
				vaccine.value.trim() === "" && 
				photo.value.trim() === "" && 
				deletePhotos.value.trim() === "") {
					event.preventDefault();
					emptyError.hidden = false;
			}
			if (name.value.trim() !== "") {
				try {
					name.value = checkString(name.value, "Name");
					name.value = checkName(name.value, "Name");
				} catch (error) {
					event.preventDefault();
					error1.hidden = false;
				}
			}
			if (sex.value.trim() !== "") {
				try {
					sex.value = checkString(sex.value, "Sex");
					sex.value = checkSex(sex.value, "Sex");
				} catch (error) {
					event.preventDefault();
					error2.hidden = false;
				}
			}

			if (age.value.trim() !== "") {
				try {
					age.value = age.value.trim();
					let ageNum = parseInt(age.value);
					ageNum = checkDogAge(ageNum, "Age");
				} catch (error) {
					event.preventDefault();
					error3.hidden = false;
				}
			}

			if (color.value.trim() !== "") {
				try {
					color.value = checkString(color.value, "Color");
					let colorArr = color.value.split(",");
					colorArr = checkStringArray(colorArr, "Color", 1);
				} catch (error) {
					event.preventDefault();
					error4.hidden = false;
				}
			}

			if (breed.value.trim() !== "") {
				try {
					breed.value = checkString(breed.value, "Breed");
					let breedArr = breed.value.split(",");
					breedArr = checkStringArray(breedArr, "Breed", 1);
				} catch (error) {
					event.preventDefault();
					error5.hidden = false;
				}
			}

			if (weight.value.trim() !== "") {
				try {
					weight.value = weight.value.trim();
					let weightNum = parseInt(weight.value);
					weightNum = checkWeight(weightNum, "Weight");
				} catch (error) {
					event.preventDefault();
					error6.hidden = false;
				}
			}

			if (description.value.trim() !== "") {
				try {
					description.value = checkString(description.value, "Description");
				} catch (error) {
					event.preventDefault();
					error7.hidden = false;
				}
			}

			if (trait.value.trim() !== "") {
				try {
					trait.value = checkString(trait.value, "Traits");
					let traitArr = trait.value.split(",");
					traitArr = checkStringArray(traitArr, "Traits", 0);
				} catch (error) {
					event.preventDefault();
					error8.hidden = false;
				}
			}

			if (medical.value.trim() !== "") {
				try {
					medical.value = checkString(medical.value, "Medical Info");
					let medicalArr = medical.value.split(",");
					medicalArr = checkStringArray(medicalArr, "Medical Info", 0);
				} catch (error) {
					event.preventDefault();
					error9.hidden = false;
				}
			}

			if (vaccine.value.trim() !== "") {
				try {
					vaccine.value = checkString(vaccine.value, "Vaccines");
					let vaccineArr = vaccine.value.split(",");
					vaccineArr = checkStringArray(vaccineArr, "Vaccines", 0);
				} catch (error) {
					event.preventDefault();
					error10.hidden = false;
				}
			}
			if (photo.value !== "") {
				numPhotos.value = photo.files.length.toString();
			}

			if (deletePhotos.value.trim() !== "") {
				try {
					deletePhotos.value = deletePhotos.value.trim()
					var deletePhotosArr = deletePhotos.value.split(",");
					for (let i in deletePhotosArr) {
						checkNumString(deletePhotosArr[i]);
						let photoNum = parseInt(deletePhotosArr[i]);
						if (photoNum > photo.files.length && photoNum <= 0) throw 'Error: Not a valid photo to delete';
					}
				} catch (error) {
					event.preventDefault();
					error13.hidden = false;
				}
			}

			try {
				if (photo.files.length + parseInt(currentNumPhotos.value) - deletePhotosArr.length > 3) throw "Error: Too many photos uploaded";
			} catch (error) {
				event.preventDefault();
				error12.hidden = false;
			}
		});
	}

})();
