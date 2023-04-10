import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers.js";

const exportedMethods = {
    async create(firstName, lastName, age, email, password){
        firstName = validation.checkString(firstName, "First Name");
        lastName = validation.checkString(lastName, "Last Name");
        age = validation.checkAge(age);
        email = validation.checkEmail(email);
        password = validation.checkString(password, "Password");
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            dogs: [],
            quizResult: [],
            application: {},
            accepted: [],
            pending: [],
            rejected: [],
            liked: [],
            disliked: []
        };
        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Could not add user';
        }
        return newUser;
    }
};

export default exportedMethods;