import React, { useState } from 'react'
import logo from './images/Screenshot 2026-02-05 121320.png'
import { useRoleContext } from '../../context/RoleContext'

// Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'

// Pages
import DashBoard from '../user/DashBoard'
import SubmitIdea from '../user/SubmitIdea'
import ApprovedIdeas from '../user/ApprovedIdeas'
import MyIdeas from '../user/MyIdeas'
import RDashBoard from '../reviewer/RDashBoard'
import RcreateChallenge from '../reviewer/RcreateChallenge'
import RevaluateIdeas from '../reviewer/RevaluateIdeas'
import RmyReviewedIdeas from '../reviewer/RmyReviewedIdeas'
import VerifyIdeas from '../reviewer/VerifyIdeas'
import AChallenges from '../admin/AChallenges'
import ADashBoard from '../admin/ADashBoard'
import AIdeas from '../admin/AIdeas'
import UserManagement from '../admin/UserManagement'
import ViewIdeas from './ViewIdeas'
import ViewChallenge from './ViewChallenge'

function Home() {

  const { user, role, handlelogout } = useRoleContext()

  const getDefaultPage = (role) => {
    if (role === "reviewer") return "/reviewerdashboard"
    if (role === "admin") return "/admindashboard"
    return "/dashboard"
  }

  const [page, setPage] = useState(getDefaultPage(role))

  const ROLE_MENU = {
    admin: {
      features: [
        { label: "Dashboard", path: "/admindashboard", icon: HomeOutlinedIcon },
        { label: "Challenges", path: "/challengesManagement", icon: EventNoteOutlinedIcon },
        { label: "Ideas", path: "/ideasManagement", icon: PublishedWithChangesOutlinedIcon },
        { label: "User Management", path: "/usersmanagement", icon: PeopleOutlineIcon },
      ],
    },
    reviewer: {
      features: [
        { label: "Dashboard", path: "/reviewerdashboard", icon: HomeOutlinedIcon },
        { label: "Create Challenge", path: "/create-challenge", icon: AddCircleOutlineOutlinedIcon },
        { label: "Evaluate Ideas", path: "/evaluate", icon: StarsOutlinedIcon },
        { label: "My Reviewed Ideas", path: "/assigned-ideas", icon: FactCheckOutlinedIcon },
        { label: "Approved Ideas", path: "/approved-ideas", icon: PublishedWithChangesOutlinedIcon },
        { label: "Challenges", path: "/challengesManagement", icon: EventNoteOutlinedIcon }

      ],
    },
    user: {
      features: [
        { label: "Dashboard", path: "/dashboard", icon: HomeOutlinedIcon },
        { label: "Challenges", path: "/challengesManagement", icon: EventNoteOutlinedIcon },
        { label: "Submit Idea", path: "/ideasubmission", icon: ControlPointOutlinedIcon },
        { label: "My Ideas", path: "/my-ideas", icon: DescriptionOutlinedIcon },
        { label: "Approved Ideas", path: "/approved-ideas", icon: PublishedWithChangesOutlinedIcon },
      ],
    },
  }

  const menuList = ROLE_MENU[role]?.features || []

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">

        {/* Sidebar */}
        <div className="col-md-2 bg-white border-end shadow-sm d-flex flex-column p-0">

          {/* Logo */}
          <div className="d-flex align-items-center gap-2 p-3 border-bottom">
            <img src={logo} alt="logo" width="42" height="42" className="rounded" />
            <div>
              <h6 className="mb-0 fw-bold">IdeaHub</h6>
              <small className="text-muted">Innovation Platform</small>
            </div>
          </div>

          {/* Menu */}
          <div className="p-3 flex-grow-1">
            {menuList.map((item) => (
              <button
                key={item.label}
                onClick={() => setPage(item.path)}
                className={`btn w-100 mb-2 d-flex align-items-center gap-2 text-start rounded-3 
                ${page === item.path ? "btn-primary text-white" : "btn-outline-secondary"}`}
              >
                <item.icon fontSize="small" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Role */}
          <div className="text-center border-top p-3">
            <small className="text-muted">CURRENT ROLE</small>
            <h6 className="mb-0 text-uppercase">{role}</h6>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-0 d-flex flex-column">

          {/* Topbar */}
          <div className="bg-white border-bottom shadow-sm px-4 py-2 d-flex align-items-center justify-content-between">
            <input
              type="text"
              className="form-control w-50 rounded-pill"
              placeholder="Search ideas..."
            />

            <div className="d-flex align-items-center gap-3">
             <NotificationsIcon />
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: 32, height: 32 }}
                >
                  {user?.[0]}
                </div>
                <strong>{user?.toUpperCase()}</strong>
              </div>

              <button className="btn btn-sm btn-danger rounded-pill" onClick={handlelogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-grow-1 p-4 overflow-auto">

            {/* For Employees page */}
            {page === "/dashboard" && <DashBoard  changePage={setPage}/>}
            {page === "/ideasubmission" && <SubmitIdea />}
            {page === "/approved-ideas" && <ApprovedIdeas  changePage={setPage}/>}
            {page === "/my-ideas" && <MyIdeas changePage={setPage} />}
            {page === "/view-idea" && <ViewIdeas changePage={setPage}/>} 
            {page ==="/view-challenge" && <ViewChallenge changePage={setPage} />}

            {/* Reviewer Pages */}
            {page === "/reviewerdashboard" && <RDashBoard changePage={setPage} />}
            {page === "/create-challenge" && <RcreateChallenge  changePage={setPage}  />}
            {page === "/evaluate" && <RevaluateIdeas changePage={setPage} />}
            {page === "/assigned-ideas" && <RmyReviewedIdeas changePage={setPage} />}
            {page === "/verify-ideas" && <VerifyIdeas changePage={setPage} />}
            

            {/* For Admin Pages */}
            {page ==="/admindashboard" && <ADashBoard changePage={setPage}/>}
            {page === "/challengesManagement" && <AChallenges changePage={setPage}/>}
            {page === "/ideasManagement" && <AIdeas changePage={setPage}/>}
            {page === "/usersmanagement" && <UserManagement changePage={setPage}/>}

          </div>
        </div>

      </div>
    </div>
  )
}

export default Home