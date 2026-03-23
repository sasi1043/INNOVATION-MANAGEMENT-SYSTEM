import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useIdeaContext } from '../../context/IdeaContext'

const API = process.env.REACT_APP_BACKEND_URL

function RevaluateIdeas({ changePage }) {

  const { user_id } = useRoleContext()
  const [ideas, setIdeas] = useState([])
  const { CurrentIdea } = useIdeaContext()

  const [filteredIdeas, setFilteredIdeas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("submitted") // default pending
  const [sortFilter, setSortFilter] = useState("newest")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas/verify/${user_id}`)
        setIdeas(res.data)
        setFilteredIdeas(res.data)
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

  // Combined filter logic
  useEffect(() => {
    let updated = [...ideas]

    // Search
    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    setFilteredIdeas(updated)
  }, [ideas, searchTerm, statusFilter, sortFilter])

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

            {/* Status */}
            <div className="col-md-4">
              <select
                className="form-select rounded-pill"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="submitted">Submitted</option>
              </select>
            </div>

            {/* Sort */}
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
        Showing <strong>{filteredIdeas.length}</strong> ideas
      </p>
      {/* Cards */}
      <div className="row g-4">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map((p) => (
            <div className="col-xl-4 col-lg-6 col-md-6" key={p._id}>
              <div
                className="card h-100 shadow-sm border-0"
                role="button"
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
                  <p className="text-muted small mb-0">
                    {p.solution?.length > 180
                      ? `${p.solution.slice(0, 180)}...`
                      : p.solution}
                  </p>
                </div>

                {/* Footer */}
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
            <p>There are no ideas matching your filters.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default RevaluateIdeas
