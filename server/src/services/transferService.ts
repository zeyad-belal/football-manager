import { Player } from '@/models/Player';
import { Team } from '@/models/Team';
import { Transfer } from '@/models/Transfer';
import { TeamService } from './teamService';
import { IPlayer, ITransfer, TransferStatus, TransferFilters } from '@/types';

export class TransferService {
  static async addPlayerToTransferList(playerId: string, askingPrice: number, userId: string): Promise<void> {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    const team = await Team.findOne({ userId });
    if (!team || player.teamId !== (team._id as any).toString()) {
      throw new Error('You can only list your own players');
    }
    
    // Update player
    player.isOnTransferList = true;
    player.askingPrice = askingPrice;
    await player.save();
    
    // Create transfer record
    const transfer = new Transfer({
      playerId,
      sellerTeamId: (team._id as any).toString(),
      askingPrice,
      status: TransferStatus.ACTIVE
    });
    
    await transfer.save();
  }
  
  static async removePlayerFromTransferList(playerId: string, userId: string): Promise<void> {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    const team = await Team.findOne({ userId });
    if (!team || player.teamId !== (team._id as any).toString()) {
      throw new Error('You can only remove your own players from transfer list');
    }
    
    // Update player
    player.isOnTransferList = false;
    player.askingPrice = undefined;
    await player.save();
    
    // Cancel active transfers
    await Transfer.updateMany(
      { playerId, status: TransferStatus.ACTIVE },
      { status: TransferStatus.CANCELLED }
    );
  }
  
  static async getTransferMarket(filters: TransferFilters = {}, page = 1, limit = 20): Promise<any> {
    const query: any = { isOnTransferList: true };
    
    // Apply filters
    if (filters.playerName) {
      query.$text = { $search: filters.playerName };
    }
    
    if (filters.position) {
      query.position = filters.position;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      query.askingPrice = {};
      if (filters.minPrice) query.askingPrice.$gte = filters.minPrice;
      if (filters.maxPrice) query.askingPrice.$lte = filters.maxPrice;
    }
    
    const skip = (page - 1) * limit;
    
    const players = await Player.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Player.countDocuments(query);
    
    // Filter by team name if specified
    let filteredPlayers = players;
    if (filters.teamName) {
      filteredPlayers = players.filter(player => 
        player.originalTeamName.toLowerCase().includes(filters.teamName!.toLowerCase())
      );
    }
    
    return {
      players: filteredPlayers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  static async buyPlayer(playerId: string, buyerUserId: string): Promise<void> {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    if (!player.isOnTransferList || !player.askingPrice) {
      throw new Error('Player is not available for transfer');
    }
    
    const buyerTeam = await Team.findOne({ userId: buyerUserId });
    if (!buyerTeam) {
      throw new Error('Buyer team not found');
    }
    
    if (player.teamId === (buyerTeam._id as any).toString()) {
      throw new Error('You cannot buy your own player');
    }
    
    const sellerTeam = await Team.findById(player.teamId);
    if (!sellerTeam) {
      throw new Error('Seller team not found');
    }
    
    const finalPrice = Math.floor(player.askingPrice * 0.95); // 95% of asking price
    
    // Check if buyer has enough budget
    if (buyerTeam.budget < finalPrice) {
      throw new Error('Insufficient budget');
    }
    
    // Check team size constraints
    const buyerPlayersCount = await Player.countDocuments({ teamId: (buyerTeam._id as any).toString() });
    const sellerPlayersCount = await Player.countDocuments({ teamId: (sellerTeam._id as any).toString() });
    
    if (buyerPlayersCount >= 25) {
      throw new Error('Buyer team cannot have more than 25 players');
    }
    
    if (sellerPlayersCount <= 15) {
      throw new Error('Seller team must have at least 15 players');
    }
    
    // Perform the transfer
    await Player.findByIdAndUpdate(playerId, {
      teamId: (buyerTeam._id as any).toString(),
      isOnTransferList: false,
      askingPrice: undefined
    });
    
    // Update team budgets
    await TeamService.updateTeamBudget((buyerTeam._id as any).toString(), buyerTeam.budget - finalPrice);
    await TeamService.updateTeamBudget((sellerTeam._id as any).toString(), sellerTeam.budget + finalPrice);
    
    // Update team player lists
    await TeamService.removePlayerFromTeam((sellerTeam._id as any).toString(), playerId);
    await TeamService.addPlayerToTeam((buyerTeam._id as any).toString(), playerId);
    
    // Update transfer record
    await Transfer.findOneAndUpdate(
      { playerId, status: TransferStatus.ACTIVE },
      {
        buyerTeamId: (buyerTeam._id as any).toString(),
        finalPrice,
        status: TransferStatus.COMPLETED
      }
    );
  }
}
