import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import axios from 'axios';

import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { TipsAndUpdatesOutlined } from '@mui/icons-material';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import Chart from '../../charts/Chart';
import IdeasPerMonth from '../../charts/IdeasPerMonth';


const API = process.env.REACT_APP_BACKEND_URL

function ADashBoard({changePage}) {


  const {user_id , user} =useRoleContext();

  const[users, setUsers] = useState([]);
  const [Challenge,setChallenge] = useState([]);
  const [ideas , setIdeas] = useState([]);


  useEffect(() => {
    // for loading ideas
      const load = async () => {
        try {
          const res = await axios.get(`${API}/ideas`)
          setIdeas(res.data)
          console.log(res.data)
        } catch (error) {
          console.log(error.message)
        }
      }
      // for fetching all challenges
      const loadchallenge=async () =>{
        try {
           const fetch = await axios.get(`${API}/challenge`)
           setChallenge(fetch.data)
        } catch (error) {
          console.log({e:error.message})
        }
      }
      // for fetching all the users
      const loadUsers = async()=>{
        try {
           const userfetch = await axios.get(`${API}/user`);
           setUsers(userfetch.data);
        } catch (error) {
          console.log({e:error.message})
        }
      }  

    load();
    loadchallenge();
    loadUsers()
    }, [user_id]);
 
      const ApprovedIdeas = ideas.filter((p)=>p.status === "Approved")



  return (
    <div className='bg-light vh-100'>
      {/* for Welcome text */}
        <div className='text-start m-2 '>
            <h2 className='fw-bold'>Welcome Back , {user}</h2>
            <p className='opacity'>System-wide analytics and insights</p>
        </div>

        {/* Start of cards */}
        <div className='row mt-5'>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Users</h5>
              <h4 className='text-dark fw-bold'>{users.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Ideas</h5>
              <h4 className='text-warning fw-bold'>{ideas.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Approved Ideas</h5>
              <h4 className='text-success fw-bold'>{ApprovedIdeas.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-3'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Challenges</h5>
              <h4 className='text-danger fw-bold'>{Challenge.length}</h4>
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
             <div className='card-body p-4 h-100 text-start bg-primary rounded-4 text-white' style={{ cursor: "pointer" }} onClick={() => changePage("/usersmanagement")}>
                <GroupOutlinedIcon className='fs-1'/>
               <h5 className='mt-2'>Manage All Users</h5>
               <p className='opacity m-0'>{users.length} total users</p>
             </div>
          </div>
          {/* My Ideas column */}
          <div className=' mt-4 col-md-4 '>
             <div className='card-body p-4 h-100 text-start bg-light rounded-4 border border-dark border-opacity-25' style={{ cursor: "pointer" }} onClick={() => changePage("/ideasManagement")}>
                <TipsAndUpdatesOutlined className='fs-1'/>
               <h5 className='mt-2'>All Ideas</h5>
               <p className='opacity m-0'>Track Your Submissions</p>
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

          <div className="row m-4">
            <div className="col-md-6">
              <Chart ideas={ideas} />
            </div>

            <div className="col-md-6">
              <IdeasPerMonth ideas={ideas} />
            </div>
          </div>
        
         <div className="card shadow-sm rounded-4 m-4 p-3">
          <h5>Recent Ideas</h5>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ideas.slice(0,5).map((idea) => (
                <tr key={idea._id}>
                  <td>{idea.title}</td>
                  <td>{idea.status}</td>
                  <td>{idea.createdByAt.slice(0,10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
  )
}

export default ADashBoard
