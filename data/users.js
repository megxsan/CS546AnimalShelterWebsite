import { users, dogs } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../validation.js";
import bcrypt from "bcrypt";

import * as app from "./application.js";
import { appData } from "./index.js";

const exportedMethods = {
	async addUser(firstName, lastName, age, email, password) {
		firstName = validation.checkString(firstName, "First Name");
		lastName = validation.checkString(lastName, "Last Name");
		firstName = validation.checkName(firstName, "First Name");
		lastName = validation.checkName(lastName, "Last Name");
		age = parseInt(age);
		age = validation.checkAge(age);
		email = validation.checkEmail(email);
		email = email.toLowerCase();
		password = validation.checkString(password, "Password");
		password = validation.checkPassword(password);
		const hash = await bcrypt.hash(password, 10);

		const userCollection = await users();
		const myUser = await userCollection.findOne({ email: email });
		if (myUser !== null) throw "Error: Email is already registered";

		let newUser = {
			firstName: firstName,
			lastName: lastName,
			age: age,
			email: email,
			password: hash,
			dogs: [],
			quizResult: [],
			application: {},
			accepted: [],
			pending: [],
			rejected: [],
			liked: [],
			disliked: [],
		};

		const insertInfo = await userCollection.insertOne(newUser);
		if (!insertInfo.acknowledged || !insertInfo.insertedId) {
			throw "Error: Could not add user";
		}
		const newId = insertInfo.insertedId.toString();
		const user = await this.getUserById(newId);
		return user;
	},

	async getUserById(id) {
		id = validation.checkId(id, "User ID");
		const userCollection = await users();
		const myUser = await userCollection.findOne({ _id: new ObjectId(id) });
		if (myUser === null) throw "Error: No user with that ID";
		myUser._id = myUser._id.toString();
		return myUser;
	},

	async updateUser(
		id,
		firstName,
		lastName,
		age,
		email,
		oldPassword,
		newPassword
	) {
		id = validation.checkId(id, "User ID");
		firstName = validation.checkString(firstName, "First Name");
		lastName = validation.checkString(lastName, "Last Name");
		firstName = validation.checkName(firstName, "First Name");
		lastName = validation.checkName(lastName, "Last Name");
		age = parseInt(age);
		age = validation.checkAge(age);
		email = validation.checkEmail(email);
		email = email.toLowerCase();
		oldPassword = validation.checkString(oldPassword, "Password");
		oldPassword = validation.checkPassword(oldPassword);
		newPassword = validation.checkString(newPassword, "Password");
		newPassword = validation.checkPassword(newPassword);

		const userCollection = await users();
		const myUser = await userCollection.findOne({ _id: new ObjectId(id) });
		if (myUser === null) throw "Error: No user with that ID";

		let comparePassword = await bcrypt.compare(oldPassword, myUser.password);
		if (
			myUser.firstName === firstName &&
			myUser.lastName === lastName &&
			myUser.age === age &&
			myUser.email === email &&
			myUser.oldPassword === newPassword
		) {
			throw `At least one input should be updated with this form`;
		}

		if (comparePassword == false) throw "Password is invalid";
		const hash = await bcrypt.hash(newPassword, 10);

		const updatedUser = {
			firstName: firstName,
			lastName: lastName,
			age: age,
			email: email,
			password: hash,
			dogs: myUser.dogs,
			quizResult: myUser.quizResult,
			application: myUser.application,
			accepted: myUser.accepted,
			pending: myUser.pending,
			rejected: myUser.rejected,
			liked: myUser.liked,
			disliked: myUser.disliked,
		};

		const updatedInfo = await userCollection.findOneAndReplace(
			{ _id: new ObjectId(id) },
			updatedUser,
			{ returnDocument: "after" }
		);
		if (updatedInfo.lastErrorObject.n === 0)
			throw [404, `Error: Update failed! Could not update post with id ${id}`];
		updatedInfo.value._id = updatedInfo.value._id.toString();
		return updatedInfo.value;
	},

	async getUserByEmail(email) {
		email = validation.checkEmail(email, "Email");
		const userCollection = await users();
		const myUser = await userCollection.findOne({ email: email });
		if (myUser === null) throw "No user with that email";
		myUser._id = myUser._id.toString();
		return myUser;
	},

	async getUserByEmailSettings(email) {
		email = validation.checkEmail(email, "Email");
		const userCollection = await users();
		const myUser = await userCollection.findOne({ email: email });
		if (myUser === null) return "no";
		myUser._id = myUser._id.toString();
		return myUser;
	},

	async checkUser(email, password) {
		password = validation.checkString(password, "Password");
		password = validation.checkPassword(password);

		email = email.toLowerCase();
		email = validation.checkString(email, "Email");
		email = validation.checkEmail(email);
		const userCollection = await users();
		const myUser = await userCollection.findOne({ email: email });
		if (myUser === null)
			throw "Either the email address or password is invalid";

		let comparePassword = await bcrypt.compare(password, myUser.password);
		if (comparePassword == false)
			throw "Either the email address or password is invalid";

		myUser._id = myUser._id.toString();
		return myUser;
	},

	async sendStatus(appId, dogId, status) {
		status = validation.checkString(status, "Status");
		if (status != "accepted" && status != "rejected") throw `invalid status`;

		appId = validation.checkId(appId, "Application ID");
		dogId = validation.checkId(dogId, "Application ID");
		const app = await app.getApp(appId);

		let userId = app.userId;
		let userCollection = await users();
		let foundUser = this.getUserById(userId);

		let user = {};
		if (status === "accepted") {
			user = {
				firstName: foundUser.firstName,
				lastName: foundUser.lastName,
				age: foundUser.age,
				email: foundUser.email,
				password: foundUser.hash,
				dogs: foundUser.dogs,
				quizResult: foundUser.quizResult,
				application: foundUser.application,
				accepted: foundUser.accepted.push(dogId),
				pending: foundUser.pending.filter(dogId),
				rejected: foundUser.rejected,
				liked: foundUser.liked,
				disliked: foundUser.disliked,
			};
		} else {
			user = {
				firstName: foundUser.firstName,
				lastName: foundUser.lastName,
				age: foundUser.age,
				email: foundUser.email,
				password: foundUser.hash,
				dogs: foundUser.dogs,
				quizResult: foundUser.quizResult,
				application: foundUser.application,
				accepted: foundUser.accepted,
				pending: foundUser.pending.filter(dogId),
				rejected: foundUser.rejected.push(dogId),
				liked: foundUser.liked,
				disliked: foundUser.disliked,
			};
		}
		const updatedUser = await userCollection.findOneAndReplace(
			{ _id: new ObjectId(userId) },
			updatedUser,
			{ returnDocument: "after" }
		);
		if (updatedUser.lastErrorObject.n === 0)
			throw [404, `Error: Update failed! Could not update application status`];

		return `Application for ${appId} has been ${status}.`;
	},

	async addIgnoredDog(dogId, userId) {
		dogId = validation.checkId(dogId, "Dog ID");
		userId = validation.checkId(userId, "User ID");
		const dogCollection = await dogs();
		const myDog = await dogCollection.findOne({ _id: new ObjectId(dogId) });
		if (myDog === null) {
			throw "Error: No dog with that ID";
		}

		const userCollection = await users();
		const myUser = await userCollection.findOne({ _id: new ObjectId(userId) });
		if (myUser === null) {
			throw "Error: No user with that ID";
		}

		myUser.disliked.forEach((element) => {
			if (element === dogId) {
				throw `Error: Cannot ignore the same dog twice`;
			}
		});

		let dislikedArr = myUser.disliked;
		dislikedArr.push(dogId);

		const updatedUser = {
			firstName: myUser.firstName,
			lastName: myUser.lastName,
			age: myUser.age,
			email: myUser.email,
			password: myUser.password,
			dogs: myUser.dogs,
			quizResult: myUser.quizResult,
			application: myUser.application,
			accepted: myUser.accepted,
			pending: myUser.pending,
			rejected: myUser.rejected,
			liked: myUser.liked,
			disliked: dislikedArr,
		};
		const updatedInfoUser = await userCollection.findOneAndReplace(
			{ _id: new ObjectId(userId) },
			updatedUser,
			{ returnDocument: "after" }
		);
		if (updatedInfoUser.lastErrorObject.n === 0)
			throw [
				404,
				`Error: Update failed! Could not update post with id ${userId}`,
			];

		return `${myDog.name} has been successfully ignored!`;
	},

	async getAllUsers() {
		const userCollection = await users();
		let userList = await userCollection.find().toArray();
		if(userList === undefined){
			throw "Error: Could not get all dogs"
		}
		return userList
	},
	
	async removeIgnoredDog(dogId, userId) {
		dogId = validation.checkId(dogId, "Dog ID");
		userId = validation.checkId(userId, "User ID");
		const dogCollection = await dogs();
		const myDog = await dogCollection.findOne({ _id: new ObjectId(dogId) });
		if (myDog === null) {
			throw "Error: No dog with that ID";
		}

		const userCollection = await users();
		const myUser = await userCollection.findOne({ _id: new ObjectId(userId) });
		if (myUser === null) {
			throw "Error: No user with that ID";
		}

		let flag = false;
		myUser.disliked.forEach((element) => {
			if (element === dogId) {
				flag = true;
			}
		});
		if (flag === false) {
			throw "Error: Cannot unignore a dog that has not been ignored";
		}

		let dislikedArr = [];
		myUser.disliked.forEach((element) => {
			if (element !== dogId) {
				dislikedArr.push(element);
			}
		});

		const updatedUser = {
			firstName: myUser.firstName,
			lastName: myUser.lastName,
			age: myUser.age,
			email: myUser.email,
			password: myUser.password,
			dogs: myUser.dogs,
			quizResult: myUser.quizResult,
			application: myUser.application,
			accepted: myUser.accepted,
			pending: myUser.pending,
			rejected: myUser.rejected,
			liked: myUser.liked,
			disliked: dislikedArr,
		};
		const updatedInfoUser = await userCollection.findOneAndReplace(
			{ _id: new ObjectId(userId) },
			updatedUser,
			{ returnDocument: "after" }
		);
		if (updatedInfoUser.lastErrorObject.n === 0)
			throw [
				404,
				`Error: Update failed! Could not update post with id ${userId}`,
			];

		return `${myDog.name} has been successfully unignored!`;
	},
};

export default exportedMethods;
