import dogs from "./data/dogs.js";
import users from "./data/users.js";
import apps from "./data/application.js";

import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const db = await dbConnection();

let tobi = undefined;
let buddy = undefined;
let kika = undefined;

let person = undefined;
let personID = undefined;

try {
	// Add User
	person = await users.addUser(
		"Patrick",
		"Hill",
		80,
		"phill@stevens.edu",
		"patty"
	);
	personID = person._id.toString();
} catch (e) {
	console.log(e);
}

try {
	// Add Application
	await apps.addApp(
		personID,
		"Patrick",
		"Hill",
		80,
		"phill@stevens.edu",
		1234567890,
		"home",
		true,
		[15],
		15,
		true,
		["Cat"],
		["enclosed back yard"],
		"I really want one"
	);
} catch (e) {
	console.log(e);
}

try {
	//Test 1
	tobi = await dogs.addDog(
		"Tobias",
		"male",
		8,
		["Light Brown", "Grey", "Black"],
		["Yorkshire Terrier"],
		13.5,
		"The cutest little doggy you will ever meet.  He is super friendly and loves people, even babies!  He is a bit territorial when it comes to letting other animals in his house, but is otherwise friendly to other animals outside of the house",
		["Playful", "Adorable", "Small", "Friendly"],
		[],
		["Rabies"],
		[],
		"641fc2896a56dea7f4f2d780"
	);
} catch (e) {
	console.log(e);
}

try {
	//Test 2
	kika = await dogs.addDog(
		"Kika",
		"female",
		16,
		["Gold"],
		["Pomeranian"],
		12,
		"Cute and angry",
		["Lazy", "Adorable", "Small", "Chonky"],
		["Diabetes"],
		["Rabies"],
		[],
		"641fc2896a56dea7f4f2d780"
	);
} catch (e) {
	console.log(e);
}

try {
	//Test 3
	console.log(await dogs.getDogById(tobi._id));
} catch (e) {
	console.log(e);
}

try {
	//Test 3
	console.log(await dogs.getAllDogs());
} catch (e) {
	console.log(e);
}

try {
	//Test 4
	console.log(await dogs.removeDog(kika._id));
} catch (e) {
	console.log(e);
}

try {
	//Test 5
	console.log(await dogs.getAllDogs());
} catch (e) {
	console.log(e);
}

await closeConnection();
