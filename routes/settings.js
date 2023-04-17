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
        if(!req.sessions.user._id){
                res.render('error', {title: "Seetings Error", error: "Must be signed in to access statuses"});
        }
        res.render('status', {title: "Status", id: req.sessions.user._id});
        });

router
	.route("/edit")
	.get(async (req, res) => {
	/*  Get 
			-Seeing edit settings form
	*/
    if(!req.sessions.user._id){
        res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"});
    }
        res.render('settings', {title: "Settings", id: req.sessions.user._id});
    })
    .patch(async (req, res) => {
        /*  Patch 
                -Recieving edit settings form
        */
        if(!req.sessions.user._id){
            res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"});
        }
        let settingInputs = req.body;
        try{
            //error check all setting inputs
            
        }catch(e){
            res.render('error', {title: "Settings Error", error: "Must be signed in to change your settings"})
        }

        //update informaiton in the database using a user update function

    });

 export default router;
 