import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axios from 'axios';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';


// import for model 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

// imports for react dropdown in the edit pencil icon
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const API = process.env.REACT_APP_BACKEND_URL

function UserManagement() {

  // react menu for edit icon
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, user) => {
  setAnchorEl(event.currentTarget);
  setSelectedUser(user);
};
  const handleedit = () => {
    setAnchorEl(null);
  };
  const [selectedUser, setSelectedUser] = useState(null);
  // end of react menu 


  // model for creating user
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //  end of model constants

  // variables for storing the values of user to be added
  const [ form , setForm] =useState({name:"",email:"", department:"" , role:"",date:null});

  // variables for edit:
  const[editId , setEditId] =useState(null)
  const[editForm , setEditForm] =useState({name:"" ,email:"" , department:"" , role:"",isActive:null,date:null})
       


  // loading users after adding user
       async function load() {
         try {
        const res = await axios.get(`${API}/user`)
        setUsers(res.data);
      } catch (error) {
        console.log(error.message)
      }
     }
  
     async function addUser() {
        try {
           const res = await axios.post(`${API}/user`,
            {
              name:form.name,
              email:form.email,
              role:form.role,
              department:form.department,
              isActive:true,
              createdAt:form.date
            }
           )
           .then(()=>handleClose())
           .then(()=>load())
           .then(()=>console.log(res.data))
           .then(setForm({name:"",  role:"" , department:"" , email:"",date:""}))
           
        } catch (error) {
          console.log({e:error.message});
        }
     }
    // end of adding user function

    //  function for start editing user
    function startEdit(p){
      setEditId(p._id);
      setEditForm({name:p.name , role:p.role , department: p.department , email:p.email , isActive:p.isActive , date:p.createdAt});
    }

    // cancelling edit:
    function cancelEdit(){
      setEditId(null);
    }

    // function for saving the edit
    async function saveEdit(id) {
       
        const res = await axios.put(`${API}/user/${id}`,{
          name:editForm.name,
          department:editForm.department,
          role:editForm.role,
          email: editForm.email,
          isActive:editForm.isActive,
          createdAt:editForm.date
        })

        const updatedPeople=users.map((p)=>
       p._id===id? res.data : p
      )
      load();
      setUsers(updatedPeople)
      setEditId(null);

    }

    async function remove(id){
    await axios.delete(`${API}/user/${id}`);
    setUsers(users.filter(p=>p._id !==id));
    load();
   }


  const[users,setUsers]=useState([]);
  
    useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/user`)
        setUsers(res.data);
      } catch (error) {
        console.log(error.message)
      }
    }
     load()
  }, [])

  const employee = users.filter((p)=>p.role === "user");
  const admin = users.filter((p)=>p.role === "admin");
  const reviewer=users.filter((p)=>p.role === "reviewer");
  const activeUser = users.filter((p)=>p.isActive === true);

  return (
    <div className='bg-light vh-100'>
      {/* Heading content */}
        <div className="position-relative m-3">
          {/* Center Content */}
          <div className="text-center">
            <h2 className="fw-bold">User Management</h2>
            <p className="opacity-75">Manage users and their roles</p>
          </div>

          {/* Right Button */}
          <button className="btn btn-dark position-absolute end-0 top-0 fw-bold "  onClick={handleShow}>
            <PersonAddAltIcon className='mb-1' /> Add User
          </button>
        </div>
        {/* End of heading */}

        {/* Start of cards */}
        <div className='row gap-5 mt-5'>
          {/* card-1 */}
          <div className='col-md-2'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Total Users</h5>
              <h4 className='text-dark fw-bold'>{users.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-2'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Active Users</h5>
              <h4 className='text-success fw-bold'>{activeUser.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-2'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Admins</h5>
              <h4 className='text-danger fw-bold'>{admin.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-2'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Reviewer</h5>
              <h4 className='text-primary fw-bold'>{reviewer.length}</h4>
            </div>
             </div>
          </div>
          {/* card-1 */}
          <div className='col-md-2'>
            <div className='card border-dark border-opacity-25 rounded-4 shadow'>
            <div className='card-body rounded-pill bg-light'>
              <h5>Regular Users</h5>
              <h4 className='text-secondary fw-bold'>{employee.length}</h4>
            </div>
             </div>
          </div>
        </div>
        {/* End of cards Row */}

        {/* filter sections */}
          <div className='card-body shadow rounded-5'>
              <div className='row bg-light mt-5'>
             <div className='col-md-5'>
               <input className='form-control border-0 rounded-2 m-4 bg-secondary bg-opacity-10' placeholder='Search user by name or email'></input>
             </div>
             <div className='col-md-3'>
               <select className='form-select m-4'>
                <option>All Role</option>
                <option>Employees</option>
                <option>Admins</option>
                <option>Reviewer</option>
               </select>
             </div>
             <div className='col-md-3'>
               <select className='form-select m-4'>
                <option>All Users</option>
                <option>Active Users</option>
                <option>Inactive Users</option>
               </select>
             </div>
          </div>
        </div>
        {/* filter sections */}
        
        {/* user Table for listing the student */}
        <h2 className='fw-bold m-4 text-start'>Users({users.length})</h2>
        <table className='table table-lg table-borderless table-hover mt-3'>
          <thead>
             <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined On</th>
              <th>Actions</th>
             </tr>
          </thead>
          <tbody>
             {users.map(p=>(
              <tr  key={p._id}>
                {editId === p._id ?(
                   <>
              <td>
                <input type='text' className='form-control' value={editForm.name} onChange={(e)=>setEditForm({...editForm,name:e.target.value})}></input>
              </td>
              <td>
                <input type='email' className='form-control' value={editForm.email} onChange={(e)=>setEditForm({...editForm,email:e.target.value})}></input>
              </td>
              <td>
                <input type='text' className='form-control' value={editForm.role} onChange={(e)=>setEditForm({...editForm,role:e.target.value})}></input>
              </td>
              <td>
                <input type='text' className='form-control' value={editForm.department} onChange={(e)=>setEditForm({...editForm,department:e.target.value})}></input>
              </td>
              <td>
              <  input type='date' className='form-control' value={editForm.date ? editForm.date.slice(0,10) : ""} onChange={(e)=>setEditForm({...editForm,date:e.target.value})}></input>
              </td>
              <td>
              <select className="form-select" value={editForm.isActive ? "true" : "false"} onChange={(e) =>  setEditForm({...editForm,isActive: e.target.value === "true"}) }>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>              </td>
              <td>
                <div className="d-flex justify-content-end align-items-center gap-2">
                  
                  <button className="btn btn-success btn-sm px-3" onClick={()=> saveEdit(p._id)}>Save</button>
                  <button className="btn btn-outline-secondary btn-sm px-3" onClick={cancelEdit} > Cancel </button>
                </div>
              </td>
              </>
                ):(
                  <>
                  <td className='pt-4'>{p.name}</td>
                 <td className='pt-3'>{p.email}</td>
                 <td className='pt-3'>{p.role}</td>
                 <td className='pt-3'>{p.department}</td>
                 {p.isActive === true? (
                    <span className="badge bg-success px-3 py-2 rounded-pill mt-3">
                      Active
                    </span>
                  ) : (
                    <span className="badge bg-danger px-3 py-2 rounded-pill">
                      Inactive
                    </span>
                  )}
                  <td className='pt-3'>{p.createdAt && p.createdAt.slice(0,10)}</td>
                  <td className='pt-3'>
                    <div>
                      <Button
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={(e) => handleClick(e, p)}
                      >
                        <EditIcon/>
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleedit}
                        slotProps={{
                          list: {
                            'aria-labelledby': 'basic-button',
                          },
                        }}
                      >
                        <MenuItem onClick={()=>startEdit(p)}>Edit</MenuItem>
                        <MenuItem onClick={()=>remove(p._id)}>delete</MenuItem>
                        <MenuItem onClick={handleedit}>cancel</MenuItem>
                      </Menu>
                    </div>
                  </td>
                  </>
                )}
                 
              </tr>
             ))}
          </tbody>
        </table>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleedit}
          >
            <MenuItem
              onClick={() => {
                startEdit(selectedUser);
                handleedit();
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                remove(selectedUser._id);
                handleedit();
              }}
            >
              Delete
            </MenuItem>

            <MenuItem onClick={handleedit}>
              Cancel
            </MenuItem>
        </Menu>
          

          {/* Model for adding user */}
          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control className='mb-2'
                type="name"
                placeholder="Enter Name"
                autoFocus
                value={form.name}
                onChange={(e)=>setForm({...form , name:e.target.value})}
              />
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                value={form.email}
                onChange={(e)=>setForm({...form, email:e.target.value })}
              />
              <Form.Label className='mt-2'> Role</Form.Label>
              <Form.Control 
                type="Role"
                placeholder="Enter role"
                autoFocus
                value={form.role}
                onChange={(e)=>setForm({...form , role:e.target.value})}
              />
              <Form.Label className='mt-2'> Department</Form.Label>
              <Form.Control 
                type="department"
                placeholder="Enter Department"
                autoFocus
                value={form.department}
                onChange={(e)=>setForm({...form , department:e.target.value})}
              />
              <Form.Label className='mt-2'> Joined On</Form.Label>
              <Form.Control 
                type="date"
                placeholder="Enter Department"
                autoFocus
                value={form.date}
                onChange={(e)=>setForm({...form , date:e.target.value})}
              />

            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="primary" onClick={addUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
          
      </div>
  )
}

export default UserManagement
