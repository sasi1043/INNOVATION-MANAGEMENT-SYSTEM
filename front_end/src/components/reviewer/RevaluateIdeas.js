import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useIdeaContext } from '../../context/IdeaContext'

const API =process.env.REACT_APP_BACKEND_URL

function RevaluateIdeas({ changePage }) {

  const { user_id } = useRoleContext()
  const [ideas, setIdeas] = useState([])
  const { CurrentIdea } = useIdeaContext()
  console.log(CurrentIdea);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas/verify/${user_id}`)
        setIdeas(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

  const handlechangePage = (p) => {
    CurrentIdea(p)
    changePage('/verify-ideas')
  }

  const ideasFilter = ideas.filter((p)=>p.status === "submitted")

  return (
    <div className="container-fluid">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Pending Ideas</h2>
        <p className="text-muted">Track and manage ideas awaiting review</p>
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
      <p className="text-muted mb-3">
        Showing <strong>{ideas.length}</strong> ideas
      </p>

      {/* Cards */}
      <div className="row g-4">
        {ideas.length > 0 ? (
          ideasFilter.map((p) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={p._id}>
              <div
                className="card h-100 shadow-sm border-0"
                role="button"
                onClick={() => handlechangePage(p)}
              >

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
                  <p className="text-muted small mb-0">
                    {p.solution.length > 180
                      ? `${p.solution.slice(0, 180)}...`
                      : p.solution}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center small text-muted">
                  <span>
                    📅 {new Date(p.createdByAt).toLocaleDateString()}
                  </span>

                  <span className="text-primary fw-semibold">
                    Review →
                  </span>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted mt-5">
            <h5>No ideas found</h5>
            <p>There are no ideas pending review.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default RevaluateIdeas