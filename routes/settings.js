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

    });

router
	.route("/settings")
	.get(async (req, res) => {
	/*  Get 
			-Seeing edit settings form
	*/

    })
    .patch(async (req, res) => {
        /*  Patch 
                -Recieving edit settings form
        */

    });

 export default router;
 