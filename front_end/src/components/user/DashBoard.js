import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext';
import axios from 'axios'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';


const API = process.env.REACT_APP_BACKEND_URL

function DashBoard({changePage}) {

  const {user , user_id}=useRoleContext()

  const [ideas , setIdeas] = useState([]);

   useEffect(() => {
      const load = async () => {
        try {
          const res = await axios.get(`${API}/ideas/${user_id}`)
          setIdeas(res.data)
        } catch (error) {
          console.log(error.message)
        }
      }
      if (user_id) load()
    }, [user_id])
      
    const{role}=useRoleContext(); 
    
         const dashBoardText= {
            user : "Here is an overview of Your Innovation Journey",
            admin : "System-wide analytics and insights",
            reviewer :"Review and evaluate innovation ideas"
     }

     const pendingIdeas = ideas.filter((p)=>p.status === "submitted");

     const ApprovedIdeas = ideas.filter(p=>p.status ==="Approved");

  return (
      <div className='bg-light vh-100'>
        <div className='text-start'>
            <h2 className='fw-bold'>Welcome Back ,{user}</h2>
            <p>{dashBoardText[role]}</p>
        </div>

         {/* Start of cards */}
        <div className='row mt-5'>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Ideas</h5>
              <h4 className='text-dark fw-bold'>{ideas.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Pending Reviews</h5>
              <h4 className='text-warning fw-bold'>{pendingIdeas.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Approved</h5>
              <h4 className='text-success fw-bold'>{ApprovedIdeas.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Likes</h5>
              <h4 className='text-danger fw-bold'>20</h4>
            </div>
             </div>
          </div>

        </div>
        {/* End of cards Row */}

        {/* Quick action sections */}
        <div className='row m-5 gx-4 p-3 border border-dark bg-light shadow-sm border-opacity-10'>
          <h4 className='text-start '>Quick Actions</h4>
          {/* submit idea column */}
          <div className=' mt-4 col-md-4  '>
             <div className='card-body p-4 h-100 text-start bg-primary rounded-4 text-white' style={{ cursor: "pointer" }} onClick={() => changePage("/ideasubmission")}>
                <TipsAndUpdatesOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>Submit New Idea</h5>
               <p className='opacity m-0'>Share Your Innovation</p>
             </div>
          </div>
          {/* My Ideas column */}
          <div className=' mt-4 col-md-4 '>
             <div className='card-body p-4 h-100 text-start bg-light rounded-4 border border-dark border-opacity-25' style={{ cursor: "pointer" }} onClick={() => changePage("/my-ideas")}>
                <AccessTimeOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>My Ideas</h5>
               <p className='opacity m-0'>Track Your Submissions</p>
             </div>
          </div>
          {/* Track Ideas column */}
          <div className=' mt-4 col-md-4 '>
             <div className='card-body h-100 p-4 text-start border border-dark border-opacity-25 rounded-4' style={{ cursor: "pointer" }} onClick={() => changePage("/approved-ideas")}>
                <TrendingUpOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>Explore Ideas</h5>
               <p className='opacity '>View Approved Ideas</p>
             </div>
          </div>
          
        </div>
        {/* end of quick section */}

        {/* displaying ideas */}
        <div className='container-fluid mt-2'>
          {/* heading  */}
          <h4 className='text-start'>Your Recent Ideas</h4>
          <div className='row g-3'>

              {ideas.map((p)=>(
                <div className='col-md-4' key={p._id}>
                  {/* Card for dispalying IDeas */}
                <div className=' mt-3 card border border-dark border-opacity-10'>
                  {/* Card header */}
                <div className='card-header d-flex justify-content-between'>
                  <h6 className='text-truncate'>{p.title}</h6>
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      p.status === "submitted"
                        ? "bg-secondary"
                        : p.status === "Approved"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                {/* Card-body */}
                   <div className="card-body">
                    <p className="small text-muted mb-2">
                      <strong>Tags:</strong> {p.tags}
                    </p>

                    <p className="card-text text-secondary text-truncate">
                      {p.solution}
                    </p>

                    {p.feedback && (
                      <div className="alert alert-light border small mt-3 mb-0">
                        <strong>Reviewer Feedback:</strong> {p.feedback}
                      </div>
                    )}
                  </div>

                 {/* Card Footer */}
                  <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      📅 {new Date(p.createdByAt).toLocaleDateString()}
                    </small>

                    {p.filename && (
                      <a
                        href={`${API}/${p.path}`}
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    )}
                  </div>
                  {/* end of card Footer */}
              </div>
              {/* End of Card */}
              </div>
              ))}
          </div>
        </div>
      </div>
  )
}

export default DashBoard
