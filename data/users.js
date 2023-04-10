import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../usersHelpers.js";

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
    },

    async get(id){
        id = validation.checkId(id, "User ID");
        const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(id)});
        if (myUser === null) throw 'No user with that ID';
        myUser._id = myUser._id.toString();
        return myUser;
    },

    async update(id, firstName, lastName, age, email, password){
        id = validation.checkId(id, "User ID");
        firstName = validation.checkString(firstName, "First Name");
        lastName = validation.checkString(lastName, "Last Name");
        age = validation.checkAge(age);
        email = validation.checkEmail(email);
        password = validation.checkString(password, "Password");
        const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(id)});
        if (myUser === null) throw 'No user with that ID';
        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
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
            {_id: new ObjectId(id)},
            updatedUser,
            {returnDocument: 'after'}
        );
        if (updatedInfo.lastErrorObject.n === 0) throw [404, `Error: Update failed! Could not update post with id ${id}`];
        updatedInfo.value._id = updatedInfo.value._id.toString();
        return updatedInfo.value;
    }
};

export default exportedMethods;