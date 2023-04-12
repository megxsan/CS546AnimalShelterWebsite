//routes for user
import {Router} from 'express';
const router = Router();
import validation from "../validation.js";

router
//this is like our homepage
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try{
      res.render('homepage', {title: "User Homepage"});
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
      band.name = validation.checkString(band.name, "Name");
      band.sex = validation.checkSex(band.sex, "Sex");
      band.age = validation.checkDogAge(band.age, "Age");
      band.color = validation.checkStringArray(band.color, "Color", 1);
      band.breeds = validation.checkStringArray(band.breeds, "Breeds", 1);
      band.weight = validation.checkWeight(band.weight, "Weight");
      band.description = validation.checkString(band.description, "Description");
      band.traits = validation.checkStringArray(band.traits, "Traits", 0);
      band.medicalInfo = validation.checkStringArray(band.medicalInfo, "Medical Info", 0);
      band.vaccines = validation.checkStringArray(band.vaccines, "Vaccines", 0);
      band.pictures = validation.checkStringArray(band.pictures, "Pictures", 0); //NEEDS TO BE PROPERLY VALIDATED
      band.userId = validation.checkId(band.userId, "User ID");
    }catch(e){
      return res
        .status(400)
        .render('error', {title: "Invalid Input"});
    }
    const {name, sex, age, color, breeds, weight, description, traits, medicalInfo, vaccines, pictures, userId, interest, adopted, likes, comments} = dog;
    // const newDog = await dogData.create(name, sex, age, color, breeds, weight, description, traits, medicalInfo, vaccines, pictures, userId, interest, adopted, likes, comments);
    // return res
    //   .status(200)
    //   .render('posts', {title: "New Post", dog: dog});

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