import React, { useEffect, useState } from 'react'
import { useIdeaContext } from '../../context/IdeaContext'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axios from 'axios';
import Button from '@mui/material/Button';

const API = process.env.REACT_APP_BACKEND_URL

function VerifyIdeas() {

  const { currIdea } = useIdeaContext();

  const formatted = new Date(currIdea.createdByAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [form,setForm]=useState({feedback:"" , status:""});

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

    const ideaID = currIdea._id;
    
async function handleUpdate(id ,status) {
  try {

    if (!form.feedback) {
    alert("Please provide feedback before approving/rejecting.");
    return;
  }


    const req = await axios.put(`${API}/ideas/${id}`, {
      feedback: form.feedback,
      status: status
    });
    console.log(req.data);

     alert(``)

    // Reset the form after successful update
    setForm({
      feedback: "",
      status: ""
    });
  } catch (error) {
    console.error("Error updating idea:", error);
  }
}

  return (
    <div className="min-vh-100 bg-secondary bg-opacity-10">
      <div className="container py-4">

        {/* Back */}
        <div className="d-flex align-items-center gap-2 mb-4 text-secondary text-start">
          <KeyboardBackspaceIcon />
          <span className="fw-semibold">Back</span>
        </div>

        {/* Header */}
        <div className="mb-4 text-start">
          <h2 className="fw-bold text-start">Review Idea</h2>
          <p className="text-muted text-start">
            Evaluate and provide feedback on this innovation idea
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-4 shadow-sm p-4 text-start">

          {/* Title */}
          <h4 className="fw-bold mb-2 text-start">
            {currIdea.title}
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
          <div className="text-start">
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
          </div>
          <form>
          <div className='text-start mt-4'>
            <h5 className='d-flex'>FeedBack <p className='text-danger'> *</p></h5>
            <p className='opacity'>Provide detailed feedback to help the author understand your decision</p>
            <textarea className='form-control m-0' rows={3} placeholder='Share Your FeedBack' value={form.feedback} onChange={(e)=>setForm({...form,feedback:e.target.value})} required></textarea>
          </div>

          <div className='row mt-3 gap-2 justify-content-center'>
            <h5> Approve or Reject Idea</h5>
          <Button variant="contained" type='button'  onClick={() => handleUpdate(ideaID, "Approved")} className='col-md-5 bg-success'>Approve</Button>
          <Button variant="contained" type='button' onClick={() => handleUpdate(ideaID, "Rejected")} className='col-md-5 bg-danger'>Reject</Button>

          </div>
          </form>

        </div>

        <div className="m-1 mt-4 border border-dark border-opacity-10 bg-white p-3 rounded-4 text-start">
          <h5>Review Guidelines</h5>
          <p className='opacity'>• Be objective and constructive in your feedback</p>
          <p className='opacity'>• Consider the strategic alignment with organizational goals</p>
          <p className='opacity'>• Evaluate resource requirements and implementation complexity</p>
          <p className='opacity'>• Provide actionable suggestions for improvement when applicable</p>
        </div>
      </div>
    </div>
  )
}

export default VerifyIdeas