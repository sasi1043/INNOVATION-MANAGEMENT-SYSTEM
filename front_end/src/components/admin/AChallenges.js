import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useIdeaContext } from '../../context/IdeaContext';

const API = process.env.REACT_APP_BACKEND_URL

function AChallenges({ changePage }) {

  const [challenges, setChallenge] = useState([]);
  const [filterChallenge, setFilterChallenge] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");

  const { CurrentIdea } = useIdeaContext()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/challenge`)
        setChallenge(res.data)
        setFilterChallenge(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    load()
  }, [])

  const handlechangePage = (p) => {
    CurrentIdea({ ...p, prevPage: '/challengesManagement' })
    changePage('/view-challenge');
  }

  //  Combined filter logic
  useEffect(() => {
    let updated = [...challenges]

    // Search
    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      updated = updated.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Sorting
    if (sortFilter === "newest") {
      updated.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      )
    } else if (sortFilter === "oldest") {
      updated.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      )
    }

    setFilterChallenge(updated)
  }, [searchTerm, statusFilter, sortFilter, challenges])

  return (
    <div className='bg-light vh-100'>

      {/* Heading */}
      <div className='justify-content-center '>
        <h3 className='m-0 fw-bold'>Challenges</h3>
        <p className='opacity mt-1'>Manage All Challenges In the System</p>
      </div>

      {/* Filter Section */}
      <div className='card border-0 shadow mt-4'>
        <div className='card-body'>
          <div className='row g-3'>

            {/* Search */}
            <div className='col-md-4'>
              <input
                className='form-control rounded-pill'
                placeholder='Search Challenges'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className='col-md-4'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='form-select rounded-pill'
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            {/* Sort */}
            <div className='col-md-4'>
              <select
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
                className='form-select rounded-pill'
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Count FIXED */}
      <div className="mb-3 text-muted mt-2">
        Showing <strong>{filterChallenge.length}</strong> of{" "}
        <strong>{challenges.length}</strong>
      </div>

      {/* Cards */}
      <div className='row g-4'>
        {filterChallenge.length > 0 ? (
          filterChallenge.map((p) => (
            <div className='col-md-4' key={p._id}>
              <div
                className='card h-100 border-0 shadow-sm'
                style={{ cursor: 'pointer' }}
                onClick={() => handlechangePage(p)}
              >

                {/* Header */}
                <div className='card-header bg-white border-0 d-flex justify-content-between align-items-center'>
                  <strong className='text-start'>{p.title}</strong>
                  <div className={
                    p.status === "active" ? "badge bg-success" :
                      p.status === "closed" ? "badge bg-danger" : "badge bg-primary"
                  }>
                    {p.status}
                  </div>
                </div>

                {/* Body */}
                <div className="card-body">
                  <p className="small text-muted mb-2">
                    <strong>Tags:</strong> {p.tags}
                  </p>

                  <p className="card-text text-secondary text-truncate">
                    {p.description}
                  </p>

                  {p.feedback && (
                    <div className="alert alert-light border small mt-3 mb-0">
                      <strong>Reviewer Feedback:</strong> {p.feedback}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className='card-footer bg-white border-0 d-flex justify-content-between align-items-center'>
                  <small className='fw-bold'>
                    Start Date : {p.startDate?.slice(0, 10)}
                  </small>
                  <small className='fw-bold'>
                    End Date : {p.endDate?.slice(0, 10)}
                  </small>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted mt-5">
            <h5>No challenges found</h5>
          </div>
        )}
      </div>

    </div>
  )
}

export default AChallenges