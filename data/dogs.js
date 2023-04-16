import { dogs } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import validation from '../validation.js';

const exportedMethods = {
	async addDog(
		name,
		sex,
		age,
		color,
		breeds,
		weight,
		description,
		traits,
		medicalInfo,
		vaccines,
		pictures,
		userId
	) {
		name = validation.checkString(name, "Name");
		name = validation.checkName(name, "Name");
		sex = validation.checkSex(sex, "Sex");
		age = validation.checkDogAge(age, "Age");
		color = validation.checkStringArray(color, "Color", 1);
		breeds = validation.checkStringArray(breeds, "Breeds", 1);
		weight = validation.checkWeight(weight, "Weight");
		description = validation.checkString(description, "Description");
		traits = validation.checkStringArray(traits, "Traits", 0);
		medicalInfo = validation.checkStringArray(medicalInfo, "Medical Info", 0);
		vaccines = validation.checkStringArray(vaccines, "Vaccines", 0);
		pictures = validation.checkStringArray(pictures, "Pictures", 0); //NEEDS TO BE PROPERLY VALIDATED
		userId = validation.checkId(userId, "User ID");
		let newDog = {
			name: name,
			sex: sex,
			age: age,
			color: color,
			breeds: breeds,
			weight: weight,
			description: description,
			traits: traits,
			medicalInfo: medicalInfo,
			vaccines: vaccines,
			pictures: pictures,
			userId: userId,
			interest: [],
			adopted: false,
			likes: 0,
			comments: []
		};
		const dogCollection = await dogs();
		const insertInfo = await dogCollection.insertOne(newDog);
		if (!insertInfo.acknowledged || !insertInfo.insertedId)  {
			throw "Error: Could not add dog";
		};
		const newId = insertInfo.insertedId.toString();
		const dog = await this.getDogById(newId);
		return dog;
	},
	async getDogById(id) {
		id = validation.checkId(id, "Dog ID");
		const dogCollection = await dogs();
		const MyDog = await dogCollection.findOne({_id: new ObjectId(id)});
		if(MyDog === null) {
			throw 'Error: No dog with that ID';
		};
		MyDog._id = MyDog._id.toString();
		return MyDog;
	},
	
	async getAllDogs() {
		const dogCollection = await dogs();
		let dogList = await dogCollection.find({}).toArray();
		if (dogList === undefined){
			throw "Error: Could not get all dogs";
		};
		dogList = dogList.map((element) => {
			element._id = element._id.toString();
			return element;
		});
		return dogList;
	},

	async removeDog(id) {
		id = validation.checkId(id, "Dog ID");
		const dogCollection = await dogs();
		const deletedDog = await dogCollection.findOneAndDelete({_id: new ObjectId(id)});
		if(deletedDog.lastErrorObject.n === 0) {
			throw `Error: Deletion of dog with id ${id} was unsuccessful`;
		};
		return `${deletedDog.value.name} has been successfully deleted!`;
	}
}

export default exportedMethods;
