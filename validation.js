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
		return email;
		/* Do we want to use this email validator instead?
		var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if(!regEmail.test(email)) throw `Error: Invalid Email given`;
		return email;
		*/
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
		childrenAges,
		timeAlone,
		animals,
		typeAnimals,
		yard,
		reasoningExperience
	) {
		userId = this.checkId(userId, "User ID");
		// Checking booleans
		children = this.checkBool(children, "Children Boolean");
		animals = this.checkBool(animals, "Animals Boolean");

		// Checking numbers
		age = this.checkAge(age);
		phone = this.checkNum(phone, "Phone Number");
		timeAlone = this.checkNum(timeAlone, "Time Alone");
		if (phone.toString().length != 10) throw `Error: Invalid phone number`;
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

		// Checking arrays
		childrenAges = this.checkNumArray(childrenAges, "Children Ages");
		typeAnimals = this.checkStringArray(typeAnimals, "Types of Animals", 0);
		yard = this.checkStringArray(yard, "Yard", 0);
		for (let i = 0; i < childrenAges.length; i++) {
			if (childrenAges[i] < 0 || childrenAges[i] > 18)
				throw `Children age isn't valid`;
		}
		for (let i = 0; i < typeAnimals.length; i++) {
			typeAnimals[i] = typeAnimals[i].toLowerCase();
			if (
				typeAnimals[i] != "dog" &&
				typeAnimals[i] != "cat" &&
				typeAnimals[i] != "other"
			) {
				throw `Animal types not valid`;
			}
		}
		for (let i = 0; i < yard.length; i++) {
			yard[i] = yard[i].toLowerCase();
			if (
				yard[i] != "enclosed front yard" &&
				yard[i] != "enclosed back yard" &&
				yard[i] != "garage" &&
				yard[i] != "dog house" &&
				yard[i] != "other"
			) {
				throw `yard types not valid`;
			}
		}
		let newApp = {
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
		};
		return newApp;
	},

	checkPassword(password) {
		if((/\s/).test(password)) throw `Error: Invalid Password given`;
        if(!(/(?=.*\d)(?=.*[A-Z])(?=.*\W)/).test(password)) throw `Error: Invalid Password given`;
        if(password.length < 8) throw `Error: Invalid Password given`;		
		return password;
	},
};

export default exportedMethods;
