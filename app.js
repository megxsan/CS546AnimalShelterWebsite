import * as dogs from './data/dogs.js';
import {dbConnection, closeConnection} from './config/mongoConnection.js';

const db = await dbConnection();
// await db.dropDatabase();

let tobi = undefined;
let buddy = undefined;
let kika = undefined;

try { //Test 1
    tobi = await dogs.create("Tobias", "male", 8, ["Light Brown", "Grey", "Black"], ["Yorkshire Terrier"], 13.5, "The cutest little doggy you will ever meet.  He is super friendly and loves people, even babies!  He is a bit territorial when it comes to letting other animals in his house, but is otherwise friendly to other animals outside of the house", ["Playful", "Adorable", "Small", "Friendly"], [], ["Rabies"], [], "641fc2896a56dea7f4f2d780");
} catch (e) {
    console.log(e);
}

try { //Test 2
    kika = await dogs.create("Kika", "female", 16, ["Gold"], ["Pomeranian"], 12, "Cute and angry", ["Lazy", "Adorable", "Small", "Chonky"], ["Diabetes"], ["Rabies"], [], "641fc2896a56dea7f4f2d780");
} catch (e) {
    console.log(e);
}

try { //Test 3
    console.log(await dogs.get(tobi._id));
} catch (e) {
    console.log(e);
}

try { //Test 3
    console.log(await dogs.getAll());
} catch (e) {
    console.log(e);
}

try { //Test 4
    console.log(await dogs.remove(kika._id));
} catch (e) {
    console.log(e);
}

try { //Test 5
    console.log(await dogs.getAll());
} catch (e) {
    console.log(e);
}

await closeConnection();