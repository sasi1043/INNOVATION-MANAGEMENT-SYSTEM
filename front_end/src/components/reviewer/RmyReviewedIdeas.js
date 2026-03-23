import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useIdeaContext } from '../../context/IdeaContext'

const API = process.env.REACT_APP_BACKEND_URL

function RmyReviewedIdeas({ changePage }) {

  const { user_id } = useRoleContext()
  const [ideas, setIdeas] = useState([])
  const { CurrentIdea } = useIdeaContext()

  const [filterIdeas, setFilterIdeas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortFilter, setSortFilter] = useState("newest")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas/reviewedideas/${user_id}`)
        setIdeas(res.data)
        setFilterIdeas(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

  const handlechangePage = (p) => {
    CurrentIdea({ ...p, prevPage: "/assigned-ideas" })
    changePage("/view-idea")
  }

  // MAIN FILTER LOGIC (Search + Status + Sort Combined)
  useEffect(() => {
    let updated = [...ideas]

    // 🔍 Search filter
    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.solution?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "All") {
      updated = updated.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Sorting
    if (sortFilter === "newest") {
      updated.sort(
        (a, b) => new Date(b.createdByAt) - new Date(a.createdByAt)
      )
    } else if (sortFilter === "oldest") {
      updated.sort(
        (a, b) => new Date(a.createdByAt) - new Date(b.createdByAt)
      )
    }

    setFilterIdeas(updated)
  }, [searchTerm, statusFilter, sortFilter, ideas])

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

            {/* Search */}
            <div className="col-md-4">
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="col-md-4">
              <select
                className="form-select rounded-pill"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="col-md-4">
              <select
                className="form-select rounded-pill"
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/*  Count FIXED */}
      <p className="text-muted mb-3">
        Showing <strong>{filterIdeas.length}</strong> ideas
      </p>

      {/* Cards */}
      <div className="row g-4">
        {filterIdeas.length > 0 ? (
          filterIdeas.map((p) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={p._id}>
              <div
                className="card h-100 shadow-sm border-0"
                onClick={() => handlechangePage(p)}
              >

                {/* Header */}
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

                {/* Body */}
                <div className="card-body">
                  <p className="small text-muted mb-2">
                    <strong>Tags:</strong> {p.tags}
                  </p>

                  <p className="card-text text-muted">
                    {p.solution?.length > 200
                      ? `${p.solution.slice(0, 200)}...`
                      : p.solution}
                  </p>

                  {p.feedback && (
                    <div className="alert alert-light border small mt-3">
                      <strong>Feedback:</strong> {p.feedback}
                    </div>
                  )}
                </div>

                {/* Footer */}
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