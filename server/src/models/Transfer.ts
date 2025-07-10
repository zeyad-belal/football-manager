import mongoose, { Schema } from 'mongoose';
import { ITransfer, TransferStatus } from '@/types';

const transferSchema = new Schema<ITransfer>({
  playerId: {
    type: String,
    required: true,
    ref: 'Player'
  },
  sellerTeamId: {
    type: String,
    required: true,
    ref: 'Team'
  },
  buyerTeamId: {
    type: String,
    ref: 'Team'
  },
  askingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  finalPrice: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(TransferStatus),
    default: TransferStatus.ACTIVE
  }
}, {
  timestamps: true
});

// Index for efficient queries
transferSchema.index({ status: 1 });
transferSchema.index({ sellerTeamId: 1 });
transferSchema.index({ buyerTeamId: 1 });
transferSchema.index({ playerId: 1 });

export const Transfer = mongoose.model<ITransfer>('Transfer', transferSchema);
