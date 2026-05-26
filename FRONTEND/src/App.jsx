import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- 1. REGISTRATION PAGE ---
function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setStatusMessage({ text: "✅ " + response.data.message, type: 'success' });
    } catch (error) {
      setStatusMessage({ text: "❌ " + (error.response?.data?.message || error.message), type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Create an Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" name="username" placeholder="Username" onChange={handleChange} required 
          className="p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <input 
          type="email" name="email" placeholder="Email" onChange={handleChange} required 
          className="p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <input 
          type="password" name="password" placeholder="Password" onChange={handleChange} required 
          className="p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button type="submit" className="p-3 mt-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition duration-200">
          Register
        </button>
      </form>
      {statusMessage.text && (
        <div className={`mt-4 p-3 rounded-lg text-center font-medium ${statusMessage.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
}

// --- 2. LOGIN PAGE ---
function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setStatusMessage("❌ " + (error.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="email" name="email" placeholder="Email" onChange={handleChange} required 
          className="p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <input 
          type="password" name="password" placeholder="Password" onChange={handleChange} required 
          className="p-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button type="submit" className="p-3 mt-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition duration-200">
          Login
        </button>
      </form>
      {statusMessage && (
        <div className="mt-4 p-3 rounded-lg text-center font-medium bg-red-900/50 text-red-400 border border-red-800">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

// --- 3. PROTECTED DASHBOARD ---
function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [adminMessage, setAdminMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data.data);
      } catch (err) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
      }
    };
    fetchProfile();
  }, []);

  const handleFetchAllUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllUsers(response.data.data);
      setAdminMessage({ text: '✅ Admin Access Granted: Users loaded.', type: 'success' });
    } catch (err) {
      setAdminMessage({ text: '❌ Blocked: ' + (err.response?.data?.message || 'Access Denied'), type: 'error' });
      setAllUsers([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Your Dashboard</h2>
      
      {error ? (
        <div className="p-4 bg-red-900/50 text-red-400 rounded-lg text-center border border-red-800">{error}</div>
      ) : userData ? (
        <div>
          {/* User Profile Card */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-inner">
            <div className="grid gap-3 text-gray-300">
              <p><span className="font-bold text-gray-400">Username:</span> {userData.username}</p>
              <p><span className="font-bold text-gray-400">Email:</span> {userData.email}</p>
              <p><span className="font-bold text-gray-400">Role:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${userData.role === 'admin' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'}`}>
                  {userData.role}
                </span>
              </p>
            </div>
            <button onClick={handleLogout} className="mt-6 w-full p-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200">
              Logout
            </button>
          </div>
          
          <hr className="my-8 border-gray-700" />
          
          {/* Admin Panel */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-inner">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              🛡️ Admin Panel
            </h3>
            <button 
              onClick={handleFetchAllUsers} 
              className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
            >
              Fetch All Registered Users
            </button>
            
            {adminMessage.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${adminMessage.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                {adminMessage.text}
              </div>
            )}
            
            {allUsers.length > 0 && (
              <div className="mt-4 bg-gray-950 p-4 rounded-lg border border-gray-800 max-h-64 overflow-y-auto custom-scrollbar">
                {allUsers.map((user, index) => (
                  <div key={user._id} className="border-b border-gray-800 last:border-0 py-3 flex justify-between items-center">
                    <div>
                      <p className="text-gray-200 font-medium">{index + 1}. {user.username}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

// --- 4. MAIN APP ROUTER ---
function App() {
  return (
    <Router>
      <div className="min-h-screen p-6 font-sans selection:bg-blue-500 selection:text-white">
        <nav className="max-w-4xl mx-auto mb-10 p-4 bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700 shadow-lg flex justify-center gap-6">
          <Link to="/register" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition duration-200 font-medium">Register</Link>
          <Link to="/login" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition duration-200 font-medium">Login</Link>
          <Link to="/dashboard" className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition duration-200 font-medium">Dashboard</Link>
        </nav>

        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;