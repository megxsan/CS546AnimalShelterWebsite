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
        //  Get - Seeing application form
                let signedIn = true;
                if (!req.session.user) {
                        signedIn = false;
                }
                let hasApp;
                let noApp;
                let application = await appData.getApp(req.session.user._id);
                if(Object.keys(application).length === 0){
                        hasApp = false;
                        noApp = true;
                        res.render('pages/app', {title: "Application", app: hasApp, noApp: noApp, signedIn: signedIn});
                }else{
                        hasApp = true;
                        noApp = false;
                        res.render('pages/app', {title: "Application", app: hasApp, noApp: noApp, first:application.firstName, last:application.lastName, age: application.age, email:application.email, phone:application.phone, livingAccommodations: application.livingAccommodations, children:application.children, timeAlone:application.timeAlone, animals:application.animals, yard:application.yard, reasoningExperience: application.reasoningExperience, signedIn, signedIn});

                }

    });

router
        .route("/edit")
	.get(async (req, res) => {
        //  Get -Seeing edit application form
        let signedIn = true;
        if (!req.session.user) {
                signedIn = false;
        }
        if(!req.session.user._id){
                res.render('pages/homepage', {title: "HomePage", signedIn:false});
        }
        res.render('pages/updateApp', {tite:"Editing Application Page", user: req.session.user._id, signedIn: signedIn});
        })
        .post(async (req, res) => {
                let signedIn = true;
		if (!req.session.user) {
			signedIn = false;
		}
        /*  Patch 
                -Recieving edit application form
        */
                const app = req.body;
                let checked = {};
                try{
                        app.emailInput = app.emailInput.toLowerCase();
                        let timeAlone = parseInt(app.timeAloneInput);
                        checked = validation.checkAppInputs(req.session.user._id, app.firstNameInput,app.lastNameInput,app.ageInput,app.emailInput,app.phoneInput, app.livingAccommodationsInput,
                                app.childrenInput,timeAlone,app.animalsInput,app.yardInput,app.reasoningInput);

                        checked.firstName = xss(checked.firstName);
                        checked.lastName = xss(checked.lastName);
                        checked.age = xss(checked.age);
                        checked.email = xss(checked.email);
                        checked.phone = xss(checked.phone);
                        checked.livingAccommodations = xss(checked.livingAccommodations);
                        checked.children = xss(checked.children);
                        checked.timeAlone = xss(checked.timeAlone);
                        checked.animals = xss(checked.animals);
                        checked.yard = xss(checked.yard);
                        checked.reasoningExperience = xss(checked.reasoningExperience);

                }catch(e){
                        // res.render('error', {title: "Application Error", error:e});
                        //figure out what status goes here
                        return res.status(400).render('pages/updateApp', {title: "App", signedIn, signedIn});
                }
                try{
                        let application = await appData.addApp(req.session.user._id,checked.firstName,checked.lastName,checked.age,checked.email,checked.phone,checked.livingAccommodations,
                                checked.children,checked.timeAlone,checked.animals,checked.yard,checked.reasoningExperience);
                        return res.render('pages/app', {title: "App", app:true, first: checked.firstName, last: checked.lastName, age:checked.age, email:checked.email, phone: checked.phone, livingAccommodations: checked.livingAccommodations, children: checked.children, timeAlone: checked.timeAlone, animals:checked.animals, yard: checked.yard, reasoningExperience:checked.reasoningExperience, signedIn: signedIn});
                }catch(e){
                        // res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
                        return res.status(500).render('pages/updateApp', {title: "App", signedIn: signedIn});;
                }
    });

// router
// 	.route("/add")
// 	.get(async (req, res) => {
//         /*  Get 
//                 -Seeing application form
//         */
//                 if(!req.session.user._id){
//                         res.render('error', {title: "Application Error", error: "Must be signed in to add an application"});
//                 }else{
//                         res.render('pages/app', {title: "Application", user: req.session.user._id});
//                 }
//     })
//     .post(async (req, res) => {
//         /*  Post 
//                 -Recieving application form
//         */
//                 const app = req.body;
//                 if(!app || Object.keys(app).length != 14){
//                   return res
//                     .status(400)
//                     .json({error: 'There are fields missing in the request body'});
//                 }
//                 let checked = {};
//                 try{
//                         let timeAlone = parseInt(app.timeAloneInput);
//                         checked = validation.checkAppInputs(app.userId,app.firstName,app.lastName,app.age,app.email,app.phone, app.livingAccommodations,
//                                 app.children,app.childrenAges,app.timeAlone,app.animals,app.typeAnimals,app.yard,app.reasoningExperience)
//                 }catch(e){
//                         res.status(400).render('pages/app', {title: "Application"});
//                         //figure out what status goes here
//                 }
//                 try{
//                         let application = await appData.addApp(req.session.user._id,checked.firstName,checked.lastName,checked.age,checked.email,checked.phone,checked.livingAccommodations,
//                                 checked.children,checked.childrenAges,checked.timeAlone,checked.animals,checked.typeAnimals,checked.yard,checked.reasoningExperience);
//                         res.render('pages/app', {title: "Application", app: application});
//                 }catch(e){
//                         res.status(400).render('pages/app', {title: "Application"});
//                         //figure out what status to put
//                 }
//     });

 export default router;
 