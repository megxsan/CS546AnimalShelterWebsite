import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/application")
	.get(async (req, res) => {
        /*  Get 
                -Seeing application form
        */

    });

router
	.route("/application/edit")
	.get(async (req, res) => {
        /*  Get 
                -Seeing edit application form
        */

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
 