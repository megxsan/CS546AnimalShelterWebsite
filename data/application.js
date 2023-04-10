import {users, dogs} from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { inputChecker, boolChecker, numChecker, stringChecker, nameChecker, arrayChecker } from '../applicationhelpers.js'

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
    if(phone.length != 9) throw `Invalid phone number`;
    if(timeAlone < 0 || timeAlone > 24) throw `Time alone must be between 0 and 24 hours`;

    //checking strings
    firstName = stringChecker(firstName);
    lastName = stringChecker(lastName);
    email = stringChecker(email);
    livingAccommodations = stringChecker(livingAccommodations);
    reasoningExperience = stringChecker(reasoningExperience);
    nameChecker(firstName);
    nameChecker(lastName);

    if(!email.contains("@")) throw `not a valid email`;
    if(!email.contains(".org") && !email.contains(".edu") && !email.contains(".com") && !email.contains(".gov") && !email.contains(".net")) throw `Not a valid email`;
    let at = email.indexOf("@");
    let end = email.indexOf(".");
    if(at < end) throw `not a valid email`;

    livingAccommodations = livingAccommodations.toLowerCase();
    if(livingAccommodations != "home" || livingAccommodations != "apartment" || livingAccommodations != "townhouse" || livingAccommodations != "other"){
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
        if(typeAnimals[i] != 'dog' || typeAnimals[i] != 'cat' || typeAnimals[i] != 'other'){
            throw `Animal types not valid`;
        }
    }
    for(let i = 0; i < yard.length; i++){
        stringChecker(yard[i]);
        yard[i] = yard[i].toLowerCase();
        if(yard[i] != 'enclosed front yard' || yard[i] != 'enclosed back yard' || yard[i] != 'garage' || yard[i] != 'dog house' || yard[i] != 'other'){
            throw `yard types not valid`;
        }
    }
    userId = stringChecker(userId);
    if(!Object.isValid(userId)) throw `not a valid user id`;

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
    const updating = await userFunctions.get(userId);
    let updatedApplication = updating.application;
    updatedApplication.push(newApp);

    const updated = await users.findOneAndUpdate(
        {_id: new ObjectId(userId)}, 
        {$set: {application: newApp}}, 
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
    
    const currInterest = await dogs.get(dogID);
    if(currInterest.interest.contains(appID)) throw `You already applied for this dog`;

    const updated = await dogs.findOneAndUpdate(
        {_id: new ObjectId(dogID)}, 
        {$push: {interest: appID}}, 
        {returnDocument: "after"});
    if(updated.lastErrorObject.n === 0) throw `Application could not be updated`;
    return `${appID} is now interested`;
}

export {create, sending};
