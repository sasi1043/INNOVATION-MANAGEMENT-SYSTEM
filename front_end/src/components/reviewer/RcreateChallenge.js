import {  useState } from "react"
import axios from 'axios';
import { useRoleContext } from "../../context/RoleContext";

const API=process.env.REACT_APP_BACKEND_URL


function RcreateChallenge() {

    
        // Using User if 
        const {user_id}= useRoleContext();
        

    
         //For storing idea details for giving request
         const[form , setForm]=useState({title:"",
            description:"",
            user_id:"",
            startDate:"",
            endDate:"",
            tags:""})
    
    
         async function addIdea(e) {
            e.preventDefault()
           const payload = {
                title: form.title,
                description: form.description,
                user_id: user_id,
                startDate: form.startDate,
                endDate: form.endDate,
                tags: form.tags,
                updatedAt: new Date().toISOString()
                };

                const req = await axios.post(`${API}/challenge`, payload);
    
    
      console.log(req.data);
    
      setForm({ title:"", description:"", startDate:"",tags:"", endDate:"" });
    }

  return (
    <div className='w-100 h-100 bg-secondary bg-opacity-10'>
      <div className=' justify-content-center align-items-center h-100 pb-4'style={{paddingTop:"30px"}} >
            <div className='container bg-white w-75 h-100 w-md-50 border border-dark border-opacity-25 rounded-4'>
                <div className='m-3'>
                    <h4 className='text-start'>Create New Challenge</h4>
                    <p className="opacity text-start">Create a challenge to invite innovative solutions.</p>
                </div>
                {/* For Title */}
                <form onSubmit={addIdea}>
                <div className="text-start mt-4 ms-3">
                    <h5 className="d-flex">Title<p className="text-danger ms-1">*</p></h5>
                    <input className="form-control border border-dark border-opacity-25" placeholder="Enter challenge title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required></input>
                </div>
                {/* For Creating Description */}
                <div className="text-start mt-4 ms-3">
                    <h5 className="d-flex">Description <p className="text-danger ms-1">*</p></h5>
                    <textarea class="form-control  border border-dark border-opacity-25" value={form.description} placeholder="Describe your solution in detail." onChange={(e)=>setForm({...form,description:e.target.value})} rows="5" style={{resize: "none"}} required></textarea>
                </div>
                <div className="text-start mt-4 ms-3 ">
                    <h5 className="d-flex">Tags <p className="opacity">(optional)</p></h5>
                    <input className="form-control border border-dark border-opacity-25" value={form.tags} onChange={(e)=>setForm({...form,tags:e.target.value})}></input>
                </div>
                    <div className="row mt-3 m-1">
                        <div className="col-md-6">
                        <h6 className="form-label">Start Date</h6>
                        <input type="date" className="form-control" value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})}/>
                        </div>

                        <div className="col-md-6">
                        <h6 className="form-label">End Date</h6>
                        <input type="date" className="form-control" value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})}/>
                        </div>
                        </div>
                <div>
                    <button  className="btn btn-primary mt-3">Submit</button>
                </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default RcreateChallenge
