import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
        .route("/application")
	.get(async (req, res) => {
        //  Get - Seeing application form
                //figure out how to get the userId
                try{
                        let application = await appData.getApp(req.sessions.user._id);
                        res.render('application', {title: "Application", app: application});
                }catch(e){
                        res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
                }
    });

router
	.route("/application/edit")
	.get(async (req, res) => {
        //  Get -Seeing edit application form
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
                        let application = await appData.updateApp(req.sessions.user._id,checked.firstName,checked.lastName,checked.age,checked.email,checked.phone,checked.livingAccommodations,
                                checked.children,checked.childrenAges,checked.timeAlone,checked.animals,checked.typeAnimals,checked.yard,checked.reasoningExperience);
                        res.render('application', {title: "Application", app: application});
                }catch(e){
                        res.render('error', {title: "Application Error", error:e});
                        //figure out what status to put
                }
    });

router
	.route("/application/add")
	.get(async (req, res) => {
        /*  Get 
                -Seeing application form
        */

    })
    .patch(async (req, res) => {
        /*  Post 
                -Recieving application form
        */

    });

 export default router;
 