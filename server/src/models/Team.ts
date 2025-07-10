import mongoose, { Schema } from 'mongoose';
import { ITeam } from '@/types';

const teamSchema = new Schema<ITeam>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: Number,
    required: true,
    default: 5000000,
    min: 0
  },
  players: [{
    type: String,
    ref: 'Player'
  }]
}, {
  timestamps: true
});

// Ensure team has between 15-25 players (except during initial creation)
teamSchema.pre('save', function(next) {
  // Allow empty players array during initial team creation
  if (this.players.length > 0 && (this.players.length < 15 || this.players.length > 25)) {
    return next(new Error('Team must have between 15-25 players'));
  }
  next();
});

export const Team = mongoose.model<ITeam>('Team', teamSchema);
