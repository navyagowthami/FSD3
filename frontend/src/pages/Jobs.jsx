import { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('/api/jobs');
                setJobs(res.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div className="text-center py-10">Loading jobs...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Opportunities</h2>
            {jobs.length === 0 ? (
                <p className="text-center text-gray-600">No jobs available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Jobs;
