import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'

const API = process.env.REACT_APP_BACKEND_URL

function RmyReviewedIdeas() {

  const { user_id } = useRoleContext()
  const [ideas, setIdeas] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas/reviewedideas/${user_id}`)
        setIdeas(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

  return (
    <div className="container-fluid">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Review History</h2>
        <p className="text-muted">Ideas you have reviewed</p>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Search ideas..."
              />
            </div>

            <div className="col-md-4">
              <select className="form-select rounded-pill">
                <option>All Status</option>
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
      <p className="text-muted mb-3">
        Showing <strong>{ideas.length}</strong> ideas
      </p>

      {/* Cards */}
      <div className="row g-4">
        {ideas.length > 0 ? (
          ideas.map((p) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={p._id}>
              <div className="card h-100 shadow-sm border-0">

                {/* Card Header */}
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <h6 className="fw-semibold text-truncate mb-0">
                    {p.title}
                  </h6>

                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      p.status === "Approved"
                        ? "bg-success"
                        : p.status === "Rejected"
                        ? "bg-danger"
                        : "bg-secondary"
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

                  <p className="card-text text-muted">
                    {p.solution.length > 200
                      ? `${p.solution.slice(0, 200)}...`
                      : p.solution}
                  </p>

                  {p.feedback && (
                    <div className="alert alert-light border small mt-3">
                      <strong>Feedback:</strong> {p.feedback}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center small text-muted">
                  <span>
                    📅 {new Date(p.createdByAt).toLocaleDateString()}
                  </span>

                  {p.filename && (
                    <a
                      href={`/${p.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary rounded-pill"
                    >
                      View File
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted mt-5">
            <h5>No ideas found</h5>
            <p>You haven’t reviewed any ideas yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RmyReviewedIdeas