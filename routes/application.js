import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
        .route("/")
	.get(async (req, res) => {
        //  Get - Seeing application form
                let hasApp;
                let noApp;
                let app;
                let application = await appData.getApp(req.session.user._id);
                if(Object.keys(application).length === 0){
                        hasApp = false;
                        noApp = true;
                        res.render('pages/app', {title: "Application", app: hasApp, noApp: noApp});
                }else{
                        hasApp = true;
                        noApp = false;
                        res.render('pages/app', {title: "Application", app: hasApp, noApp: noApp, first:application.firstName, last:application.lastName, age: application.age, email:application.email, phone:application.phone, livingAccommodations: application.livingAccommodations, children:application.children, timeAlone:application.timeAlone, animals:application.animals, yard:application.yard, reasoningExperience: application.reasoningExperience});

                }
                // }catch(e){
                //         res.render('error', {title: "Application Error", error:e});
                //         //figure out what status to put
                // }
    });

router
	.route("/edit")
	.get(async (req, res) => {
        //  Get -Seeing edit application form
        if(!req.session.user._id){
                res.render('error', {title: "Application Error", error: "Must be signed in to edit an application"});
        }
        res.render('pages/updateApp', {tite:"Editing Application Page", user: req.session.user._id});
    })
    .post(async (req, res) => {
        /*  Patch 
                -Recieving edit application form
        */
                const app = req.body;
                let checked = {};
                try{
                        checked = validation.checkAppInputs(req.session.user._id, app.firstNameInput,app.lastNameInput,app.ageInput,app.emailInput,app.phoneInput, app.livingAccommodationsInput,
                                app.childrenInput,app.timeAloneInput,app.animalsInput,app.yardInput,app.reasoningInput)
                }catch(e){
                        // res.render('error', {title: "Application Error", error:e});
                        //figure out what status goes here
                        console.log(e)
                }
                try{
                        let application = await appData.addApp(req.session.user._id,checked.firstName,checked.lastName,checked.age,checked.email,checked.phone,checked.livingAccommodations,
                                checked.children,checked.timeAlone,checked.animals,checked.yard,checked.reasoningExperience);
                        res.render('pages/app', {title: "Application"});
                }catch(e){
                        // res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
                        console.log(e);
                }
    });

router
	.route("/add")
	.get(async (req, res) => {
        /*  Get 
                -Seeing application form
        */
                if(!req.session.user._id){
                        res.render('error', {title: "Application Error", error: "Must be signed in to add an application"});
                }
                res.render('pages/app', {title: "Application", user: req.session.user._id});
    })
    .post(async (req, res) => {
        /*  Post 
                -Recieving application form
        */
                const app = req.body;
                if(!app || Object.keys(app).length != 14){
                  return res
                    .status(400)
                    .json({error: 'There are fields missing in the request body'});
                }
                let checked = {};
                try{
                        checked = validation.checkAppInputs(app.userId,app.firstName,app.lastName,app.age,app.email,app.phone, app.livingAccommodations,
                                app.children,app.childrenAges,app.timeAlone,app.animals,app.typeAnimals,app.yard,app.reasoningExperience)
                }catch(e){
                        res.render('error', {title: "Application Error", error:e});
                        //figure out what status goes here
                }
                try{
                        let application = await appData.addApp(req.session.user._id,checked.firstName,checked.lastName,checked.age,checked.email,checked.phone,checked.livingAccommodations,
                                checked.children,checked.childrenAges,checked.timeAlone,checked.animals,checked.typeAnimals,checked.yard,checked.reasoningExperience);
                        res.render('pages/app', {title: "Application", app: application});
                }catch(e){
                        res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
                }
    });

 export default router;
 