import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useIdeaContext } from '../../context/IdeaContext'

const API = process.env.REACT_APP_BACKEND_URL

function ApprovedIdeas({ changePage }) {

  const { user_id } = useRoleContext()
  const [ideas, setIdeas] = useState([])

  //  search
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])

  //  filter
  const [filterIdeas, setFilterIdeas] = useState([])

  const { CurrentIdea } = useIdeaContext()

  //  Load data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/ideas`)
        setIdeas(res.data)
        setFilterIdeas(res.data)
        setSearchResults(res.data) // important
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

  //  Page navigation
  const handlechangePage = (p) => {
    CurrentIdea({ ...p, prevPage: "/approved-ideas" })
    changePage("/view-idea")
  }

  //  FILTER (unchanged logic)
  function handleFilter(requirement) {
    if (requirement === "All") setFilterIdeas(ideas)

    else if (requirement === "Approved") {
      const filter = ideas.filter((p) => p.status === "Approved")
      setFilterIdeas(filter)
    }

    else if (requirement === "submitted") {
      const filter = ideas.filter((p) => p.status === "submitted")
      setFilterIdeas(filter)
    }

    else if (requirement === "Rejected") {
      const filter = ideas.filter((p) => p.status === "Rejected")
      setFilterIdeas(filter)
    }

    else if (requirement === "newest") {
      const sorted = [...filterIdeas].sort(
        (a, b) => new Date(b.createdByAt) - new Date(a.createdByAt)
      )
      setFilterIdeas(sorted)
    }

    else if (requirement === "oldest") {
      const sorted = [...filterIdeas].sort(
        (a, b) => new Date(a.createdByAt) - new Date(b.createdByAt)
      )
      setFilterIdeas(sorted)
    }
  }

  //  SEARCH (separate logic)
  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults(filterIdeas)
      return
    }

    const result = filterIdeas.filter((idea) =>
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.tags?.toLowerCase().includes(search.toLowerCase()) ||
      idea.solution?.toLowerCase().includes(search.toLowerCase())
    )

    setSearchResults(result)
  }, [search, filterIdeas])

  return (
    <div className="container-fluid">

      {/* Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Approved Ideas</h3>
        <p className="text-muted mb-0">
          Track and explore approved innovation ideas
        </p>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow mb-4">
        <div className="card-body">
          <div className="row g-3">

            {/*  Search */}
            <div className="col-md-4">
              <input
                className="form-control rounded-pill"
                placeholder="Search ideas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/*  Status */}
            <div className="col-md-4">
              <select
                onChange={(e) => handleFilter(e.target.value)}
                className="form-select rounded-pill"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="submitted">Submitted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/*  Sorting */}
            <div className="col-md-4">
              <select
                onChange={(e) => handleFilter(e.target.value)}
                className="form-select rounded-pill"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Count */}
      <div className="mb-3 text-muted">
        Showing{" "}
        <strong>
          {searchResults.filter(p => p.status === "Approved").length}
        </strong>{" "}
        results
      </div>

      {/* Cards */}
      <div className="row g-4">
        {searchResults.filter(p => p.status === "Approved").length > 0 ? (
          searchResults
            .filter(p => p.status === "Approved")
            .map((p) => (
              <div className="col-md-4" key={p._id}>
                <div
                  className="card h-100 border-0 shadow-sm"
                  onClick={() => handlechangePage(p)}
                >

                  {/* Header */}
                  <div className="card-header bg-white border-0 d-flex justify-content-between">
                    <h6 className="mb-0 fw-semibold text-truncate">
                      {p.title}
                    </h6>

                    <span className="badge bg-success rounded-pill px-3 py-2">
                      Approved
                    </span>
                  </div>

                  {/* Body */}
                  <div className="card-body">
                    <p className="small text-muted mb-2">
                      <strong>Tags:</strong> {p.tags}
                    </p>

                    <p className="card-text text-secondary text-truncate">
                      {p.solution}
                    </p>

                    {p.feedback && (
                      <div className="alert alert-light border small mt-3 mb-0">
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
            <h6>No approved ideas found</h6>
          </div>
        )}
      </div>

    </div>
  )
}

export default ApprovedIdeas