import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/")
	.get(async (req, res) => {
                let signedIn = true;
		if (!req.session.user){
			signedIn = false;
		}
        /*  Get 
                -Seeing all your dogs
        */
                // if(!req.sessions.user._id){
                //         res.render('error', {title: "Dog Error", error: "Must be signed in to access your dogs"});
                // }
                // try{
                        let dogs = await dogData.getMyDogs(req.session.user._id);
                        res.render('pages/myDogs', {title: "MyDogs", dogs: dogs, signedIn: signedIn});
                // }catch(e){
                //         res.render('error', {title: "MyDogs Error", error:e});
                //         //figure out what status to put
                // }

    });

router
	.route("/:dogID/add")
	.get(async (req, res) => {
        /*  Get 
                -Seeing add dog form
        */
                let signedIn = true;
		if (!req.session.user){
			signedIn = false;
		}
                if(!req.sessions.user._id){
                        res.render('error', {title: "Dog Error", error: "Must be signed in to post your dog"});
                }
                res.render('adddog', {title: "Add Dog", user:req.sessions.user._id, signedIn: signedIn});
        })
        .post(async (req, res) => {
                /*  Post 
                        -Recieving add dog form form
                */
                let signedIn = true;
                if (!req.session.user){
                        signedIn = false;
                }
                if(!req.sessions.user._id){
                        res.render('error', {title: "Dog Error", error: "Must be signed in to post your dog"});
                }
                let dog = req.body;
                if(!dog || Object.keys(dog).length != 12){
                        return res
                          .status(400)
                          .json({error: 'There are fields missing in the request body'});
                      }
                try{
                        dog.name = validation.checkString(dog.name, "Name");
                        dog.name = validation.checkName(dog.name, "Name");
                        dog.sex = validation.checkSex(dog.sex, "Sex");
                        dog.age = validation.checkDogAge(dog.age, "Age");
                        dog.color = validation.checkStringArray(dog.color, "Color", 1);
                        dog.breeds = validation.checkStringArray(dog.breeds, "Breeds", 1);
                        dog.weight = validation.checkWeight(dog.weight, "Weight");
                        dog.description = validation.checkString(dog.description, "Description");
                        dog.traits = validation.checkStringArray(dog.traits, "Traits", 0);
                        dog.medicalInfo = validation.checkStringArray(dog.medicalInfo, "Medical Info", 0);
                        dog.vaccines = validation.checkStringArray(dog.vaccines, "Vaccines", 0);
                        dog.pictures = validation.checkStringArray(dog.pictures, "Pictures", 0); //NEEDS TO BE PROPERLY VALIDATED
                        dog.userId = validation.checkId(dog.userId, "User ID");
                }catch(e){
                        res.render('error', {title: "Post Dog Error", error: e})
                }
                let newDog = await dogData.addDog(dog.name,dog.sex,dog.age,dog.color,dog.breeds,dog.weight,dog.description,dog.traits,dog.medicalInfo,dog.vaccines,dog.pictures,dog.userId);
                res.render('postdog', {title: "Posting Dog", dog: newDog, signedIn: signedIn});
        });

router
	.route("/:dogID/edit")
	.get(async (req, res) => {
	/*  Get 
			-Seeing edit dog form
	*/

    })
    .patch(async (req, res) => {
        /*  Patch
                -Recieving edit dog form form
        */

    })
    .delete(async (req, res) => {
        /*  Delete
                -Delete dog
        */

    });

 export default router;
 