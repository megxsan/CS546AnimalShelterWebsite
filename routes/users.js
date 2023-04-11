//routes for user
import {Router} from 'express';
const router = Router();
//add imports

router
//this is like our homepage
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try{
      res.render('homepage', {title: "Venue Finder"});
    }catch(e){
      res
        .status(500);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let dog = req.body;
    if(!dog || Object.keys(dog).length != 12){
      return res
        .status(400)
        .render('error', {title: "Error Page", error: 'There are fields missing in the request body'});
    }
    try{
      //error check for posts

    }catch(e){
      return res
        .status()
        .render('error', {title: "Can't Post"});
    }
  });



router
  .route('/logout/:id')
  .get(async (req, res) => {
    //code here for GET
    if(!ObjectId.isValid(req.params.id)){
      return res
        .status(500)
        .render('error', {title: "Error Page", error: "Id is not found"});
    }
    try{
      res.render('logout', {title:"Logout Page"});
    }catch(e){
      res
        .status(500);
    }
  })
  

  .post(async (req, res) => {
    //code here for POST

  });

export default router;