import { users, dogs } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import user from "./users.js";
import dog from "./dogs.js";
import validation from "../validation.js";

const exportedMethods = {
	async addApp(
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
		userId = validation.checkId(userId, "User ID");
		// Checking booleans
		children = validation.checkBool(children, "Children Boolean");
		animals = validation.checkBool(animals, "Animals Boolean");
	
		// Checking numbers
		age = validation.checkAge(age);
		phone = validation.checkNum(phone, "Phone Number");
		timeAlone = validation.checkNum(timeAlone, "Time Alone");
		if (phone.toString().length != 10) throw `Error: Invalid phone number`;
		if (timeAlone < 0 || timeAlone > 24)
			throw `Error: Time alone must be between 0 and 24 hours`;
	
		// Checking strings
		firstName = validation.checkString(firstName, "First Name");
		lastName = validation.checkString(lastName, "Last Name");
		firstName = validation.checkName(firstName, "First Name");
		lastName = validation.checkName(lastName, "Last Name");
		email = validation.checkEmail(email);
		livingAccommodations = validation.checkString(
			livingAccommodations,
			"Living Accommodations"
		);
		reasoningExperience = validation.checkString(
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
		let result = await user.getUserById(userId);
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
		if (updated.lastErrorObject.n === 0) throw `Error: Application could not be updated`;
		return newApp;
	},

	async getApp(id) {
		id = validation.checkId(id, "User ID");
		const userCollection = await user();
		const myUser = await userCollection.findOne({ _id: new ObjectId(id) });
		if (myUser === null) {
			throw "Error: There is no user with this id";
		}
		let app = userObj.application;
		if (userObj.application.keys() === 0) {
			throw "Error: There is application associated with this user";
		}
		return app;
	},

	async sendApp(appID, dogID) {
		// This will send the application to the user
		appID = validation.checkId(appID, "Application ID");
		dogID = validation.checkId(dogID, "Dog ID");
	
		const dogCollection = await dogs();
		const currInterest = await dog.getDogById(dogID);
		const app = await this.getApp(appID);
	
		if (currInterest.interest.contains(appID))
			throw `Error: You already applied for this dog`;
	
		const updated = await dogCollection.findOneAndUpdate(
			{ _id: new ObjectId(dogID) },
			{ $push: { interest: app } },
			{ returnDocument: "after" }
		);
		if (updated.lastErrorObject.n === 0) throw `Error: Application could not be updated`;
		return `${appID} is now interested`;
	}
}

export default exportedMethods;
