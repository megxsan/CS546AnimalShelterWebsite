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
                -Seeing quiz form
        */
        // if(!req.session.user._id){
        //         res.render('error', {title: "Quiz Error", error: "Must be signed in to access the quiz"});
        // }
        //MEGAN PUT THIS TO GET TO THE PAGE WE NEED TO CHECK FOR LOGIN AND STUFF
                res.render('pages/quiz', {title: "Quiz"});

        })
    .post(async (req, res) => {
        /*  Post
                -Recieving quiz form
        */
        if(!req.sessions.user._id){
                res.render('error', {title: "Quiz Error", error: "Must be signed in to access the quiz"});
        }

        //insert stuff relating to quiz result input
    });

 export default router;
 