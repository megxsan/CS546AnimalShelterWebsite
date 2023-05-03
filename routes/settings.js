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
			res.render('pages/settings', {title: "Status", taken:false});
		} else {
			let data = await userData.getUserById(req.session.user._id);
			res.render('pages/settings', {first: data.firstName, last: data.lastName, age: data.age, email: data.email, taken:false});
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
        let taken;
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
                    req.body.emailInput = validation.checkEmail(req.body.emailInput, "Email");
                    if(user.email === req.body.emailInput) taken = true;//throw 'Cannot change to the same email';
                    req.body.emailInput = xss(req.body.emailInput);
                    inputEmail = true;
                }
                try{
                    if(inputEmail){
                        taken = userData.getUserByEmail(req.body.emailInput);
                    }

                }catch(e){
                    //continue
                    //if it were to go here, we would want to continue
                }

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
                console.log(e)
            }       
            
            try{
                if(taken){
                    res.render('pages/settings', {title: "Account", first: user.firstName, last:user.lastName, age:user.age, email:user.email, taken:true})
                }else{
                    let updated = await userData.updateUser(req.session.user._id, req.body.firstNameInput, req.body.lastNameInput, req.body.ageInput, req.body.emailInput, req.body.oldPasswordInput, req.body.newPasswordInput);
                    res.render('pages/settings', {title: "Account", first: updated.firstName, last:updated.lastName, age:updated.age, email:updated.email, taken:false})

                }
            }catch(e){
                console.log(e);
                res.render('pages/updateSettings', {title: "Update Settings"});
            }
        }
    });

 export default router;
 