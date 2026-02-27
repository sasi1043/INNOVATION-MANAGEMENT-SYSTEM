require("dotenv").config();

const router=require("express").Router();

const {IdeaModel} =require ('../database/models.js')

//Multer setup for storing file
const multer = require ('multer');

const ideaFileUpload = multer.diskStorage({
    destination:function(req , res , cb){
        cb(null,'./ideafiles');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+""+file.originalname)
    }
})

const ideaFileStorage = multer({storage : ideaFileUpload});

router.get('/',async(req , res)=>{
    try {
        const ideas =await IdeaModel.find().sort({createdByAt :1});
        if(!ideas) return res.status(404).send("No Data Found");
        res.json(ideas);
    } catch (error) {
        console.log({e:error.message})
    }
})

//for getting ideaas through id
router.get('/:id',async(req,res)=>{
   try {
    const id=req.params.id;
       const idea=await IdeaModel.find({submittedBy:id}).sort({createdByAt:-1})
       if(!idea) return res.status(404).send("no data found")
        res.json(idea)
   } catch (error) {
    res.send({e:error.message});
   }
})


//for getting ideas for approve by reviewer
router.get('/verify/:id',async(req , res)=>{
    try {
        const id = req.params.id;
        const ideas= await IdeaModel.find({reviewedBy:id});
        if(!ideas) return res.status(404).send("no data found");
        res.json(ideas);
    } catch (error) {
        console.log({e:error.message})
    }
})


router.post('/' ,ideaFileStorage.single("ideafile") ,async (req , res)=>{
    try {
    const ChallengeId = req.body.Challengeid
    const title = req.body.title
    const solution =req.body.solution
    const filename = req.file ? req.file.filename : null
    const path = req.file ? req.file.path : null;
    const submittedBy  = req.body.user_id
    const reviewedBy = req.body.reviewer_id
    const status =req.body.status
    const Likes = req.body.likes
    const Comment =req.body.comments?[req.body.comments] : []
    const feedback =req.body.feedback || ""
    const createdByAt = req.body.createdByAt
    const tags = req.body.tags
    const updatedAt = req.body.updatedAt
 
    const uploadIdea = new IdeaModel({
        ChallengeId , title , solution , filename , path , submittedBy , reviewedBy, status , Likes , Comment , feedback, 
        createdByAt , updatedAt , tags})

        uploadIdea.save();
        return res.send(uploadIdea);
    } catch (error) {
        console.log({e:error.message})
    }
})

router.put('/:id',async(req , res)=>{
    try {
         const updated = await IdeaModel.findByIdAndUpdate(req.params.id,
            {feedback:req.body.feedback,
                status:req.body.status
            }
         )
          if(! updated) return  res.send("Idea Not Updated")
            res.json(updated);
    } catch (error) {
        console.log({e:error.message})
    }
})

router.get('/reviewedideas/:id' , async(req,res)=>{
    try {
        const id = req.params.id;
        const idea = await IdeaModel.find({reviewedBy:id , status: { $in: ["Approved", "Rejected"] }});
        if(! idea) return res.send("no ideas found")
            res.json(idea)
    } catch (error) {
        console.log({e:error.message})
    }
})

module.exports= router