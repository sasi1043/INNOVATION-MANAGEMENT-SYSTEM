import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useIdeaContext } from '../../context/IdeaContext'

const API = process.env.REACT_APP_BACKEND_URL

function MyIdeas({ changePage }) {

  const { user_id } = useRoleContext()
  const { CurrentIdea } = useIdeaContext()

  const [ideas, setIdeas] = useState([])
  const [filterIdeas, setFilterIdeas] = useState([])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortType, setSortType] = useState("newest")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas/${user_id}`)
        setIdeas(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

  //  FILTER 
  useEffect(() => {
    let updated = [...ideas]

    // SEARCH
    if (search.trim() !== "") {
      updated = updated.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.toLowerCase().includes(search.toLowerCase()) ||
        p.solution.toLowerCase().includes(search.toLowerCase())
      )
    }

    //  STATUS FILTER
    if (statusFilter !== "All") {
      updated = updated.filter((p) => p.status === statusFilter)
    }

    //  SORTING
    if (sortType === "newest") {
      updated.sort((a, b) => new Date(b.createdByAt) - new Date(a.createdByAt))
    } else if (sortType === "oldest") {
      updated.sort((a, b) => new Date(a.createdByAt) - new Date(b.createdByAt))
    } else if (sortType === "likes") {
      updated.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } else if (sortType === "comments") {
      updated.sort((a, b) => (b.comments || 0) - (a.comments || 0))
    }

    setFilterIdeas(updated)

  }, [ideas, search, statusFilter, sortType])

  const handlechangePage = (p) => {
    CurrentIdea({ ...p, prevPage: "/my-ideas" })
    changePage("/view-idea")
  }

  return (
    <div className="container-fluid">

      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">My Ideas</h3>
        <p className="text-muted mb-0">
          Track and manage your submitted ideas
        </p>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="row g-3">

            {/* SEARCH */}
            <div className="col-md-4">
              <input
                className="form-control rounded-pill"
                placeholder="Search ideas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/*  STATUS */}
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

            {/*  SORT */}
            <div className="col-md-4">
              <select
                className="form-select rounded-pill"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="likes">Most Liked</option>
                <option value="comments">Most Commented</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Count */}
      <div className="mb-3 text-muted">
        Showing <strong>{filterIdeas.length}</strong> of <strong>{ideas.length}</strong>
      </div>

      {/* Cards */}
      <div className="row g-4">
        {filterIdeas.length > 0 ? (
          filterIdeas.map((p) => (
            <div className="col-md-4" key={p._id}>
              <div
                className="card h-100 border-0 shadow-sm"
                onClick={() => handlechangePage(p)}
                style={{ cursor: "pointer" }}
              >

                {/* Header */}
                <div className="card-header bg-white border-0 d-flex justify-content-between">
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

                {/* Body */}
                <div className="card-body">
                  <p className="small text-muted mb-2">
                    <strong>Tags:</strong> {p.tags}
                  </p>

                  <p className="card-text text-secondary">
                    {p.solution.length > 200
                      ? `${p.solution.slice(0, 200)}...`
                      : p.solution}
                  </p>

                  {p.feedback && (
                    <div className="alert alert-light border small mt-3">
                      <strong>Reviewer Feedback:</strong> {p.feedback}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                  <small className="text-muted">
                    📅 {new Date(p.createdByAt).toLocaleDateString()}
                  </small>

                  {p.filename && (
                    <a
                      href={`${API}/${p.path}`}
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
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