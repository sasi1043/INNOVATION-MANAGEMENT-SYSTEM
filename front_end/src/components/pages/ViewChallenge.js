import React, { useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useIdeaContext } from '../../context/IdeaContext'
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL

function ViewChallenge({changePage}) {


  const {currIdea} =useIdeaContext();

      const formatted = new Date(currIdea.updatedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  
  const [createdBy , setCreatedBy] = useState(null)

    useEffect(() => {
      async function loadUser() {
        try {
     if (!currIdea?.createdBy) return;
          const res = await axios.get(
            `${API}/user/${currIdea.createdBy}`
          );
          setCreatedBy(res.data);
        } catch (error) {
          console.log("API error:", error.message);
        }
      }

      loadUser();
    }, [currIdea?.createdBy]);

    function handlePage(){
        changePage('/my-ideas');
    }


  return (
     <div className="min-vh-100 bg-secondary bg-opacity-10">
      <div className="container py-4">

        {/* Back */}
        <div className="d-flex align-items-center gap-2 mb-4 text-secondary text-start">
          <KeyboardBackspaceIcon />
          <span className="fw-semibold" onClick={handlePage} style={{cursor:'pointer'}}>Back</span>
        </div>

        {/* Header */}
        <div className="mb-4 text-start">
          <h2 className="fw-bold text-start">Challenge Details</h2>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-4 shadow-sm p-4 text-start">

          {/* Title */}
          <h4 className="fw-bold mb-2 text-start  d-flex justify-content-between">
            {currIdea.title}
            <span
                    className={`badge rounded-pill px-3 py-2 ${
                      currIdea.status === "active"
                        ? "bg-success"
                        : currIdea.status === "upcoming"
                        ? "bg-primary"
                        : "bg-danger"
                    }`}
                  >
                    {currIdea.status}
                  </span>
          </h4>

          {/* Meta */}
          <div className="d-flex flex-wrap gap-3 text-muted mb-4 text-start">
            <span>By <strong>{createdBy?.name}</strong></span>
            <span>Submitted on {formatted}</span>
          </div>

          {/* Solution */}
          <div className="mb-4 text-start">
            <h5 className="fw-semibold text-start">Description</h5>
            <p className="mt-2 text-start">{currIdea.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-4 text-start">
            <h5 className="fw-semibold text-start">Tags</h5>
            <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill">
              {currIdea.tags}
            </span>
          </div>

          {/* File Viewer */}
          <div className="d-flex justify-content-between">
            <h6>Start Date : {currIdea.startDate.slice(0,10)}</h6>
            <h6>End Date : {currIdea.endDate.slice(0,10)}</h6>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ViewChallenge
