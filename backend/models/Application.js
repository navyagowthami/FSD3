import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    resumeLink: {
        type: String,
        required: true,
    },
    coverNote: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
        default: 'Applied',
    },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
