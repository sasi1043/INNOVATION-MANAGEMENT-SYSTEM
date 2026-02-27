import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useIdeaContext } from '../../context/IdeaContext'

const API = process.env.REACT_APP_BACKEND_URL

function MyIdeas({changePage}) {

  const { user_id } = useRoleContext()
  const [ideas, setIdeas] = useState([]);

  const [filterIdeas ,  setFilterIdeas] = useState([])

  const {CurrentIdea} =  useIdeaContext()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas/${user_id}`)
        setIdeas(res.data)
        setFilterIdeas(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

    const handlechangePage = (p) => {
    CurrentIdea(p)
    changePage('/view-idea')
  }

  function handleFilter(requirement) {
    if(requirement === "All") setFilterIdeas(ideas);
    else if(requirement ==="Approved"){
      const filter = ideas.filter((p)=> p.status ==="Approved");
      setFilterIdeas(filter)
    }
    else if(requirement ==="submitted"){
      const filter = ideas.filter((p)=> p.status ==="submitted");
      setFilterIdeas(filter)
    }
    else if(requirement ==="Rejected"){
      const filter = ideas.filter((p)=> p.status ==="Rejected");
      setFilterIdeas(filter)
    }
     else if(requirement === "newest"){
        const sorted = [...ideas].sort(
       (a, b) => new Date(b.createdByAt) - new Date(a.createdByAt)
       );
       setFilterIdeas(sorted);
    }
    else if(requirement === "oldest"){
     const sorted = [...ideas].sort(
    (a, b) => new Date(a.createdByAt) - new Date(b.createdByAt)
    );
     setFilterIdeas(sorted);
    }
  }

  return (
    <div className="container-fluid">

      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">My Ideas</h3>
        <p className="text-muted mb-0">
          Track and manage your submitted ideas
        </p>
      </div>

      {/* Filter Section */}
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                className="form-control rounded-pill"
                placeholder="Search ideas..."
              />
            </div>

            <div onChange={(e)=>handleFilter(e.target.value)} className="col-md-4">
              <select className="form-select rounded-pill">
                <option value="All">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-md-4">
              <select onChange={(e)=>handleFilter(e.target.value)} className="form-select rounded-pill">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option>Most Liked</option>
                <option>Most Commented</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="mb-3 text-muted">
        Showing <strong>{ideas.length}</strong> of <strong>{ideas.length}</strong>
      </div>

      {/* Ideas Grid */}
      <div className="row g-4">
        {filterIdeas.length > 0 ? (
          filterIdeas.map((p) => (
            <div className="col-md-4" key={p._id}>
              <div className="card h-100 border-0 shadow-sm" onClick={() => handlechangePage(p)}>

                {/* Card Header */}
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-semibold text-truncate">
                    {p.title}
                  </h6>

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

                {/* Card Body */}
                <div className="card-body">
                  <p className="small text-muted mb-2">
                    <strong>Tags:</strong> {p.tags}
                  </p>

                  <p className="card-text text-secondary">
                    {p.solution.length > 200
                      ? `${p.solution.slice(0, 200)}...`
                      : p.solution}
                  </p>

                  {/* Feedback */}
                  {p.feedback && (
                    <div className="alert alert-light border small mt-3">
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

              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-5">
            <h6>No ideas found</h6>
          </div>
        )}
      </div>

    </div>
  )
}

export default MyIdeas