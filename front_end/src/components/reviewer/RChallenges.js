import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useIdeaContext } from '../../context/IdeaContext';
import { useRoleContext } from '../../context/RoleContext';

const API = process.env.REACT_APP_BACKEND_URL

function RChallenges({ changePage }) {

  const [challenges, setChallenge] = useState([]);
  const [filterChallenge, setFilterChallenge] = useState([]);

  //  NEW STATES
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const { CurrentIdea } = useIdeaContext()
  const { user_id } = useRoleContext();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/challenge/${user_id}`)
        setChallenge(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    if (user_id) load()
  }, [user_id])

  // ✅ MAIN FILTER LOGIC (SEARCH + STATUS + SORT COMBINED)
  useEffect(() => {
    let data = [...challenges];

    // 🔍 SEARCH
    if (search.trim() !== "") {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📌 STATUS
    if (status !== "all") {
      data = data.filter((p) => p.status === status);
    }

    // 🔃 SORT
    if (sort === "newest") {
      data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sort === "oldest") {
      data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    setFilterChallenge(data);

  }, [challenges, search, status, sort]);

  const handlechangePage = (p) => {
    CurrentIdea({ ...p, prevPage: '/ideasManagement' })
    changePage('/view-idea')
  }

  return (
    <div className='bg-light vh-100'>

      {/* Heading */}
      <div className='justify-content-center'>
        <h3 className='m-0 fw-bold'>My Challenges</h3>
        <p className='opacity mt-1'> manage your submitted Challenges</p>
      </div>

      {/* Filter Section */}
      <div className='card border-0 shadow mt-4'>
        <div className='card-body'>
          <div className='row g-3'>

            {/* 🔍 SEARCH */}
            <div className='col-md-4'>
              <input
                className='form-control rounded-pill'
                placeholder='Search Challenges'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* 📌 STATUS */}
            <div className='col-md-4'>
              <select
                className='form-select rounded-pill'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            {/* 🔃 SORT */}
            <div className='col-md-4'>
              <select
                className='form-select rounded-pill'
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Count */}
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
                      p.status === "closed" ? "badge bg-danger" :
                        "badge bg-primary"
                  }>
                    {p.status}
                  </div>
                </div>

                {/* Body */}
                <div className="card-body">
                  <p className="small text-muted mb-2">
                    <strong>Tags:</strong> {p.tags}
                  </p>

                  <p className="card-text text-secondary">
                    {p.description.length > 120
                      ? `${p.description.slice(0, 120)}...`
                      : p.description}
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
                    Start Date: {p.startDate?.slice(0, 10)}
                  </small>
                  <small className='fw-bold'>
                    End Date: {p.endDate?.slice(0, 10)}
                  </small>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-5">
            <h6>No challenges found</h6>
          </div>
        )}
      </div>

    </div>
  )
}

export default RChallenges