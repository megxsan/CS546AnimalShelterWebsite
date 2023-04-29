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
    .patch(async (req, res) => {
        /*  Patch 
                -Recieving edit settings form
        */
        // if(!req.session.user._id){
        //     res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"});
        // }
        let settingInputs = req.body;
        // try{
        //     //error check all setting inputs
            
        // }catch(e){
        //     res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"})
        // }


        //update informaiton in the database using a user update function
        if(!firstNameInput && !lastNameInput && !emailInput && !ageInput){
            res.render('pages/updateSettings', {title: "Update Settings"})
        }
    });

 export default router;
 