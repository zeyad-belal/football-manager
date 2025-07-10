import mongoose, { Schema } from 'mongoose';
import { IPlayer, PlayerPosition } from '@/types';

const playerSchema = new Schema<IPlayer>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    enum: Object.values(PlayerPosition)
  },
  teamId: {
    type: String,
    required: true,
    ref: 'Team'
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  isOnTransferList: {
    type: Boolean,
    default: false
  },
  askingPrice: {
    type: Number,
    min: 0
  },
  originalTeamName: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
playerSchema.index({ teamId: 1 });
playerSchema.index({ isOnTransferList: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ name: 'text', originalTeamName: 'text' });

export const Player = mongoose.model<IPlayer>('Player', playerSchema);
