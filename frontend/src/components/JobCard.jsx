import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <p className="text-gray-600">{job.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${job.type === 'Internship' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {job.type}
                </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {skill}
                    </span>
                ))}
            </div>
            <Link to={`/jobs/${job._id}`} className="block text-center w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition">
                View Details
            </Link>
        </div>
    );
};

export default JobCard;
