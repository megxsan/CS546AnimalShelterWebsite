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

    })
    .post(async (req, res) => {
        /*  Post
                -Recieving quiz form
        */
    });

 export default router;
 