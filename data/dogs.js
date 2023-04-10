import { dogs } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import validation from '../validation.js';
//Yay
const create = async (
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
  ) => 
{
    name = validation.checkString(name, "Name");
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
    let newobj = 
    {
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
    const insertInfo = await dogCollection.insertOne(newobj);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) 
    {
      throw "Could not add dog";
    };
    const newId = insertInfo.insertedId.toString();
    const obj = await get(newId);
    return obj;
};

const get = async (id) => 
{
  id = validation.checkId(id, "Dog ID");
  const dogCollection = await dogs();
  const dogObj = await dogCollection.findOne({_id: new ObjectId(id)});
  if(dogObj === null) 
  {
    throw "There is no dog with this id";
  };
  dogObj._id = dogObj._id.toString();
  return dogObj;
};

const getAll = async () => 
{
  const dogCollection = await dogs();
  let dogList = await dogCollection.find({}).toArray();
  if (dogList === undefined)
  {
    throw "Could not get all of the dogs";
  };
  dogList = dogList.map((element) => 
  {
    element._id = element._id.toString();
    return element;
  });
  return dogList;
};

const remove = async (id) => 
{
  id = validation.checkId(id, "Dog ID");
  const dogCollection = await dogs();
  const deletedDog = await dogCollection.findOneAndDelete({_id: new ObjectId(id)});
  if(deletedDog.lastErrorObject.n === 0)
  {
    throw `Deletion of dog with id ${id} was unsuccessful`;
  };
  return `${deletedDog.value.name} has been successfully deleted!`;
};

export {create, get, getAll, remove};