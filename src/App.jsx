import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentsTable />} />
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}

function StudentsTable() {
  const [loading, setLoading] = useState(false);
  const [zoomPhoto, setZoomPhoto] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "", reg: "", branch: "", section: "", CGPA: "", phone: "",
    bloodGroup: "", gender: "", dob: "",
    fatherName: "", motherName: "", email: "", address: "", photo: ""
  });

  const fetchStudents = () => {
    fetch('http://localhost:5000/students')
.then(res => res.json())
.then(data => setStudentList(data))
.catch(err => console.log("Error fetching:", err))
  }

  useEffect(() => {
    fetchStudents()
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const method = editingStudent? "PUT" : "POST";
      const url = editingStudent
   ? `http://localhost:5000/students/${editingStudent.id}`
        : `http://localhost:5000/students`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if(!res.ok) throw new Error("Failed to save");

      await fetchStudents();
      setEditingStudent(null);
      setShowAddForm(false);
      alert("Saved Successfully!");
      setFormData({name: "", reg: "", branch: "", section: "", CGPA: "", phone: "", bloodGroup: "", gender: "", dob: "", fatherName: "", motherName: "", email: "", address: "", photo: ""})

    } catch(err) {
      alert("Error: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (id) => {
    if(window.confirm("Delete this student?")){
      fetch(`http://localhost:5000/students/${id}`, { method: "DELETE" })
.then(() => fetchStudents())
    }
  }

  const openEdit = (student) => {
    setEditingStudent(student);
    setFormData({...student});
  }

  return (
    <div className="container">
      <h1 className="main-title">Student <span>Directory</span></h1>
      <button className="btn-view" style={{marginBottom: '20px'}} onClick={() => {setShowAddForm(true); setEditingStudent(null); setFormData({name: "", reg: "", branch: "", section: "", CGPA: "", phone: "", bloodGroup: "", gender: "", dob: "", fatherName: "", motherName: "", email: "", address: "", photo: ""})}}>+ Add Student</button>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th style={{width: '60px'}}>#</th>
              <th style={{width: '70px'}}>Avatar</th>
              <th>Student Name</th>
              <th style={{width: '120px'}}>Branch</th>
              <th style={{width: '250px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, index) => (
              <tr key={student.id}>
                <td className="id-col">0{index + 1}</td>
                <td>
                  <img
                    src={student.photo? `/${student.photo}` : `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}&backgroundColor=ff69b4`}
                    className="avatar"
                    onClick={() => setZoomPhoto(student.photo? `/${student.photo}` : `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}&backgroundColor=ff69b4`)}
                    alt={student.name}
                    style={{width: '50px', height: '50px', borderRadius: '50%', border: '2px solid pink', objectFit: 'cover', cursor: 'pointer'}}
                  />
                </td>
                <td>
                  <div className="name">{student.name}</div>
                  <div className="reg">{student.reg}</div>
                </td>
                <td><span className="tag">{student.branch}</span></td>
                <td className="action-cell">
                  <button className="btn-edit" onClick={() => openEdit(student)}>Edit</button>
                  <button className="btn-edit" style={{background: 'red'}} onClick={() => handleDelete(student.id)}>Delete</button>
                  <Link to={`/student/${student.id}`}><button className="btn-view">View</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT POPUP */}
      {(editingStudent || showAddForm) && (
        <div className="popup" onClick={() => {setEditingStudent(null); setShowAddForm(false)}}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()} style={{width: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2>{editingStudent? "Edit Student" : "Add Student"}</h2>

            <label>Name</label>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input"/>

            <label>Reg No</label>
            <input value={formData.reg} onChange={(e) => setFormData({...formData, reg: e.target.value})} className="input" disabled={editingStudent}/>

            <label>Branch</label>
            <select value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="input">
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="CSE-AIML">CSE-AIML</option>
              <option value="CSE-DS">CSE-DS</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>

            <label>Section</label>
            <input value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="input" placeholder="A, B, C"/>

            <label>Gender</label>
            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="input">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Blood Group</label>
            <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className="input">
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option>
              <option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </select>

            <label>DOB</label>
            <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="input"/>

            <label>CGPA</label>
            <input type="number" step="0.01" value={formData.CGPA} onChange={(e) => setFormData({...formData, CGPA: e.target.value})} className="input"/>

            <label>Phone</label>
            <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input"/>

            <label>Father Name</label>
            <input value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="input"/>

            <label>Mother Name</label>
            <input value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} className="input"/>

            <label>Email</label>
            <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input"/>

            <label>Address</label>
            <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="input"></textarea>

            {/* NEW PHOTO FIELD - RIGHT ABOVE SAVE BUTTON */}
            <label>Photo Filename</label>
            <input
              value={formData.photo}
              onChange={(e) => setFormData({...formData, photo: e.target.value})}
              className="input"
              placeholder="leela.jpg.png"
            />

            <div className="modal-btns">
              <button className="btn-view" onClick={handleSave} disabled={loading}>
                {loading? "Updating..." : "Update"}
              </button>
              <button className="btn-edit" onClick={() => {setEditingStudent(null); setShowAddForm(false)}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {zoomPhoto && (
        <div className="popup" onClick={() => setZoomPhoto(null)}>
          <img src={zoomPhoto} className="popup-img" alt="zoom" style={{border: '4px solid pink', borderRadius: '20px', width: '200px'}} />
        </div>
      )}
    </div>
  );
}

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/students/${id}`)
.then(res => res.json())
.then(data => setStudent(data))
.catch(err => console.log("Error fetching:", err))
  }, [id]);

  if (!student) return <div className="container"><h1>Loading...</h1></div>

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/')}>← Back to Directory</button>
      <div className="profile-box">
        <div className="profile-header">
          <img
            src={student.photo? `/${student.photo}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}&backgroundColor=b6e3f4`}
            className="profile-avatar"
            alt={student.name}
            style={{width: '120px', height: '120px', borderRadius: '50%', border: '4px solid pink', objectFit: 'cover'}}
          />
          <div>
            <span className="status">{student.status || 'Active'}</span>
            <h1>{student.name}</h1>
            <p className="sub-info">{student.branch} • Section {student.section}</p>
            <div className="reg-badge">{student.reg}</div>
          </div>
        </div>
        <div className="stats-row">
          <div className="stat-box"><span>CGPA</span><b>{student.CGPA || '-'}</b></div>
          <div className="stat-box"><span>Blood Group</span><b>{student.bloodGroup || '-'}</b></div>
          <div className="stat-box"><span>Gender</span><b>{student.gender || '-'}</b></div>
          <div className="stat-box"><span>DOB</span><b>{student.dob || '-'}</b></div>
        </div>
        <h2 className="section-title">Personal Information</h2>
        <div className="info-row">
          <div className="info-box"><span>Father Name</span><b>{student.fatherName || '-'}</b></div>
          <div className="info-box"><span>Mother Name</span><b>{student.motherName || '-'}</b></div>
        </div>
        <div className="info-row">
          <div className="info-box"><span>Phone</span><b>{student.phone || '-'}</b></div>
          <div className="info-box"><span>Email</span><b>{student.email || '-'}</b></div>
        </div>
        <h2 className="section-title">Address</h2>
        <div className="info-box full"><b>{student.address || '-'}</b></div>
      </div>
    </div>
  );
}