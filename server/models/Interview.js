const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  type: {
    type: String,
    enum: ['Phone Screen', 'Video', 'On-site', 'Technical', 'HR', 'Panel', 'Other'],
    default: 'Video'
  },
  round: {
    type: Number,
    default: 1
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide an interview date']
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  interviewer: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  notes: {
    type: String
  },
  preparation: {
    type: String
  },
  feedback: {
    type: String
  },
  outcome: {
    type: String,
    enum: ['Pending', 'Passed', 'Failed', 'Next Round'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
