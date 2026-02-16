import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
    const { jobId, resumeLink, coverNote } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }

    const alreadyApplied = await Application.findOne({
        userId: req.user._id,
        jobId: jobId
    });

    if (alreadyApplied) {
        res.status(400).json({ message: 'You have already applied for this job' });
        return;
    }

    const application = new Application({
        userId: req.user._id,
        jobId,
        resumeLink,
        coverNote,
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
};

// @desc    Get logged in user applications
// @route   GET /api/applications/me
// @access  Private
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ userId: req.user._id }).populate('jobId', 'title location type');
    res.json(applications);
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
    const applications = await Application.find({})
        .populate('userId', 'name email')
        .populate('jobId', 'title');
    res.json(applications);
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (application) {
        application.status = status;
        const updatedApplication = await application.save();
        res.json(updatedApplication);
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

export { applyForJob, getMyApplications, getAllApplications, updateApplicationStatus };
