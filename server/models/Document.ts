import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  user: mongoose.Types.ObjectId;
  job?: mongoose.Types.ObjectId;
  name: string;
  type: 'Resume' | 'Cover Letter' | 'Portfolio' | 'Certificate' | 'Other';
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
  createdAt: Date;
}

const documentSchema = new Schema<IDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job'
  },
  name: {
    type: String,
    required: [true, 'Please provide a document name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Resume', 'Cover Letter', 'Portfolio', 'Certificate', 'Other'],
    default: 'Other'
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide a file URL']
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IDocument>('Document', documentSchema);
