import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../validation.js";
import bcrypt from 'bcrypt';

const exportedMethods = {
    async addUser(firstName, lastName, age, email, password) {
        firstName = validation.checkString(firstName, "First Name");
        lastName = validation.checkString(lastName, "Last Name");
        firstName = validation.checkName(firstName, "First Name");
        lastName = validation.checkName(lastName, "Last Name");
        age = parseInt(age)
        age = validation.checkAge(age);
        email = validation.checkEmail(email);
        email = email.toLowerCase();
        password = validation.checkString(password, "Password");
        password = validation.checkPassword(password);
        const hash = await bcrypt.hash(password, 10);

        const userCollection = await users();
        const myUser = await userCollection.findOne({email: email});
        if (myUser !== null) throw 'Error: Email is already registered';

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: hash,
            dogs: [],
            quizResult: [],
            application: {},
            accepted: [],
            pending: [],
            rejected: [],
            liked: [],
            disliked: []
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw 'Error: Could not add user';
        }
        const newId = insertInfo.insertedId.toString();
        const user = await this.getUserById(newId);
        return user;
    },

    async getUserById(id) {
        id = validation.checkId(id, "User ID");
        const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(id)});
        if (myUser === null) throw 'Error: No user with that ID';
        myUser._id = myUser._id.toString();
        return myUser;
    },

    async updateUser(id, firstName, lastName, age, email, oldPassword, newPassword) {
        id = validation.checkId(id, "User ID");
        firstName = validation.checkString(firstName, "First Name");
        lastName = validation.checkString(lastName, "Last Name");
        firstName = validation.checkName(firstName, "First Name");
        lastName = validation.checkName(lastName, "Last Name");
        age = parseInt(age);
        age = validation.checkAge(age);
        email = validation.checkEmail(email);
        email = email.toLowerCase();
        oldPassword = validation.checkString(oldPassword, "Password");
        oldPassword = validation.checkPassword(oldPassword);
        newPassword = validation.checkString(newPassword, "Password");
        newPassword = validation.checkPassword(newPassword);


        const userCollection = await users();
        const myUser = await userCollection.findOne({_id: new ObjectId(id)});
        if (myUser === null) throw 'Error: No user with that ID';

        let comparePassword = await bcrypt.compare(oldPassword, myUser.password);
        if (comparePassword == false) throw 'Password is invalid';
        const hash = await bcrypt.hash(newPassword, 10);
        
        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: hash,
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
    },

    async getUserByEmail(email) {
        email = validation.checkEmail(email, "Email");
        const userCollection = await users();
        const myUser = await userCollection.findOne({email: email});
        if (myUser === null) throw 'No user with that email';
        myUser._id = myUser._id.toString();
        return myUser;
    },

    async checkUser(email, password){
        password = validation.checkString(password, "Password");
        password = validation.checkPassword(password);
      
        email = email.toLowerCase();
        email = validation.checkString(email, "Email");
        email = validation.checkEmail(email);
        const userCollection = await users();
        const myUser = await userCollection.findOne({email: email});
        if (myUser === null) throw 'Either the email address or password is invalid';
        
        let comparePassword = await bcrypt.compare(password, myUser.password);
        if (comparePassword == false) throw 'Either the email address or password is invalid';
        
        myUser._id = myUser._id.toString();
        return myUser;
    }
};

export default exportedMethods;
