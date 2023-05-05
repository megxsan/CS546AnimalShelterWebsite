import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";
import xss from 'xss';

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
                -Seeing status (accepted, rejected, pending) of all applications sent out
        */
        // if(!req.session.user){
        //         res.render('error', {title: "Seetings Error", error: "Must be signed in to access statuses"});
        // }
        res.render('pages/myaccount', {title: "Status", signedIn: signedIn});
        });
router
	.route("/get")
	.get(async (req, res) => {
        let signedIn = true;
		if (!req.session.user){
			signedIn = false;
		}
		/*  Get 
				-Seeing status (accepted, rejected, pending) of all applications sent out
		*/
		// if(!req.session.user){
		//         res.render('error', {title: "Seetings Error", error: "Must be signed in to access statuses"});
		// }

		// OLIVIA CODED THIS FOR TESTING PURPOSE (NEEDS TO BE MODIFIED FOR BETTER ERROR CHECKING)
		if (!req.session.user) {
			res.render('pages/settings', {title: "Status", taken:false, signedIn: signedIn});
		} else {
			let data = await userData.getUserById(req.session.user._id);
			res.render('pages/settings', {first: data.firstName, last: data.lastName, age: data.age, email: data.email, taken:false, signedIn: signedIn});
		}
		});

router
	.route("/edit")
	.get(async (req, res) => {
        let signedIn = true;
		if (!req.session.user){
			signedIn = false;
		}
	/*  Get 
			-Seeing edit settings form
	*/
    // if(!req.sessions.user._id){
    //     res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"});
    // }
        res.render('pages/updateSettings', {title: "Settings", signedIn: signedIn});
    })
    .post(async (req, res) => {
        let signedIn = true;
		if (!req.session.user){
			signedIn = false;
		}
        /*  Post
                -Recieving edit settings form
        */
        let taken;
        //update informaiton in the database using a user update function
        if(!req.body.firstNameInput && !req.body.lastNameInput && !req.body.emailInput && !req.body.ageInput && !req.body.newPasswordInput){
            res.status(400).render('pages/updateSettings', {title: "Update Settings", signedIn: signedIn})
        }else{
            let user = {};
            try{
                user = await userData.getUserById(req.session.user._id);
            }catch(e){
                res.status(400).render('pages/updateSettings', {title: "Update Settings", signedIn: signedIn})

            }
            try{
                req.body.oldPasswordInput = validation.checkPassword(req.body.oldPasswordInput, "Old Password");
                req.body.oldPasswordInput = xss(req.body.oldPasswordInput);
                if(!req.body.firstNameInput){ 
                    req.body.firstNameInput = user.firstName;
                }else{
                    req.body.firstNameInput = validation.checkName(req.body.firstNameInput, "First Name");
                    // if(user.firstName === req.body.firstNameInput) throw 'Cannot change to the same name';
                    if(user.firstName === req.body.firstNameInput) taken = true;
                    req.body.firstNameInput = xss(req.body.firstNameInput);

                }
                if(!req.body.lastNameInput){
                    req.body.lastNameInput = user.lastName

                }else{
                    req.body.lastNameInput = validation.checkName(req.body.lastNameInput, "Last Name");
                    if(user.lastName === req.body.lastNameInput) taken = true;//throw 'Cannot change to the same name';
                    req.body.lastNameInput = xss(req.body.lastNameInput);
                }

                let inputEmail = false;
                if(!req.body.emailInput){ 
                    req.body.emailInput = user.email
                }else{
                    req.body.emailInput = req.body.emailInput.toLowerCase();
                    req.body.emailInput = validation.checkEmail(req.body.emailInput, "Email");
                    if(user.email === req.body.emailInput) taken = true;//throw 'Cannot change to the same email';
                    req.body.emailInput = xss(req.body.emailInput);
                    inputEmail = true;
                }
                let used = "";
                if(inputEmail){
                    used = userData.getUserByEmailSettings(req.body.emailInput)
                }
                if(used === "no"){taken = true};

                if(!req.body.ageInput){ 
                    req.body.ageInput = user.age;
                }else{
                    let age = parseInt(req.body.ageInput);
                    req.body.ageInput = validation.checkAge(age, "Age");
                    if(user.age === age) taken = true;//throw `Cannot change to the same age`
                    req.body.ageInput = xss(req.body.ageInput);
                }
                if(!req.body.newPasswordInput){
                    req.body.newPasswordInput = req.body.oldPasswordInput;

                }else{
                    req.body.newPasswordInput = validation.checkPassword(req.body.newPasswordInput, "New Password");
                    if(req.body.newPasswordInput === req.body.oldPasswordInput) taken = true;//throw `New password cannot be the same as old password`;
                    req.body.newPasswordInput = xss(req.body.newPasswordInput);
                }
            }catch(e){
                res.status(400).render('pages/settings', {title: "Account", first: user.firstName, last:user.lastName, age:user.age, email:user.email, taken:true, signedIn: signedIn})
            }       
            try{
                if(taken){
                    res.status(400).render('pages/settings', {title: "Account", first: user.firstName, last:user.lastName, age:user.age, email:user.email, taken:true, signedIn: signedIn})
                }else{
                    let updated = await userData.updateUser(req.session.user._id, req.body.firstNameInput, req.body.lastNameInput, req.body.ageInput, req.body.emailInput, req.body.oldPasswordInput, req.body.newPasswordInput);
                    res.status(400).render('pages/settings', {title: "Account", first: updated.firstName, last:updated.lastName, age:updated.age, email:updated.email, taken:false, signedIn: signedIn})

                }
            }catch(e){
                res.status(400).render('pages/settings', {title: "Account", first: user.firstName, last:user.lastName, age:user.age, email:user.email, taken:true, signedIn: signedIn});
            }
        }
    });

 export default router;
 