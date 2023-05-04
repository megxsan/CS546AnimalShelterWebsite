import { userData } from "../data/index.js";
import { dogData } from "../data/index.js";
import { appData } from "../data/index.js";
import validation from "../validation.js";

import { Router } from "express";
const router = Router();

router
	.route("/")
	.get(async (req, res) => {
                let signedIn = true;
		if (!req.session.user){
			signedIn = false;
		}
        /*  Get 
                -Seeing quiz form
        */
        // if(!req.session.user._id){
        //         res.render('error', {title: "Quiz Error", error: "Must be signed in to access the quiz"});
        // }
        //MEGAN PUT THIS TO GET TO THE PAGE WE NEED TO CHECK FOR LOGIN AND STUFF
                res.render('pages/quiz', {title: "Quiz", signedIn: signedIn});

        })
    .post(async (req, res) => {
        /*  Post
                -Recieving quiz form
        */
        let signedIn = true;
        if (!req.session.user){
                signedIn = false;
        }
        let quiz = req.body;
        try{
                //error check all of the input
                quiz.space = quiz.space.trim();
                if(quiz.space != "apartment" && quiz.space != "houseB" && quiz.space != "houseN") throw `invalid space input`;

                quiz.walks = quiz.walks.trim().toLowerCase();
                if(quiz.walks != "none" && quiz.walks != "short" && quiz.walks != "long" && quiz.walks != "many") throw `invalid walks input`;

                quiz.outside = quiz.outside.toLowerCase().trim();
                if(quiz.outside != "inside" && quiz.outside != "out" && quiz.outside != "both") throw `invalid outside input`

                quiz.fur = quiz.fur.toLowerCase().trim();
                if(quiz.fur != "noshed" && quiz.fur != "shed" && quiz.fur != "bothshed") throw `invalid shed input`

                quiz.size = quiz.size.toLowerCase().trim();
                if(quiz.size  != "mini" && quiz.size != "small" && quiz.size != "medium" && quiz.size  != "large" && quiz.size  != "xlarge") throw `invalid size input`
                
                quiz.activity = quiz.activity.toLowerCase().trim();
                if(quiz.activity != "lazy" && quiz.activity != "physical" && quiz.activity != "activityboth") throw `invalid activity input`

                quiz.fam = quiz.fam.toLowerCase().trim();
                if(quiz.fam != "me" && quiz.fam != "nokid" && quiz.fam != "kid") throw `invalid family input`

                quiz.dog = quiz.dog.toLowerCase().trim();
                if(quiz.dog != "working" && quiz.dog != "herding" && quiz.dog != "hound" && quiz.dog != "sporting" && quiz.dog != "nonsporting" && quiz.dog != "toy" && quiz.dog != "terrier") throw `invalid dog input`

        }catch(e){
                res.status(400).render('pages/quiz', {title: "Quiz", signedIn: signedIn})
        }

        //here are counters to keep track of the quiz results
        let working = 0;
        let herding = 0;
        let hound = 0;
        let sporting = 0;
        let nonsporting = 0;
        let toy = 0;
        let terrier = 0;

        //question 1
        if(quiz.space === "apartment"){
                toy++;
                nonsporting++;
        }else if(quiz.space === "houseB"){
                hound++;
                terrier++;
        }else{
                working++;
                herding++;
                sporting++;
        }

        //question 2
        if(quiz.walks === "none"){
                toy++;
        }else if(quiz.walks === "short"){
                terrier++;
                hound++;
                nonsporting++;
        }else if(quiz.walks === "long"){
                herding++;
        }else{
                working++;
                sporting++;
        }

        //question 3
        if(quiz.outside === "inside"){
                toy++;
                hound++;
        }else if(quiz.outside === "out"){
                working++;
                sporting++;
        }else{
                herding++;
                nonsporting++;
                terrier;
        }

        //question 4
        if(quiz.fur === "noshed"){
                toy++;
                hound++;
        }else if(quiz.fur === "shed"){
                working++;
                sporting++;
        }else{
                working++;
                herding++;
                hound++;
                sporting++;
                nonsporting++;
                toy++;
                terrier++;
        }

        //question 5
        if(quiz.size === "mini"){
                toy++;
        }else if(quiz.size === "small"){
                herding++;
                hound++;
                nonsporting++;
                terrier++;
        }else if(quiz.size === "medium"){
                herding++;
                nonsporting++;
                sporting++;
        }else if(quiz.size === "large"){
                sporting++;
                working++;
        }else{
                working++;
        }

        //question 6
        if(quiz.activity === "lazy"){
                toy++;
                nonsporting++;
                hound++;
        }else if(quiz.activity === "physical"){
                sporting++;
                herding++;
                working++;
        }else{
                nonsporting++;
                herding++;
                hound++;
                terrier;
        }

        //question 7
        if(quiz.fam === "me"){
                toy++;
                working++;
                herding++;
        }else if(quiz.fam === "nokid"){
                toy++;
                working++;
                herding++;
        }else{
                sporting++;
                nonsporting++;
                terrier++;
                hound++;
        }

        //question 8
        if(quiz.dog === "working"){working++}
        else if(quiz.dog === "herding"){herding++}
        else if(quiz.dog === "hound"){hound++}
        else if(quiz.dog === "sporting"){sporting++}
        else if(quiz.dog === "nonsporting"){nonsporting++}
        else if(quiz.dog === "toy"){toy++}
        else{terrier++}

        //now compare and return the result
        let result = [];

        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === working){
                result.push("Working Group (Bernese Mountain Dog, Boxer, Siberian Husky, Doberman Pinscher, etc)");
        }
        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === herding){
                result.push("Herding Group (Border Collie, Shetland Sheepdog, Corgi, German Shepard, etc)");
        }
        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === hound){
                result.push("Hound Group (American Foxhound, Basset Hound, Beagle, Bloodhound, etc)");
        }
        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === sporting){
                result.push("Sporting Group (Golden Retriever, Labrador Retriever, English Cocker Spaniel, Irish Setter, etc)");
        }
        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === nonsporting){
                result.push("Nonsporting Group (French Bulldog, Dalmation, Poodle, etc)");
        }
        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === toy){
                result.push("Toy Group (Pug, Chihuahua, Pomeranian, Pekingese, etc)");
        }
        if (Math.max(working, herding, hound, sporting, nonsporting, toy, terrier) === terrier){
                result.push("Terrier Group (Jack Russell Terrier, Border Terrier, Bull Terrier, Irish Terrier, etc)");
        }

        res.render('pages/quizResult', {title: "Quiz Result", result:result, signedIn: signedIn});
    });

 export default router;
 