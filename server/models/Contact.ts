import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  user: mongoose.Types.ObjectId;
  company?: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  notes?: string;
  lastContactDate?: Date;
  createdAt: Date;
}

const contactSchema = new Schema<IContact>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  name: {
    type: String,
    required: [true, 'Please provide a contact name'],
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  lastContactDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IContact>('Contact', contactSchema);
