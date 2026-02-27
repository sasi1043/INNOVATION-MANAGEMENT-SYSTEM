import React, { useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useIdeaContext } from '../../context/IdeaContext'
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL

function ViewIdeas({changePage}) {

    const {currIdea} =useIdeaContext();

      const formatted = new Date(currIdea.createdByAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  
  const [ideaSubmittedBy, setIdeaSubmittedBy] = useState(null)

    useEffect(() => {
      async function loadUser() {
        try {
          if (!currIdea?.submittedBy) return;

          const res = await axios.get(
            `${API}/user/${currIdea.submittedBy}`
          );
          setIdeaSubmittedBy(res.data);
        } catch (error) {
          console.log("API error:", error.message);
        }
      }

      loadUser();
    }, [currIdea?.submittedBy]);

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
          <h2 className="fw-bold text-start">Idea Details</h2>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-4 shadow-sm p-4 text-start">

          {/* Title */}
          <h4 className="fw-bold mb-2 text-start  d-flex justify-content-between">
            {currIdea.title}
            <span
                    className={`badge rounded-pill px-3 py-2 ${
                      currIdea.status === "submitted"
                        ? "bg-secondary"
                        : currIdea.status === "Approved"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {currIdea.status}
                  </span>
          </h4>

          {/* Meta */}
          <div className="d-flex flex-wrap gap-3 text-muted mb-4 text-start">
            <span>By <strong>{ideaSubmittedBy?.name}</strong></span>
            <span>Submitted on {formatted}</span>
          </div>

          {/* Solution */}
          <div className="mb-4 text-start">
            <h5 className="fw-semibold text-start">Solution</h5>
            <p className="mt-2 text-start">{currIdea.solution}</p>
          </div>

          {/* Tags */}
          <div className="mb-4 text-start">
            <h5 className="fw-semibold text-start">Tags</h5>
            <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill">
              {currIdea.tags}
            </span>
          </div>

          {/* File Viewer */}
          {currIdea.path && <div className="text-start">
            <h5 className="fw-semibold mb-2 text-start">
              Attached File
            </h5>
            <div className="border rounded-3 overflow-hidden">
              <iframe
                src={`${API}/${currIdea.path}`}
                className="w-100"
                style={{ height: "450px" }}
                title="PDF Viewer"
              />
            </div>
          </div>}

          {currIdea.feedback && <div className="text-start">
            <h5 className="fw-bold mt-2 text-start">
              FeedBack
            </h5>
            <span className='badge bg-secondary bg-opacity-10 text-dark px-3 py-2 m-2'>{currIdea.feedback}</span>
            </div>}
          

        </div>

      </div>
    </div>
  )
}

export default ViewIdeas
