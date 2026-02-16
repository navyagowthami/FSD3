import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Find Your Dream Job or Internship</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Connect with top companies and startups. Apply for jobs and internships with a single click.
            </p>
            <div className="space-x-4">
                <Link to="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                    Browse Jobs
                </Link>
                <Link to="/signup" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition">
                    Post a Job
                </Link>
            </div>
        </div>
    );
};

export default Home;
