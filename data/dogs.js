import { dogs } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from 'mongodb';
import validation from '../validation.js';
import formidable from 'formidable';
import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand, S3Client} from '@aws-sdk/client-s3';
import { Transform } from 'stream';
import * as dotenv from 'dotenv';

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

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
		pictures = validation.checkPicArray(pictures, 1);
		userId = validation.checkId(userId, "User ID");

		const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(userId)});
        if (myUser === null) throw 'Error: No user with that ID';

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
		myUser.dogs.push(newId);

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
            disliked: myUser.disliked
        };
		const updatedInfo = await userCollection.findOneAndReplace(
            {_id: new ObjectId(userId)},
            updatedUser,
            {returnDocument: 'after'}
        );
        if (updatedInfo.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${userId}`];

		const myDog = await this.getDogById(newId);
		myDog._id = myDog._id.toString();
		return myDog;
	},

	async updateDog(
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
		dogId
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
		pictures = validation.checkPicArray(pictures, 1);
		dogId = validation.checkId(dogId, "Dog ID");

		const dogCollection = await dogs();
		const myDog = await dogCollection.findOne({_id: new ObjectId(dogId)});
		if(myDog === null) {
			throw 'Error: No dog with that ID';
		};

		const allDogs = await this.getAllDogs();
		for(let i = 0; i < allDogs.length; i++){
			if(allDogs[i].name === name && allDogs[i].sex === sex && allDogs[i].age === age && allDogs[i].color === color 
			&& allDogs[i].breeds === breeds && allDogs[i].weight === weight && allDogs[i].description === description
			&& validation.checkArraysEqual(allDogs[i].traits, traits)
			&& validation.checkArraysEqual(allDogs[i].medicalInfo, medicalInfo)
			&& validation.checkArraysEqual(allDogs[i].vaccines, vaccines)){
				throw `A dog like this already exists!`
			}
		}

		let updatedDog = {
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
			userId: myDog.userId,
			interest: myDog.interest,
			adopted: myDog.adopted,
			likes: myDog.likes,
			comments: myDog.comments
		};

		const updatedInfo = await dogCollection.findOneAndReplace(
            {_id: new ObjectId(dogId)},
            updatedDog,
            {returnDocument: 'after'}
        );
        if (updatedInfo.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${dogId}`];
		const dog = await this.getDogById(dogId);
		dog._id = dog._id.toString();
		return dog;
	},

	async getDogById(id) {
		id = validation.checkId(id, "Dog ID");
		const dogCollection = await dogs();
		const myDog = await dogCollection.findOne({_id: new ObjectId(id)});
		if(myDog === null) {
			throw 'Error: No dog with that ID';
		};
		myDog._id = myDog._id.toString();
		return myDog;
	},

	async addLike(dogId, userId) {
		dogId = validation.checkId(dogId, "Dog ID");
		userId = validation.checkId(userId, "User ID");
		const dogCollection = await dogs();
		const myDog = await dogCollection.findOne({_id: new ObjectId(dogId)});
		if(myDog === null) {
			throw 'Error: No dog with that ID';
		};

		const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(userId)});
        if (myUser === null) throw 'Error: No user with that ID';
		
		for (let i in myUser.liked) {
			if (myUser.liked[i] === dogId) throw `Error: Cannot like the same dog twice`;
		}
		let updatedDog = {
			name: myDog.name,
			sex: myDog.sex,
			age: myDog.age,
			color: myDog.color,
			breeds: myDog.breeds,
			weight: myDog.weight,
			description: myDog.description,
			traits: myDog.traits,
			medicalInfo: myDog.medicalInfo,
			vaccines: myDog.vaccines,
			pictures: myDog.pictures,
			userId: myDog.userId,
			interest: myDog.interest,
			adopted: myDog.adopted,
			likes: myDog.likes + 1,
			comments: myDog.comments
		};
		const updatedInfoDog = await dogCollection.findOneAndReplace(
            {_id: new ObjectId(dogId)},
            updatedDog,
            {returnDocument: 'after'}
        );
        if (updatedInfoDog.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${dogId}`];
		myUser.liked.push(dogId);
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
            disliked: myUser.disliked
        };
		const updatedInfoUser = await userCollection.findOneAndReplace(
            {_id: new ObjectId(userId)},
            updatedUser,
            {returnDocument: 'after'}
        );
        if (updatedInfoUser.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${userId}`];

		return `${myDog.name} has been successfully liked!`;;
	},
	
	async addComment(dogId, userId, newComment) {
		dogId = validation.checkId(dogId, "Dog ID");
		userId = validation.checkId(userId, "User ID");
		const dogCollection = await dogs();
	
		const myDog = await dogCollection.findOne({_id: new ObjectId(dogId)});
		if(myDog === null) {
			throw 'Error: No dog with that ID';
		};
		const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(userId)});
        if (myUser === null) throw 'Error: No user with that ID';
		newComment = newComment.trim();
		if(newComment === "") throw `comment cannot be empty`;
		newComment = `${myUser.firstName} ${myUser.lastName}: ${newComment}`;

		(myDog.comments).push(newComment);
		let updatedDog = {
	
			name: myDog.name,
			sex: myDog.sex,
			age: myDog.age,
			color: myDog.color,
			breeds: myDog.breeds,
			weight: myDog.weight,
			description: myDog.description,
			traits: myDog.traits,
			medicalInfo: myDog.medicalInfo,
			vaccines: myDog.vaccines,
			pictures: myDog.pictures,
			userId: myDog.userId,
			interest: myDog.interest,
			adopted: myDog.adopted,
			likes: myDog.likes,
			comments: myDog.comments
		};
		const updatedInfoDog = await dogCollection.findOneAndReplace(
            {_id: new ObjectId(dogId)},
            updatedDog,
            {returnDocument: 'after'}
        );
        if (updatedInfoDog.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${dogId}`];
		// return `You have successfully commented on ${myDog.name}'s post!'`;;
		return newComment;
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
		const myDog = await this.getDogById(id);
		myDog.pictures = validation.checkPicArray(myDog.pictures, 0);
		for (let i in myDog.pictures) {
			let deletedPhoto = await this.deletePhoto(myDog.pictures[i].key);
		}

		const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(myDog.userId)});
        if (myUser === null) throw 'Error: No user with that ID';
		let removeDogId = myUser.dogs.filter(e => e !== id);

		const updatedUser = {
            firstName: myUser.firstName,
            lastName: myUser.lastName,
            age: myUser.age,
            email: myUser.email,
            password: myUser.password,
            dogs: removeDogId,
            quizResult: myUser.quizResult,
            application: myUser.application,
            accepted: myUser.accepted,
            pending: myUser.pending,
            rejected: myUser.rejected,
            liked: myUser.liked,
            disliked: myUser.disliked
        };
		const updatedInfoUser = await userCollection.findOneAndReplace(
            {_id: new ObjectId(myDog.userId)},
            updatedUser,
            {returnDocument: 'after'}
        );
        if (updatedInfoUser.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${myDog.userId}`];


		const dogCollection = await dogs();
		const deletedDog = await dogCollection.findOneAndDelete({_id: new ObjectId(id)});
		if(deletedDog.lastErrorObject.n === 0) {
			throw `Error: Deletion of dog with id ${id} was unsuccessful`;
		};
		return `${deletedDog.value.name} has been successfully deleted!`;
	},

	async getMyDogs(id){
		id = validation.checkId(id, "User ID");
		const userCollection = await users();
		const dogCollection = await dogs();
		const myUser = await userCollection.findOne({_id: new ObjectId(id)});
		if (myUser === null) throw 'Error: No user with that ID';
		let myDogIDs = myUser.dogs;
		let myDogsArr = [];
		for (let i = 0; i < myDogIDs.length; i++){
			let curDogID = myDogIDs[i];
			const curDog = await dogCollection.findOne({_id: new ObjectId(curDogID)});
			myDogsArr.push(curDog);
		}
		return myDogsArr;
	},

	async deletePhoto(key) {
		const client = new S3Client({redentials: {
			accessKeyId,
			secretAccessKey
		},
		region});

		const command = new DeleteObjectCommand({
			Bucket: Bucket,
			Key: key,
			});
			try {
				const response = await client.send(command);
				return `${key} has been successfully deleted!`;
			} catch (err) {
				console.log(err);
				return;
			}
	},


	async caption(dogId){
		dogId = validation.checkId(dogId, "Dog ID");
		const dog = await getDogById(id);
		return `A ${dog.color[0]} ${dog.breed[0]} named ${dog.name}`;
	},

	// Citation: https://www.freecodecamp.org/news/how-to-upload-files-to-aws-s3-with-node/
	async uploadPhoto(req) {
		return new Promise((resolve, reject) => {
			let photos = [];
			let numPhotos = 0;
			let options = {
				maxFileSize: 100 * 1024 * 1024,
				allowEmptyFiles: false
			}
	
			const form = formidable(options);
			form.parse(req, (err, fields, files) => {
				photos.push(fields);
				numPhotos = parseInt(photos[0]["numPhotos"]);
				if (!files) {
					resolve(photos);
				}
			});
	
			form.on('error', error => {
				reject(error.message)
			})
	
			form.on('data', data => {
				if (data.name === "complete") {
					photos.push({url: data.value.Location, key: data.value.Key})
					numPhotos--
					if (numPhotos === 0){
						resolve(photos);
					}
				}
			})
	
			form.on('fileBegin', (formName, file) => {
	
				file.open = async function () {
					this._writeStream = new Transform({
						transform(chunk, encoding, callback) {
							callback(null, chunk)
						}
					})
	
					this._writeStream.on('error', e => {
						form.emit('error', e)
					});
	
					// Upload to S3
					new Upload({
						client: new S3Client({
							credentials: {
								accessKeyId,
								secretAccessKey
							},
							region
						}),
						params: {
							ACL: 'public-read',
							Bucket,
							Key: `${Date.now().toString()}-${this.originalFilename}`,
							Body: this._writeStream
						},
						tags: [], // Optional tags
						queueSize: 4, // Optional concurrency configuration
						partSize: 1024 * 1024 * 5, // Optional size of each part, in bytes, at least 5MB
						leavePartsOnError: false, // Optional manually handle dropped parts
					})
						.done()
						.then(data => {
							form.emit('data', { name: "complete", value: data });
						}).catch((err) => {
							form.emit('error', err);
						})
				}
	
				file.end = function (cb) {
					this._writeStream.on('finish', () => {
						this.emit('end')
						cb()
					})
					this._writeStream.end()
				}
			})
		})
	}
}

export default exportedMethods;
