import { ObjectId } from "mongodb";

const exportedMethods = {
	checkName(name, varNam) {
		var regName = /^[a-z ,.'-]+$/i;
		name = name.trim();
		if (!regName.test(name)) throw `Error: Invalid ${varName} given`;
		return name;
	},

	checkNum(num, varName) {
		if (!num) throw `Error: You must provide a ${varName}`;
		if (typeof num != "number") throw `Error: ${varName} must be a number`;
		if (isNaN(num) === true) throw `Error: ${varName} must be a number`;
		if (num != Math.floor(num)) throw `Error ${varName} cannot be a decimal`;
		return num;
	},

	checkBool(bool, varName) {
		if (!bool) throw `Error: You must provide a ${varName}`;
		if (typeof bool != "boolean") throw `Error: A boolean is required`;
		return bool;
	},

	checkId(id, varName) {
		if (!id) throw `Error: You must provide a ${varName}`;
		if (typeof id !== "string") throw `Error:${varName} must be a string`;
		id = id.trim();
		if (id.length === 0)
			throw `Error: ${varName} cannot be an empty string or just spaces`;
		if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
		return id;
	},

	checkString(strVal, varName) {
		if (!strVal) throw `Error: You must supply a ${varName}!`;
		if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
		strVal = strVal.trim();
		if (strVal.length === 0)
			throw `Error: ${varName} cannot be an empty string or string with just spaces`;
		if (!isNaN(strVal))
			throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
		return strVal;
	},

	checkStringArray(arr, varName, minLength) {
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
	},

	checkNumArray(arr, varName, minLength) {
		if (!arr || !Array.isArray(arr))
			throw `Error: You must provide an array of ${varName}`;
		if (arr.length < minLength)
			throw `Error: ${varName} must have at least ${minLength} element(s)`;
		for (let i in arr) {
			this.checkNum(arr[i], varName);
		}
		return arr;
	},

	checkSex(sex, varName) {
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
	},

	checkDogAge(age, varName) {
		if (!age) throw `Error: You must supply a ${varName}!`;
		if (typeof age !== "number") throw `Error: ${varName} must be a number!`;
		if (age < 0 || age > 30)
			throw `Error: ${varName} cannot be less than 0 or greater than 30`;
		return age;
	},

	checkWeight(weight, varName) {
		if (!weight) throw `Error: You must supply a ${varName}!`;
		if (typeof weight !== "number") throw `Error: ${varName} must be a number!`;
		if (weight < 0) throw `Error: ${varName} cannot be less than 0`;
		weight = weight.toFixed(1);
		weight = parseFloat(weight);
		return weight;
	},

	checkArrEqual(arr1, arr2) {
		if (arr1.length !== arr2.length) return false;
		let sortedArr1 = arr1.sort();
		let sortedArr2 = arr2.sort();
		for (let i = 0; i < sortedArr1.length; i++) {
			if (sortedArr1[i] !== sortedArr2[i]) return false;
		}
		return true;
	},

	checkAge(num) {
		if (!num) throw "Error: You must supply an age";
		if (typeof num !== "number") throw "Error: Age must be a number";
		if (!Number.isInteger(num)) throw "Error: Age must be an integer";
		if (num < 18 || num > 120)
			throw "Error: You are too young or have provided a fake age";
		return num;
	},

	checkEmail(email) {
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

		if (
			email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			) === false
		) {
			//we got this match comparison from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
			throw "Error: You must provide a valid email";
		}
		return email;
		/* Do we want to use this email validator instead?
		var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!regEmail.test(email)) throw `Error: Invalid Email given`;
		return email;
		*/
	},

	checkPicArray(arr, minLength) {
		if (!arr || !Array.isArray(arr))
			throw `Error: You must provide an array of Pictures`;
		if (arr.length < minLength)
			throw `Error: Pictures must have at least ${minLength} element(s)`;
		for (let i in arr) {
			if (
				typeof arr[i] !== "object" ||
				Array.isArray(arr[i]) ||
				arr[i] === null
			) {
				throw `Error: One or more elements in Pictures array is not an object`;
			}
			if (
				Object.keys(arr[i]).length !== 2 ||
				!arr[i].hasOwnProperty("key") ||
				!arr[i].hasOwnProperty("url")
			) {
				throw `Error: One or more elements in Pictures array does have the correct properties`;
			}
			if (
				typeof arr[i].key !== "string" ||
				arr[i].key.trim().length === 0 ||
				typeof arr[i].url !== "string" ||
				arr[i].url.trim().length === 0
			) {
				throw `Error: One or more properties in Pictures array is not a string or is an empty string`;
			}
			arr[i].key = arr[i].key.trim();
			arr[i].url = arr[i].url.trim();
		}
		return arr;
	},

	checkAppInputs(
		userId,
		firstName,
		lastName,
		age,
		email,
		phone,
		livingAccommodations,
		children,
		timeAlone,
		animals,
		yard,
		reasoningExperience
	) {
		userId = this.checkId(userId, "User ID");
		// Checking booleans
		// children = this.checkBool(children, "Children Boolean");
		// animals = this.checkBool(animals, "Animals Boolean");

		// Checking numbers
		// age = this.checkAge(age);
		// phone = this.checkNum(phone, "Phone Number");
		// let age2 = parseInt(age);
		// age = this.checkAge(age2);
		phone = this.checkString(phone, "Phone Number")

		if (phone.toString().length != 12) throw `Error: Invalid phone number`;
		if (timeAlone < 0 || timeAlone > 24)
			throw `Error: Time alone must be between 0 and 24 hours`;
		
		// Checking strings
		firstName = this.checkString(firstName, "First Name");
		lastName = this.checkString(lastName, "Last Name");
		firstName = this.checkName(firstName, "First Name");
		lastName = this.checkName(lastName, "Last Name");
		email = this.checkEmail(email);
		livingAccommodations = this.checkString(
			livingAccommodations,
			"Living Accommodations"
		);
		reasoningExperience = this.checkString(
			reasoningExperience,
			"Reasoning and Experience"
		);
		livingAccommodations = livingAccommodations.toLowerCase();
		if (
			livingAccommodations != "home" &&
			livingAccommodations != "apartment" &&
			livingAccommodations != "townhouse" &&
			livingAccommodations != "other"
		) {
			throw `Error: Living accommodation isn't valid`;
		}
		//checking childrenInput, animalsInput and yard
		// children = this.checkString(children, "Children");
		// animals = this.checkString(animals, "Animals");
		// yard = this.checkString(yard, "Yard");

		if (
			children != "0" &&
			children != "1" &&
			children != "2" &&
			children != "3" &&
			children != "more than 3"
		)
			throw `invalid value for children`;
		// if (animals != "0" && animals != "1" && animals != "2" && animals != "3" && animals != "4") throw `invalid value for animals`;
		if (yard != "yes" && yard != "no") throw `invalid value for yard`;

		let newApp = {
			firstName,
			lastName,
			age,
			email,
			phone,
			livingAccommodations,
			children,
			timeAlone,
			animals,
			yard,
			reasoningExperience,
		};
		return newApp;
	},

	checkPassword(password) {
		if (/\s/.test(password)) throw `Error: Invalid Password given`;
		if (!/(?=.*\d)(?=.*[A-Z])(?=.*\W)/.test(password))
			throw `Error: Invalid Password given`;
		if (password.length < 8) throw `Error: Invalid Password given`;
		return password;
	},
};

export default exportedMethods;
