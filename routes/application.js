//routes for app
import { userData } from '../data/index.js';
import { dogData } from '../data/index.js';
import { appData } from '../data/index.js';
import * as helper from '../applicationhelpers.js';


import {Router} from 'express';
const router = Router();
//add imports

router
  .route('/:account/app')
  .get(async (req, res) => {
    //code here for GET
    if(!ObjectId.isValid(req.params.account)){
      return res.render('error',{title:"Invalid ID"})
    }
    res.render('application', {title: "Application", id: req.params.account});
  })
  .post(async (req, res) => {
    //code here for POST
    let application = req.body;
    if(!application || Object.keys(application).length != 14){
      res.render('error', {title: "missing application input"});
    }

    //now error check for the application
    try{
      helper.boolChecker(application.children);
      helper.boolChecker(application.aniamls);
      helper.numChecker(application.age);
      helper.numChecker(application.phone);
      helper.numChecker(application.timeAlone);

      //insert checking age/time/phone ranges
      application.firstName = helper.stringChecker(application.firstName);
      application.lastName = helper.stringChecker(application.lastName);
      application.email = helper.stringChecker(application.email);
      application.livingAccomodations = helper.stringChecker(application.livingAccomodations);
      application.reasoning = helper.stringChecker(application.reasoning);
      helper.nameChecker(firstName);
      helper.nameChecker(lastName);

      //include checking email and living accom
      helper.arrayChecker(application.childrenAges);
      helper.arrayChecker(application.typeAnimals);
      helper.arrayChecker(application.yard);
      //go back and check these values

    }catch(e){
      res.render('error', {title: "incorrect application input", error:e});
    }
    if(!ObjectId.isValid(application.userId)){
      res.render('error', {title: "invalid userID", error:e});
    }

    const {userId,firstName,lastName,age,email,phone,livingAccommodations,children,childrenAges, timeAlone,animals,typeAnimals,yard,reasoningExperience}= application;
    const newApp = await appData.create(userId,firstName,lastName,age,email,phone,livingAccommodations,children,childrenAges, timeAlone,animals,typeAnimals,yard,reasoningExperience);
    return res
      .status(200)
      .render('posts', {title: "New Post", app: newApp});
  });

export default router;