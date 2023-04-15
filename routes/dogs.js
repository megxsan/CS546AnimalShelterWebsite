//routes for dog

import {Router} from 'express';
const router = Router();
import validation from '../validation.js';
import { userData } from '../data/index.js';
import { dogData } from '../data/index.js';
//add imports

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    

  })
  .post(async (req, res) => {
    //code here for POST

  });

router
  //This is the "My Posts" page
  .route('/:id')
  .get(async (req, res) => {
    try{
      req.params.id = validation.checkId(req.params.id, 'User ID');
    }catch(e){
      return res
        .status(400)
        .render('error', {title: "Error Page", error: 'User ID is invalid'});
    }
    try{
      const myUser = await userData.get(req.params.id);
      const myDogIds = myUser.dogs;
      for (let i = 0; i < myDogIds.length; i++){
        myDogIds[i] = await dogData.get(myDogIds[i], 'Dog ID');
      }
      return res
        .status(200)
        .render('myPosts', {dogs: myDogIds});
    }catch(e){
      return res
        .status(400)
        .render('error', {title: "Error Page", error: 'Could not get your posts'});
    }
  })

export default router;