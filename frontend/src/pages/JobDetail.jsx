import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [resumeLink, setResumeLink] = useState('');
    const [coverNote, setCoverNote] = useState('');
    const [applicationStatus, setApplicationStatus] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`/api/jobs/${id}`);
                setJob(res.data);
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await axios.post('/api/applications', {
                jobId: id,
                resumeLink,
                coverNote
            });
            setApplicationStatus('success');
            setResumeLink('');
            setCoverNote('');
        } catch (error) {
            setApplicationStatus(error.response?.data?.message || 'error');
        }
    };

    if (loading) return <div className="text-center py-10">Loading job details...</div>;
    if (!job) return <div className="text-center py-10">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${job.type === 'Internship' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {job.type}
                </span>
                <span className="text-gray-600">{job.location}</span>
                <span className="text-gray-500 text-sm">{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {user?.role === 'admin' ? (
                <p className="text-gray-500 italic">Admins cannot apply to jobs.</p>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Apply for this position</h3>
                    {applicationStatus === 'success' ? (
                        <div className="bg-green-100 text-green-800 p-4 rounded">Application submitted successfully!</div>
                    ) : (
                        <form onSubmit={handleApply}>
                            {applicationStatus && applicationStatus !== 'success' && (
                                <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{applicationStatus}</div>
                            )}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Resume Link (Google Drive/Dropbox)</label>
                                <input
                                    type="url"
                                    value={resumeLink}
                                    onChange={(e) => setResumeLink(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    placeholder="https://"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Cover Note (Optional)</label>
                                <textarea
                                    value={coverNote}
                                    onChange={(e) => setCoverNote(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                                Submit Application
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetail;
