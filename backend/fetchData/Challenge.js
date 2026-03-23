require("dotenv").config();

const router=require("express").Router();

const mongoose = require("mongoose");

//importing Challenge Model
const {challengeModel} = require('../database/models.js');

router.get('/',async (req , res)=>{
    try {
        const today = new Date();

     await challengeModel.updateMany(
      { startDate: { $gt: today } },
      { $set: { status: "upcoming" } }
    );

    await challengeModel.updateMany(
      { startDate: { $lte: today }, endDate: { $gte: today } },
      { $set: { status: "active" } }
    );

    await challengeModel.updateMany(
      { endDate: { $lt: today } },
      { $set: { status: "closed" } }
    );
        const challenge = await challengeModel.find();
        if(!challenge) return res.status(404).send("Data not Found");
        res.json(challenge);
    } catch (error) {
        console.log({e:error.message})
    }
})

router.post('/' ,async ( req , res)=>{
    try {
       const title = req.body.title
       const description= req.body.description
       const startDate=req.body.startDate
       const endDate= req.body.endDate
       const createdBy= req.body.user_id // reference to Users
       const status="active"        // active, closed, draft
       const tags=req.body.tags || ""
       const createdAt= req.body.createddate
       const updatedAt=req.body.updatedAt

       const upload = new challengeModel({title , description , startDate , endDate , createdBy , createdAt , status , tags , updatedAt})

       upload.save();
       res.send("challenges Uploaded");
    } catch (error) {
        console.log({e : error.message});
    }
});

//for getting challenges through reviewer id
router.get('/:id',async(req , res)=>{
    try {
        const id = req.params.id;
        const challenge= await challengeModel.find({createdBy:id});
        if(!challenge) return res.status(404).send("no data found");
        res.json(challenge);
    } catch (error) {
        console.log({e:error.message})
    }
})

module.exports = router;