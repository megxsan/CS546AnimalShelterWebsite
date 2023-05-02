import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/")
	.get(async (req, res) => {
        /*  Get 
                -Seeing status (accepted, rejected, pending) of all applications sent out
        */
        // if(!req.session.user){
        //         res.render('error', {title: "Seetings Error", error: "Must be signed in to access statuses"});
        // }
        res.render('pages/myaccount', {title: "Status"});
        });
router
	.route("/get")
	.get(async (req, res) => {
		/*  Get 
				-Seeing status (accepted, rejected, pending) of all applications sent out
		*/
		// if(!req.session.user){
		//         res.render('error', {title: "Seetings Error", error: "Must be signed in to access statuses"});
		// }

		// OLIVIA CODED THIS FOR TESTING PURPOSE (NEEDS TO BE MODIFIED FOR BETTER ERROR CHECKING)
		if (!req.session.user) {
			res.render('pages/settings', {title: "Status"});
		} else {
			let data = await userData.getUserById(req.session.user._id);
			res.render('pages/settings', {first: data.firstName, last: data.lastName, age: data.age, email: data.email});
		}
		});

router
	.route("/edit")
	.get(async (req, res) => {
	/*  Get 
			-Seeing edit settings form
	*/
    // if(!req.sessions.user._id){
    //     res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"});
    // }
        res.render('pages/updateSettings', {title: "Settings"});
    })
    .post(async (req, res) => {
        /*  Post
                -Recieving edit settings form
        */

        //update informaiton in the database using a user update function
        if(!req.body.firstNameInput && !req.body.lastNameInput && !req.body.emailInput && !req.body.ageInput){
            res.render('pages/updateSettings', {title: "Update Settings"})
        }else{
            let user = {};
            try{
                user = await userData.getUserById(req.session.user._id);
            }catch(e){
                res.render('pages/updateSettings', {title: "Update Settings"})

            }
            try{
                req.body.oldPasswordInput = validation.checkPassword(req.body.oldPasswordInput, "Old Password");
                if(!req.body.firstNameInput){ 
                    req.body.firstNameInput = user.firstName
                }else{
                    req.body.firstNameInput = validation.checkName(req.body.firstNameInput, "First Name");
                    if(user.firstName === req.body.firstNameInput) throw 'Cannot change to the same name';
                }
                if(!req.body.lastNameInput){
                    req.body.lastNameInput = user.lastName
                }else{
                    req.body.lastNameInput = validation.checkName(req.body.lastNameInput, "Last Name");
                    if(user.lastName === req.body.lastNameInput) throw 'Cannot change to the same name';
                }
                if(!req.body.emailInput){ 
                    req.body.emailInput = user.email
                }else{
                    //WE MIGHT ALSO NEED TO CHECK IF THE CURRENT EMAIL IS TAKEN
                    req.body.emailInput = validation.checkEmail(req.body.emailInput, "Email");
                    if(user.email === req.body.emailInput) throw 'Cannot change to the same email';
                }
                if(!req.body.ageInput){ 
                    req.body.ageInput = user.age
                }else{
                    req.body.ageInput = parseInt(req.body.ageInput);
                    req.body.ageInput = validation.checkAge(req.body.ageInput, "Age");
                    if(user.age === req.body.ageInput) throw `Cannot change to the same age`
                }
                if(!req.body.newPasswordInput){
                    req.body.newPasswordInput = req.body.oldPasswordInput
                }else{
                    req.body.newPasswordInput = validation.checkPassword(req.body.newPasswordInput, "New Password");
                    if(req.body.newPasswordInput === req.body.oldPasswordInput) throw `New password cannot be the same as old password`;
                }
            }catch(e){
                console.log(e)
            }            
            try{
                let updated = await userData.updateUser(req.session.user._id, req.body.firstNameInput, req.body.lastNameInput, req.body.ageInput, req.body.emailInput, req.body.oldPasswordInput, req.body.newPasswordInput);
                res.render('pages/settings', {title: "Account", first: updated.firstName, last:updated.lastName, age:updated.age, email:updated.email})
            }catch(e){
                console.log(e);
                res.render('pages/updateSettings', {title: "Update Settings"});
            }
        }
    });

 export default router;
 