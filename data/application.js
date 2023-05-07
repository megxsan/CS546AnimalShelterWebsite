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
		timeAlone,
		animals,
		yard,
		reasoningExperience
	) {
		let newApp = validation.checkAppInputs(
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
		);
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
		if (updated.lastErrorObject.n === 0)
			throw `Error: Application could not be updated`;
		return newApp;
	},

	async getApp(id) {
		id = validation.checkId(id, "User ID");
		const userCollection = await users();
		const myUser = await userCollection.findOne({ _id: new ObjectId(id) });
		if (myUser === null) {
			throw "Error: There is no user with this id";
		}
		let app = myUser.application;
		// if (myUser.application.keys() === 0) {
		// 	throw "Error: There is application associated with this user";
		// }
		return app;
	},

	async updateApp(
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
		let checked = validation.checkAppInputs(
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
		);

		let result = await get(userId);
		//at least 1 thing needs to be updated, else throw an error
		if (
			result.firstName === checked.firstName &&
			result.lastName === checked.lastName &&
			result.age === checked.age &&
			result.email === checked.email &&
			result.phone === checked.phone &&
			result.livingAccommodations === checked.livingAccommodations &&
			result.children === checked.children &&
			result.childrenAges === checked.childrenAges &&
			result.timeAlone === checked.timeAlone &&
			result.animals === checked.animals &&
			result.typeAnimals === checked.typeAnimals &&
			result.yard === checked.yard &&
			result.reasoningExperience === checked.reasoningExperience
		) {
			throw `At least 1 input needs to be different than the original band when you update`;
		}
		const update = {
			userId,
			firstName: checked.firstName,
			lastName: checked.lastName,
			age: checked.age,
			email: checked.email,
			phone: checked.phone,
			livingAccommodations: checked.livingAccommodations,
			children: checked.children,
			childrenAges: checked.childrenAges,
			timeAlone: checked.timeAlone,
			animals: checked,
			animals,
			typeAnimals: checked.typeAnimals,
			yard: checked.yard,
			reasoningExperience: checked.reasoningExperience,
		};
		//find the user and update it; throw error if this doesn't happen
		const userCollection = await users();
		const updatedUser = await userCollection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: update },
			{ returnDocument: "after" }
		);
		if (updatedUser.lastErrorObject.n === 0)
			throw `Application could not be updated`;
		updatedUser.value._id = updatedUser.value._id.toString();

		//returns the updated user
		return updatedUser.value;
	},

	async sendApp(appID, dogID, userID) {
		// This will send the application to the user
		appID = validation.checkId(appID, "Application ID");
		dogID = validation.checkId(dogID, "Dog ID");
		userID = validation.checkId(userID, "User ID");

		const dogCollection = await dogs();
		const currInterest = await dog.getDogById(dogID);
		const app = await this.getApp(userID);

		const userCollection = await users();
		// const user = await userCollection.getUserById(userID);

		for (let i = 0; i < currInterest.interest.length; i++) {
			if (currInterest.interest[i]._id === appID) {
				throw `You already applied for this dog`;
			}
		}
    
		// if (currInterest.interest.contains(app))
		// 	throw `Error: You already applied for this dog`;
		const updateUser = await userCollection.findOneAndUpdate(
			{ _id: new ObjectId(userID) },
			{ $push: { pending: dogID } },
			{ returnDocument: "after" }
		);
		if (updateUser.lastErrorObject.n === 0)
			throw `Error: User could not be updated`;
		const updated = await dogCollection.findOneAndUpdate(
			{ _id: new ObjectId(dogID) },
			{ $push: { interest: app } },
			{ returnDocument: "after" }
		);
		if (updated.lastErrorObject.n === 0)
			throw `Error: Application could not be updated`;
		return `${appID} is now interested`;
	},
	async appStatus(appID, dogID, userID, status) {
		//error checking
		appID = validation.checkId(appID, "Application ID");
		dogID = validation.checkId(dogID, "Dog ID");
		status = validation.checkString(status, "Application Status");
		status = status.toLowerCase();
		if (status != "rejected" && status != "pending" && status != "accepted")
			throw `Status can only be rejected, pending, or accepted.`;

		let application = await this.getApp(userID);
		let userId = application.userId;
		let userInfo = await user.getUserById(userId);

		let dogCollection = await dogs();
		const userCollection = await users();
		let updated = {};

		if (status === "pending") {
			// await userData.updatedUser(userInfo.id, userInfo.firstName, userInfo.lastName, userInfo.age, userInfo.email, userInfo.password);
			updated = await userCollection.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $push: { pending: dogID } },
				{ returnDocument: "after" }
			);
			if (updated.lastErrorObject.n === 0)
				throw `Error: Pending could not be updated`;
		} else if (status === "accepted") {

			let updatedPending = (userInfo.pending).filter(e => e != dogID);
			updated = await userCollection.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $push: { accepted: dogID } },
				{ returnDocument: "after" }
			);
			if (updated.lastErrorObject.n === 0)
				throw `Error: Pending could not be updated`;
			updated = await userCollection.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $set: { pending: updatedPending } },
				{ returnDocument: "after" }
			);
			if (updated.lastErrorObject.n === 0)
				throw `Error: Pending could not be updated`;
		} else {
			let updatedPending = (userInfo.pending).filter(e => e != dogID);

			updated = await userCollection.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $push: { rejected: dogID } },
				{ returnDocument: "after" }
			);
			if (updated.lastErrorObject.n === 0)
				throw `Error: Pending could not be updated`;

			updated = await userCollection.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $set: { pending: updatedPending } },
				{ returnDocument: "after" }
			);
			if (updated.lastErrorObject.n === 0)
				throw `Error: Pending could not be updated`;

			let dogInfo = await dog.getDogById(dogID);

			let updatedInterest = (dogInfo.interest).filter(e => e._id.toString() != appID);

			let updatedDog = await dogCollection.findOneAndUpdate(
				{ _id: new ObjectId(dogID) },
				{ $set: { interest: updatedInterest } },
				{ returnDocument: "after" }
			);
			if(updatedDog.lastErrorObject.n === 0) throw `interest cannot be updated`

			//now I need to update the dog array for the user that posted the dog
			let userWithDog = await user.getUserById(dogInfo.userId);
			let updatedDogArray = (userWithDog.dogs).filter(e => e != dogID);
			updatedDogArray.push(updatedDog._id);
			let updatedUserWithDog = await userCollection.findOneAndUpdate(
				{ _id: new ObjectId(dogInfo.userId) },
				{ $set: { dog: updatedDogArray } },
				{ returnDocument: "after" }
			);
			if(updatedUserWithDog.lastErrorObject.n === 0) throw `dog array cannot be updated`

		}
		return updated;
	},
};

export default exportedMethods;
