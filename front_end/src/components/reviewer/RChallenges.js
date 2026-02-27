import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useIdeaContext } from '../../context/IdeaContext';
import { useRoleContext } from '../../context/RoleContext';

const API = process.env.REACT_APP_BACKEND_URL

function AChallenges({changePage}) {


    const[challenges ,setChallenge] =useState([]);
    const[filterChallenge , setFilterChallenge]=useState([])
    const {CurrentIdea} = useIdeaContext()

    const {user_id} = useRoleContext();

      useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/challenge/${user_id}`)
        setChallenge(res.data)
        setFilterChallenge(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
     load()
  }, [])


  function handleFilterChallenge(requirement) {
    if(requirement === "all") setFilterChallenge(challenges);
    if(requirement === "active") {
        const filter= challenges.filter((p)=>p.status === "active");
        setFilterChallenge(filter)
    }
    else if(requirement === "upcoming") {
        const filter = challenges.filter((p)=>p.status ==="upcoming");
        setFilterChallenge(filter)
    }
    else if(requirement === "closed"){
        const filter = challenges.filter((p)=>p.status ==="closed");
        setFilterChallenge(filter)
    }
    else if(requirement === "newest"){
        const sorted = [...challenges].sort(
       (a, b) => new Date(b.startDate) - new Date(a.startDate)
       );
       setFilterChallenge(sorted);
    }
    else if(requirement === "oldest"){
     const sorted = [...challenges].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
     setFilterChallenge(sorted);
    }
  }

    const handlechangePage = (p) => {
    CurrentIdea(p)
    changePage('/view-challenge')
  }

  return (
    <div className='bg-light vh-100'>
        {/* For Heading */}
        <div className='justify-content-center '>
            <h3 className='m-0 fw-bold'>My Challenges</h3>
            <p className='opacity mt-1'> manage your submitted Challenges</p>
        </div>
        {/* For Filter Section */}
        <div className='card border-0 shadow mt-4'>
            <div className='card-body'>
                <div className='row g-3'>
                    {/* search bar */}
                    <div className='col-md-4'>
                        <input className='form-control rounded-pill'  placeholder='Search Challenges'></input>
                    </div>
                    {/* status filter */}
                    <div className='col-md-4'>
                        <select onChange={(e)=>handleFilterChallenge(e.target.value)} className='form-select rounded-pill'>
                            <option value="all">All</option>
                            <option  value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option  value="upcoming">Upcoming</option>
                        </select>
                    </div>
                    {/* filter  by date*/}
                    <div className='col-md-4'>
                        <select onChange={(e)=>handleFilterChallenge(e.target.value)} className='form-select rounded-pill'>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
            {/* end of filter section */}
            
            {/* for showing the count */}
            <div className="mb-3 text-muted mt-2">
                Showing{" "}
                <strong>
                {challenges.length}
                </strong>{" "}
                of{" "}
                <strong>
                {challenges.length}
                </strong>
            </div>
            {/* End of Showing Count */}

            {/* Displaying Challenges */}
            <div className='row g-4'>
                {filterChallenge.map((p)=>(
                    <div className='col-md-4' key={p._id}>
                       <div className='card h-100 border-0 shadow-sm' style={{cursor:'pointer'}} onClick={() => handlechangePage(p)}>
                        {/* card header */}
                         <div className='card-header bg-white border-0 d-flex justify-content-between align-items-center'>
                            <strong className='text-start'>{p.title}</strong>
                            <div className={p.status === "active" ? "badge bg-success" : 
                                p.status==="closed"? "badge bg-danger" : "badge bg-primary"}> {p.status}</div>
                         </div>
                         {/* card-body */}
                         <div className="card-body">
                                <p className="small text-muted mb-2">
                                <strong>Tags:</strong> {p.tags}
                                </p>

                                <p className="card-text text-secondary text-truncate">
                                {p.description}
                                </p>

                                {p.feedback && (
                                <div className="alert alert-light border small mt-3 mb-0">
                                    <strong>Reviewer Feedback:</strong> {p.feedback}
                                </div>
                                )}
                            </div>
                            {/* end of card-body */}

                            {/* start of card footer */}
                            <div className='card-footer bg-white border-0 d-flex justify-content-between align-items-center'>
                                <small className='fw-bold'>Start Date :{p.startDate.slice(0,10)}</small>
                                <small className='fw-bold'>End Date :{p.endDate.slice(0,10)}</small>
                            </div>
                       </div>
                    </div>
                ))}
            </div>
      </div>
  )
}

export default AChallenges
