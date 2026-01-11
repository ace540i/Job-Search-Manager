const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: Number // in bytes
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

module.exports = mongoose.model('Document', documentSchema);
