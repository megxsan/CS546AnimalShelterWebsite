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
                        let application = await appData.getApp("insertUserId");
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
                try{
                let application = await appData.getApp(**insertUserId**);
                res.render('application', {title: "Application", app: application});
                }catch(e){
                res.render('error', {title: "Application Error", error:e});
                //figure out what status to put
                }

    })
    .patch(async (req, res) => {
        /*  Patch 
                -Recieving edit application form
        */

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
 