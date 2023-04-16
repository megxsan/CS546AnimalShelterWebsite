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
		
		let newApp = validation.checkAppInputs(userId,
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
			reasoningExperience);
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

	async updateApp(userId,firstName,lastName,age,email,phone, livingAccommodations,
		children,childrenAges,timeAlone,animals,typeAnimals,yard,reasoningExperience){

		let checked = validation.checkAppInputs(userId,firstName,lastName,age,email,phone, livingAccommodations,
			children,childrenAges,timeAlone,animals,typeAnimals,yard,reasoningExperience);
			
		
		let result = await get(userId);
		//at least 1 thing needs to be updated, else throw an error
		if(result.firstName === checked.firstName && result.lastName === checked.lastName
			&& result.age === checked.age && result.email === checked.email && result.phone === checked.phone && result.livingAccommodations === checked.livingAccommodations
			&& result.children === checked.children && result.childrenAges === checked.childrenAges && result.timeAlone === checked.timeAlone &&
			result.animals === checked.animals && result.typeAnimals === checked.typeAnimals && result.yard === checked.yard && result.reasoningExperience === checked.reasoningExperience){
		  throw `At least 1 input needs to be different than the original band when you update`;
		}
		const update = {
			userId,
			firstName:checked.firstName,
			lastName:checked.lastName,
			age:checked.age,
			email:checked.email,
			phone:checked.phone,
			livingAccommodations:checked.livingAccommodations,
			children:checked.children,
			childrenAges:checked.childrenAges,
			timeAlone:checked.timeAlone,
			animals:checked,animals,
			typeAnimals:checked.typeAnimals,
			yard:checked.yard,
			reasoningExperience:checked.reasoningExperience
		}
		//find the user and update it; throw error if this doesn't happen
		const userCollection = await users();
		const updatedUser = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: update}, {returnDocument: "after"});
		if(updatedUser.lastErrorObject.n === 0) throw `Application could not be updated`;
		updatedUser.value._id = updatedUser.value._id.toString();
	  
		//returns the updated user
		return updatedUser.value;
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
