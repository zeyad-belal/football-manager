export interface User {
  id: string;
  email: string;
  teamId?: string;
}

export interface Team {
  _id: string;
  userId: string;
  name: string;
  budget: number;
  players: Player[];
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  _id: string;
  name: string;
  position: PlayerPosition;
  teamId: string;
  value: number;
  isOnTransferList: boolean;
  askingPrice?: number;
  originalTeamName: string;
  createdAt: string;
  updatedAt: string;
}

export enum PlayerPosition {
  GOALKEEPER = 'Goalkeeper',
  DEFENDER = 'Defender',
  MIDFIELDER = 'Midfielder',
  ATTACKER = 'Attacker'
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthData {
  user: User;
  team: Team | null;
  token: string;
}

export interface TransferFilters {
  teamName?: string;
  playerName?: string;
  minPrice?: number;
  maxPrice?: number;
  position?: PlayerPosition;
}

export interface TransferMarketResponse {
  players: Player[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface TransferListFormData {
  askingPrice: number;
}




export interface DragItem {
  id: string;
  type: string;
  player: Player;
  fromFormation: boolean;
}

