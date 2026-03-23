import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

const API=process.env.REACT_APP_BACKEND_URL

function RDashBoard({changePage}) {

  const {user_id,user} = useRoleContext()

  const [ ideas ,setIdeas]=useState([]);
  const [challenge , setChallenge] = useState([])


    useEffect(() => {
      const load = async () => {
        try {
          const res = await axios.get(`${API}/ideas/verify/${user_id}`)
          setIdeas(res.data)
          console.log(res.data)
        } catch (error) {
          console.log(error.message)
        }
      }
      const loadchallenge=async () =>{
        try {
           const fetch = await axios.get(`${API}/challenge/${user_id}`)
           setChallenge(fetch.data)
        } catch (error) {
          console.log({e:error.message})
        }
      }
      if (user_id) load();
      if(user_id)  loadchallenge()
    }, [user_id]);
  console.log(challenge)

    // getting counts for displaying in the dashBoard
    const challenges = challenge.filter((p)=> p.createdBy === user_id);
    
    const pendingIdeas = ideas.filter((p)=>p.status === "submitted")

    const ApprovedIdeas = ideas.filter((p)=>p.status === "Approved");

    const ReviewedIeas = ideas.filter((p)=>p.status !== "submitted")



  return (
    <div className='bg-light vh-100'>
        <div className='text-start m-4'>
            <h2 className='fw-bold'>Welcome Back , {user}</h2>
        </div>
        {/* Start of cards */}
        <div className='row mt-5'>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Challenges</h5>
              <h4 className='text-dark fw-bold'>{challenges.length}</h4>
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
              <h5>Reviewed Ideas</h5>
              <h4 className='text-danger fw-bold'>{ReviewedIeas.length}</h4>
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
             <div className='card-body p-4 h-100 text-start bg-warning rounded-4 text-white' style={{ cursor: "pointer" }} onClick={() => changePage("/evaluate")}>
                <AccessTimeOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>Pending Reviews</h5>
               <p className='opacity m-0'>Share Your Innovation</p>
               <p className='opacity m-0'>{pendingIdeas.length} ideas Pending</p>
             </div>
          </div>
          {/* My Ideas column */}
          <div className=' mt-4 col-md-4 '>
             <div className='card-body p-4 h-100 text-start bg-light rounded-4 border border-dark border-opacity-25' style={{ cursor: "pointer" }} onClick={() => changePage("/assigned-ideas")}>
                <DescriptionOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>Review History</h5>
               <p className='opacity m-0'>{ReviewedIeas.length} Reviews completed</p>
             </div>
          </div>
          {/* Track Ideas column */}
          <div className=' mt-4 col-md-4 '>
             <div className='card-body h-100 p-4 text-start border border-dark border-opacity-25 rounded-4' style={{ cursor: "pointer" }} onClick={() => changePage("/approved-ideas")}>
                <TaskAltOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>Approved Ideas</h5>
               <p className='opacity '>View Approved Ideas</p>
             </div>
          </div>
          
        </div>
        {/* end of quick section */}

        {/* Displaying Ideas Awaiting for Reviews */}
        <div className='container-fluid mt-2'>
          {/* heading  */}
          <h4 className='text-start'>Ideas Awaiting Review</h4>
          <div className='row g-3'>

              {pendingIdeas.map((p)=>(
                <div className='col-md-4' key={p._id}>
                  {/* Card for dispalying IDeas */}
                <div className=' mt-3 card border border-dark border-opacity-25'>
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

export default RDashBoard
