require('dotenv').config();
const router=require('express').Router();

const {UsersModel} = require('../database/models.js')

router.get('/',async (req , res)=>{
    try{
        const find= await UsersModel.find();
        res.json(find)
    } catch(e){
        console.log({error : e.message});
    }
});

router.get('/:id',async(req , res)=>{
  try {
     const {id}=req.params;
     const user = await UsersModel.findById({_id : id})
     if(!user) return res.send("no user found");
     res.json(user)
  } catch (error) {
    console.log({e:error.message})
  }
})

router.post('/check', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UsersModel.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/',async(req , res)=>{
    try {
        const name= req.body.name
        const email=req.body.email
        const role= req.body.role
        const department=req.body.department
        const isActive  = req.body.isActive
        const createdAt = req.body.createdAt || Date.now()
        const lastlogin = req.body.lastlogin

        const upload = await UsersModel({name,email,role,department,isActive,createdAt,lastlogin})
        await upload.save()
        res.send("uploaded successfully")

    } catch (error) {
        console.log({ error: error.message });
    res.status(400).json({ error: error.message });
    }
})

router.put('/:id',async(req , res)=>{
    try {
         const updated = await UsersModel.findByIdAndUpdate(req.params.id,
            {  name: req.body.name,
          email:req.body.email,
          role: req.body.role,
          department:req.body.department,
         isActive  : req.body.isActive,
         createdAt : req.body.createdAt || Date.now(),
          lastlogin : req.body.lastlogin
            }
         )
          if(! updated) return  res.send("Idea Not Updated")
          res.json(updated);
    } catch (error) {
        console.log({e:error.message})
    }
})

//for delete request:

router.delete("/:id",async(req,res)=>{
    try{
        const deleted =await UsersModel.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({error:"not found"})
        res.json({ok:true})
    }
    catch(e){
      res.status(400).json({error:e.message})
    }
})

module.exports=router