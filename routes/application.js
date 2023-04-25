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
                if(!req.session.user._id){
                        res.render('error', {title: "Application Error", error: "Must be signed in to access your application"});
                }
                try{
                        let application = await appData.getApp(req.session.user._id);
                        res.render('application', {title: "Application", app: application});
                }catch(e){
                        res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
                }
    });

router
	.route("/edit")
	.get(async (req, res) => {
        //  Get -Seeing edit application form
        if(!req.session.user._id){
                res.render('error', {title: "Application Error", error: "Must be signed in to edit an application"});
        }
        res.render('application', {tite:"Editing Application Page", user: req.session.user._id});
    })
    .patch(async (req, res) => {
        /*  Patch 
                -Recieving edit application form
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
                        let application = await appData.updateApp(req.session.user._id,checked.firstName,checked.lastName,checked.age,checked.email,checked.phone,checked.livingAccommodations,
                                checked.children,checked.childrenAges,checked.timeAlone,checked.animals,checked.typeAnimals,checked.yard,checked.reasoningExperience);
                        res.render('application', {title: "Application", app: application});
                }catch(e){
                        res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
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
    .patch(async (req, res) => {
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
 