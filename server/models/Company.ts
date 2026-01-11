import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  website?: string;
  industry?: string;
  size?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  location?: string;
  description?: string;
  logo?: string;
  notes?: string;
  rating?: number;
  createdAt: Date;
}

const companySchema = new Schema<ICompany>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  logo: {
    type: String
  },
  notes: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ICompany>('Company', companySchema);
