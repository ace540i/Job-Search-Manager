import mongoose, { Document, Schema } from 'mongoose';

export interface IInterview extends Document {
  user: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  type: 'Phone Screen' | 'Video' | 'On-site' | 'Technical' | 'HR' | 'Panel' | 'Other';
  round: number;
  scheduledDate: Date;
  duration: number;
  interviewer?: string;
  location?: string;
  meetingLink?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  preparation?: string;
  feedback?: string;
  outcome: 'Pending' | 'Passed' | 'Failed' | 'Next Round';
  createdAt: Date;
}

const interviewSchema = new Schema<IInterview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
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
    type: Number,
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

export default mongoose.model<IInterview>('Interview', interviewSchema);
