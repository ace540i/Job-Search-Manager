import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  user: mongoose.Types.ObjectId;
  company?: mongoose.Types.ObjectId;
  position: string;
  location?: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  status: 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted' | 'Declined';
  priority: 'Low' | 'Medium' | 'High';
  jobUrl?: string;
  description?: string;
  requirements?: string;
  notes?: string;
  applicationDate?: Date;
  responseDate?: Date;
  followUpDate?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  position: {
    type: String,
    required: [true, 'Please provide a position title'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  workMode: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    default: 'Remote'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected', 'Accepted', 'Declined'],
    default: 'Wishlist'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  jobUrl: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  requirements: {
    type: String
  },
  notes: {
    type: String
  },
  applicationDate: {
    type: Date
  },
  responseDate: {
    type: Date
  },
  followUpDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IJob>('Job', jobSchema);
