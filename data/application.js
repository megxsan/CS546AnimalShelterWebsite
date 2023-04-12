import {users, dogs} from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { inputChecker, boolChecker, numChecker, stringChecker, nameChecker, arrayChecker } from '../applicationhelpers.js'
import * as user from './users.js';
import * as dog from './dogs.js';

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
    inputChecker(userId);
    inputChecker(firstName);
    inputChecker(lastName);
    inputChecker(age);
    inputChecker(email);
    inputChecker(phone);
    inputChecker(livingAccommodations);
    inputChecker(children);
    inputChecker(childrenAges);
    inputChecker(timeAlone);
    inputChecker(animals);
    inputChecker(typeAnimals);
    inputChecker(yard);
    inputChecker(reasoningExperience);
    //checking booleans
    boolChecker(children);
    boolChecker(animals);

    //checking numbers
    numChecker(age);
    numChecker(phone);
    numChecker(timeAlone);
    if(age < 18 || age > 120) throw `Age is invalid`;
    if(phone.toString().length != 10) throw `Invalid phone number`;
    if(timeAlone < 0 || timeAlone > 24) throw `Time alone must be between 0 and 24 hours`;

    //checking strings
    firstName = stringChecker(firstName);
    lastName = stringChecker(lastName);
    email = stringChecker(email);
    livingAccommodations = stringChecker(livingAccommodations);
    reasoningExperience = stringChecker(reasoningExperience);
    nameChecker(firstName);
    nameChecker(lastName);

    if(!email.includes("@")) throw `not a valid email`;
    if(!email.includes(".org") && !email.includes(".edu") && !email.includes(".com") && !email.includes(".gov") && !email.includes(".net")) throw `Not a valid email`;
    let at = email.indexOf("@");
    let end = email.indexOf(".");
    if(!(at< end)) throw `not a valid email`;
    if(at === -1 || end === -1) throw `not a valid email`;

    livingAccommodations = livingAccommodations.toLowerCase();
    if(livingAccommodations != "home" && livingAccommodations != "apartment" && livingAccommodations != "townhouse" && livingAccommodations != "other"){
        throw `Living accommodation isn't valid`;
    }

    //checking arrays
    arrayChecker(childrenAges);
    arrayChecker(typeAnimals);
    arrayChecker(yard);
    for(let i = 0; i < childrenAges.length; i++){
        numChecker(childrenAges[i]);
        if(childrenAges[i] < 0 || childrenAges[i] > 18) throw `Children age isn't valid`;
    }
    for(let i = 0; i < typeAnimals.length; i++){
        stringChecker(typeAnimals[i]);
        typeAnimals[i] = typeAnimals[i].toLowerCase();
        if(typeAnimals[i] != 'dog' && typeAnimals[i] != 'cat' && typeAnimals[i] != 'other'){
            throw `Animal types not valid`;
        }
    }
    for(let i = 0; i < yard.length; i++){
        stringChecker(yard[i]);
        yard[i] = yard[i].toLowerCase();
        if(yard[i] != 'enclosed front yard' && yard[i] != 'enclosed back yard' && yard[i] != 'garage' && yard[i] != 'dog house' && yard[i] != 'other'){
            throw `yard types not valid`;
        }
    }
    //userId = stringChecker(userId);
    if(!ObjectId.isValid(userId)) throw `not a valid user id`;

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
        reasoningExperience
    }
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
        disliked: result.disliked
    }

    const updated = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(userId)}, 
        {$set: userWithApp}, 
        {returnDocument: "after"});
    if(updated.lastErrorObject.n === 0) throw `Application could not be updated`;
    return newApp;
}

const sending = async(appID, dogID) => {
    //this will send the application to the user
    stringChecker(appID);
    stringChecker(dogID);
    if(!Object.isValid(appID)) throw `Application ID isn't valid`;
    if(!Object.isValid(dogID)) throw `Dog ID isn't valid`;
    
    const dogCollection = await dogs();

    const currInterest = await dog.get(dogID);
    if(currInterest.interest.contains(appID)) throw `You already applied for this dog`;

    const updated = await dogCollection.findOneAndUpdate(
        {_id: new ObjectId(dogID)}, 
        {$push: {interest: appID}}, 
        {returnDocument: "after"});
    if(updated.lastErrorObject.n === 0) throw `Application could not be updated`;
    return `${appID} is now interested`;
}

export {create, sending};
