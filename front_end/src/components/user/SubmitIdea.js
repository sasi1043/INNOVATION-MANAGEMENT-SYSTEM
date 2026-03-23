import { useEffect, useState } from "react"
import axios from 'axios';
import { useRoleContext } from "../../context/RoleContext";

const API = process.env.REACT_APP_BACKEND_URL;

function SubmitIdea() {

  const { user_id } = useRoleContext();

  const [reviewer_id, setReviewer_id] = useState("")
  const [cid, setCid] = useState("")
  const [challenge, setChallenge] = useState([]);

  const [title, setTitle] = useState("");

  const [form, setForm] = useState({
    Challengeid: "",
    solution: "",
    ideafile: null,
    user_id: "",
    status: "",
    tags: "",
    updatedAt: ""
  })

  async function load() {
    try {
      const res = await axios.get(`${API}/challenge`);
      setChallenge(res.data);
    } catch (error) {
      console.log({ e: error.message });
    }
  }

  useEffect(() => {
    load()
  }, []);

    async function addIdea(e) {
      e.preventDefault()

      if (form.ideafile) {
        const fileSizeMB = form.ideafile.size / (1024 * 1024);

        if (fileSizeMB > 10) {
          alert("File size should not exceed 10MB");
          return;
        }
      }

      const formData = new FormData();
      formData.append("Challengeid", cid);
      formData.append("title", title);
      formData.append("reviewer_id", reviewer_id);
      formData.append("solution", form.solution);
      formData.append("user_id", user_id);
      formData.append("status", "submitted");
      formData.append("tags", form.tags);
      formData.append("createdByAt", new Date().toISOString());
      formData.append("updatedAt", new Date().toISOString());

      if (form.ideafile) {
        formData.append("ideafile", form.ideafile);
      }

      const req = await axios.post(`${API}/ideas`, formData);

      alert("Idea Submitted")
      console.log(req.data);

      setForm({ Challengeid: "", solution: "", ideafile: null, tags: "" });
      setCid("");
      setTitle("");
    }

  const titleList = challenge.filter((p) => p.status === "active");

  return (
    <div className='w-100 h-100 bg-secondary bg-opacity-10'>
      <div className='justify-content-center align-items-center h-100 pb-4' style={{ paddingTop: "30px" }}>
        <div className='container bg-white w-75 h-100 w-md-50 border border-dark border-opacity-25 rounded-4'>
          <div className='m-3'>
            <h4 className='text-start'>Submit New Idea</h4>
            <p className="opacity text-start">Share your innovative idea with the organization</p>
          </div>

          <form onSubmit={addIdea} className="mb-2">

            {/* Title */}
            <div className="text-start m-3">
              <h5 className="d-flex">Title <p className="text-danger ms-1">*</p></h5>
              <select
                className="form-control mt-3"
                value={cid}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setCid(selectedId);

                  const selectedChallenge = challenge.find(c => c._id === selectedId);
                  setTitle(selectedChallenge?.title || "");
                  setReviewer_id(selectedChallenge?.createdBy || "")
                }}
              >
                <option value="">Select Challenge</option>
                {titleList.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Solution */}
            <div className="text-start m-3">
              <h5 className="d-flex">Solution<p className="text-danger ms-1">*</p></h5>
              <textarea
                className="form-control mt-3 border border-dark border-opacity-25"
                value={form.solution}
                placeholder="Describe your solution in detail."
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                rows="5"
                style={{ resize: "none" }}
                required
              ></textarea>
            </div>

            {/* Tags */}
            <div className="text-start m-3">
              <h5 className="d-flex">Tags <p className="opacity">(optional)</p></h5>
              <input
                className="form-control mt-3 border border-dark border-opacity-25"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>

            {/* File Upload */}
            <div className="text-start m-3">
              <h5 className="d-flex">File <p className="opacity">(optional)</p></h5>
              <input
                type="file"
                name="ideafile"
                accept=".pdf"
                className="form-control mt-3 border border-dark border-opacity-25"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    const fileSizeMB = file.size / (1024 * 1024);

                    if (fileSizeMB > 10) {
                      alert("File size should not exceed 10MB");
                      e.target.value = "";
                      return;
                    }

                    if (file.type !== "application/pdf") {
                      alert("Only PDF files are allowed");
                      e.target.value = "";
                      return;
                    }
                  }

                  setForm({ ...form, ideafile: file });
                }}
              />
            </div>

            <div>
              <button className="btn btn-primary mt-3 m-5">Submit</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitIdea