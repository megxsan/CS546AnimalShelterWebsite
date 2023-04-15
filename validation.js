import { ObjectId } from "mongodb";

const exportedMethods = {
	nameChecker(input) {
		//allowed ascii codes: 32, 45, 65-90, 97-122
		for (let i = 0; i < input.length; i++) {
			if (
				(input.charCodeAt(input[i]) != 32 ||
					input.charCodeAt(input[i]) != 45) &&
				!(
					input.charCodeAt(input[i]) >= 65 && input.charCodeAt(input[i]) <= 90
				) &&
				!(input.charCodeAt(input[i]) >= 97 && input.charCodeAt(input[i]) <= 122)
			) {
				throw `Invalid character present in name`;
			}
		}
		return input;
	},

	checkNum(num, varName) {
		if (!num) throw `You must provide a ${varName}`;
		if (typeof num != "number") throw `${varName} must be a number`;
		if (isNaN(num) === true) throw `${varName} must be a number`;
		if (num != Math.floor(num)) throw `${varName} cannot be a decimal`;
		return num;
	},

	checkBool(bool, varName) {
		if (!bool) throw `You must provide a ${varName}`;
		if (typeof bool != "boolean") throw `A boolean is required`;
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
			throw `You must provide an array of ${varName}`;
		if (arr.length < minLength)
			throw `${varName} must have at least ${minLength} element(s)`;
		for (let i in arr) {
			if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
				throw `One or more elements in ${varName} array is not a string or is an empty string`;
			}
			arr[i] = arr[i].trim();
		}
		return arr;
	},

	checkNumArray(arr, varName, minLength) {
		if (!arr || !Array.isArray(arr))
			throw `You must provide an array of ${varName}`;
		if (arr.length < minLength)
			throw `${varName} must have at least ${minLength} element(s)`;
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
		if (typeof num !== "number") throw "Age must be a number";
		if (!Number.isInteger(num)) throw "Age must be an integer";
		if (num < 18 || num > 120)
			throw "You are too young or have provided a fake age";
		return num;
	},

	checkEmail(email) {
		if (!email) throw "You must provide an email";
		if (typeof email !== "string") throw "Email must be a string";
		email = email.trim();
		if (email.length === 0) throw "Email must be more than an empty string";
		let at = email.indexOf("@");
		let end = email.indexOf(".");
		if (!(at < end)) throw `not a valid email`;
		if (at === -1 || end === -1) throw `not a valid email`;
		let emailEnd = email.slice(-4);
		if (
			emailEnd !== ".com" &&
			emailEnd !== ".net" &&
			emailEnd !== ".edu" &&
			emailEnd !== ".gov" &&
			emailEnd !== ".org"
		)
			throw "You must provide a valid email";
		return email;
	},
};

export default exportedMethods;
