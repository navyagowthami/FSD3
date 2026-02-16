import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">JobBoard</Link>
                <div className="flex items-center space-x-4">
                    <Link to="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/dashboard/admin" className="text-gray-700 hover:text-blue-600">Admin Dashboard</Link>
                            ) : (
                                <Link to="/dashboard/user" className="text-gray-700 hover:text-blue-600">My Dashboard</Link>
                            )}
                            <button onClick={logout} className="text-gray-700 hover:text-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                            <Link to="/signup" className="text-gray-700 hover:text-blue-600">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
