import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
               <Route path="/dashboard/user" element={<UserDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
