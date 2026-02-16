import Job from '../models/Job.js';

// @desc    Fetch all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
};

// @desc    Fetch single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
    const { title, description, skills, type, location } = req.body;

    const job = new Job({
        title,
        description,
        skills,
        type,
        location,
        createdBy: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
    const { title, description, skills, type, location, isActive } = req.body;

    const job = await Job.findById(req.params.id);

    if (job) {
        job.title = title || job.title;
        job.description = description || job.description;
        job.skills = skills || job.skills;
        job.type = type || job.type;
        job.location = location || job.location;
        job.isActive = isActive !== undefined ? isActive : job.isActive;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

export { getJobs, getJobById, createJob, updateJob, deleteJob };
