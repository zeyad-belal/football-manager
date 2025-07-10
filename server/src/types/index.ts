import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  email: string;
  password: string;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam extends Document {
  userId: string;
  name: string;
  budget: number;
  players: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayer extends Document {
  name: string;
  position: PlayerPosition;
  teamId: string;
  value: number;
  isOnTransferList: boolean;
  askingPrice?: number;
  originalTeamName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransfer extends Document {
  playerId: string;
  sellerTeamId: string;
  buyerTeamId?: string;
  askingPrice: number;
  finalPrice?: number;
  status: TransferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum PlayerPosition {
  GOALKEEPER = 'Goalkeeper',
  DEFENDER = 'Defender',
  MIDFIELDER = 'Midfielder',
  ATTACKER = 'Attacker'
}

export enum TransferStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface TransferFilters {
  teamName?: string;
  playerName?: string;
  minPrice?: number;
  maxPrice?: number;
  position?: PlayerPosition;
}
