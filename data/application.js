import { users, dogs } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as user from "./users.js";
import * as dog from "./dogs.js";
import validation from "../validation.js";

const create = async (
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
) => {
	userId = validation.checkId(userId, "User ID");
	//checking booleans
	children = validation.checkBool(children, "Children Boolean");
	animals = validation.checkBool(animals, "Animals Boolean");

	//checking numbers
	age = validation.checkAge(age);
	phone = validation.checkNum(phone, "Phone Number");
	timeAlone = validation.checkNum(timeAlone, "Time Alone");
	if (phone.toString().length != 10) throw `Invalid phone number`;
	if (timeAlone < 0 || timeAlone > 24)
		throw `Time alone must be between 0 and 24 hours`;

	//checking strings
	firstName = validation.checkString(firstName, "First Name");
	lastName = validation.checkString(lastName, "Last Name");
	email = validation.checkEmail(email);
	livingAccommodations = validation.checkString(
		livingAccommodations,
		"Living Accommodations"
	);
	reasoningExperience = validation.checkString(
		reasoningExperience,
		"Reasoning and Experience"
	);
	firstName = validation.nameChecker(firstName);
	lastName = validation.nameChecker(lastName);

	livingAccommodations = livingAccommodations.toLowerCase();
	if (
		livingAccommodations != "home" &&
		livingAccommodations != "apartment" &&
		livingAccommodations != "townhouse" &&
		livingAccommodations != "other"
	) {
		throw `Living accommodation isn't valid`;
	}

	//checking arrays
	childrenAges = validation.checkNumArray(childrenAges, "Children Ages");
	typeAnimals = validation.checkStringArray(typeAnimals, "Types of Animals", 0);
	yard = validation.checkStringArray(yard, "Yard", 0);
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
	newApp._id = new ObjectId();

	let userCollection = await users();
	let result = await user.get(userId);
	const userWithApp = {
		firstName: result.firstName,
		lastName: result.lastName,
		age: result.age,
		email: result.email,
		password: result.password,
		dogs: result.dogs,
		quizResult: result.quizResult,
		application: newApp,
		accepted: result.accepted,
		pending: result.pending,
		rejected: result.rejected,
		liked: result.liked,
		disliked: result.disliked,
	};

	const updated = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(userId) },
		{ $set: userWithApp },
		{ returnDocument: "after" }
	);
	if (updated.lastErrorObject.n === 0) throw `Application could not be updated`;
	return newApp;
};

const get = async (id) => {
	//id = validation.checkId(id, "Dog ID");
	if (!ObjectId.isValid(id)) throw `User ID isn't valid`;
	const userCollection = await user();
	const userObj = await userCollection.findOne({ _id: new ObjectId(id) });
	if (userObj === null) {
		throw "There is no application with this id";
	}

	let app = userObj.application;
	return app;
};

const sending = async (appID, dogID) => {
	//this will send the application to the user
	appID = validation.checkId(appID, "Application ID");
	dogID = validation.checkId(dogID, "Dog ID");

	const dogCollection = await dogs();
	const currInterest = await dog.get(dogID);
	const app = await get(dogID);

	if (currInterest.interest.contains(appID))
		throw `You already applied for this dog`;

	const updated = await dogCollection.findOneAndUpdate(
		{ _id: new ObjectId(dogID) },
		{ $push: { interest: app } },
		{ returnDocument: "after" }
	);
	if (updated.lastErrorObject.n === 0) throw `Application could not be updated`;
	return `${appID} is now interested`;
};

export { create, get, sending };
