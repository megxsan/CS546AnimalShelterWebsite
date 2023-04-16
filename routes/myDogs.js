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
                -Seeing all your dogs
        */

    });

router
	.route("/:dogID/add")
	.get(async (req, res) => {
        /*  Get 
                -Seeing add dog form
        */

    })
    .post(async (req, res) => {
        /*  Post 
                -Recieving add dog form form
        */

    });

router
	.route("/:dogID/edit")
	.get(async (req, res) => {
	/*  Get 
			-Seeing edit dog form
	*/

    })
    .patch(async (req, res) => {
        /*  Patch
                -Recieving edit dog form form
        */

    })
    .delete(async (req, res) => {
        /*  Delete
                -Delete dog
        */

    });

 export default router;
 