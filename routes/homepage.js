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
                -Seeing all the dogs
                -Signing in button
                -Signing up button 
        */

    });

router
	.route("/login")
	.get(async (req, res) => {
        /*  Get 
                -Seeing login form
        */

    })
    .post(async (req, res) => {
        /*  Post 
                -Recieving login form
        */
    });

router
	.route("/signup")
	.get(async (req, res) => {
        /*  Get 
                -Seeing signup form
        */

    })
    .post(async (req, res) => {
        /*  Post 
                -Recieving signup form
        */
    });

export default router;
