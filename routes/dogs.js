import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/:dogId")
	.get(async (req, res) => {
        /*  Get 
                -Displaying all the data on the dog
                -Seeing likes & comments
        */


    })
    .patch(async (req, res) => {
        /*  Patch 
                -Sending an application
                -Clicking a like
                -Adding a comment
        */

    });

 export default router;
 