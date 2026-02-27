import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'

const API = process.env.REACT_APP_BACKEND_URL


function AIdeas() {

    const { user_id } = useRoleContext()
    const [ideas, setIdeas] = useState([])
  
    useEffect(() => {
      const load = async () => {
        try {
          const res = await axios.get(`${API}/ideas`)
          setIdeas(res.data)
        } catch (error) {
          console.log(error.message)
        }
      }
      if (user_id) load()
    }, [user_id])

  return (
    <div className="container-fluid">

      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">All Ideas</h3>
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

            <div className="col-md-4">
              <select className="form-select rounded-pill">
                <option>All Status</option>
                <option>Submitted</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="col-md-4">
              <select className="form-select rounded-pill">
                <option>Newest First</option>
                <option>Oldest First</option>
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
        {ideas.length > 0 ? (
          ideas.map((p) => (
            <div className="col-md-4" key={p._id}>
              <div className="card h-100 border-0 shadow-sm">

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

export default AIdeas
