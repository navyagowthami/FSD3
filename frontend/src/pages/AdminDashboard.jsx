import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Job Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Job');
    const [location, setLocation] = useState('');
    const [skills, setSkills] = useState('');
    const [showJobForm, setShowJobForm] = useState(false);

    useEffect(() => {
        if (activeTab === 'applications') fetchApplications();
        if (activeTab === 'jobs') fetchJobs();
    }, [activeTab]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/applications');
            setApplications(res.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/jobs');
            setJobs(res.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/api/applications/${id}/status`, { status });
            fetchApplications(); // Refresh list
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await axios.delete(`/api/jobs/${id}`);
            fetchJobs(); // Refresh list
        } catch (error) {
            alert('Failed to delete job');
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/jobs', {
                title,
                description,
                type,
                location,
                skills: skills.split(',').map(s => s.trim())
            });
            setShowJobForm(false);
            fetchJobs();
            // Reset form
            setTitle('');
            setDescription('');
            setLocation('');
            setSkills('');
        } catch (error) {
            alert('Failed to create job');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 rounded ${activeTab === 'applications' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Applications
                </button>
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded ${activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    Manage Jobs
                </button>
            </div>

            {activeTab === 'applications' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{app.userId?.name}</div>
                                        <div className="text-sm text-gray-500">{app.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.jobId?.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                        <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                            className="border rounded p-1 text-sm"
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Shortlisted">Shortlisted</option>
                                            <option value="Selected">Selected</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'jobs' && (
                <div>
                   <button
                        onClick={() => setShowJobForm(!showJobForm)}
                        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        {showJobForm ? 'Cancel' : 'Post New Job'}
                    </button>

                    {showJobForm && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h3 className="text-xl font-bold mb-4">Post a New Job</h3>
                            <form onSubmit={handleCreateJob}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input type="text" placeholder="Job Title" value={title} onChange={e => setTitle(e.target.value)} className="p-2 border rounded" required />
                                    <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="p-2 border rounded" required />
                                    <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded">
                                        <option value="Job">Job</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                    <input type="text" placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} className="p-2 border rounded" required />
                                </div>
                                <textarea placeholder="Job Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded mb-4 h-24" required />
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit</button>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-lg">{job.title}</h4>
                                    <p className="text-gray-600">{job.location} - {job.type}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
