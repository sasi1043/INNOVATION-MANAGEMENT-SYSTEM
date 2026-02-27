const mongoose=require("mongoose");

//For User Model
const UserSchema=new mongoose.Schema({
    name:{type:String , required:true , trim:true},
    email:{type:String , required:true , lowercase:true , unique:true,trim:true},
    role: {type:String, required:true , trim:true},
    department:{type:String , required : true},
    isActive:{type:Boolean,required:true},
    createdAt :{type:Date},
    lastLogin:{type:Date}
})

const UsersModel = mongoose.model("users",UserSchema);

//For Challenges Model
const challengeSchema = new mongoose.Schema({
  title: {type:String , required:true},
  description: {type:String ,required:true},
  startDate: {type :Date , required:true},
  endDate: {type :Date , required:true},
  createdBy: {type:String , required:true},   // reference to Users
  status: {type:String , required :true},        // active, closed, draft
  tags: {type: String},
  createdat: {type:Date},
  updatedAt: {type:Date}
})

const  challengeModel=mongoose.model("Challenges",challengeSchema);

//For Ideas Model

const ideaSchema = new mongoose.Schema({
    ChallengeId : {type:String ,required : true},
    title : {type:String , required: true},
    solution : {type : String , required : true},
    filename : {type : String},
    path : {type:String},
    submittedBy : {type: String , required:true},
    status : {type :String , required:true},
    reviewedBy:{type:String , required:true},
    Likes: {type:Number},
    tags:{type :String},
    feedback : {type:String },
    Comment :{type:Array},
    createdByAt:{type:String},
    updatedAt:{type : Date},
})

const IdeaModel = mongoose.model("Ideas" , ideaSchema);

//Exporting the Module With Created Models
module.exports = {UsersModel,
     challengeModel,
     IdeaModel
};