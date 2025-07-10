import { Team } from '@/models/Team';
import { Player } from '@/models/Player';
import { User } from '@/models/User';
import { generateInitialPlayers, generateTeamName } from '@/utils/playerGenerator';
import { ITeam, IPlayer } from '@/types';

export class TeamService {
  static async createTeamForUser(userId: string): Promise<ITeam> {
    try {
      // Generate team name
      const teamName = generateTeamName();
      
      // Create team
      const team = new Team({
        userId,
        name: teamName,
        budget: 5000000,
        players: []
      });
      
      const savedTeam = await team.save();
      
      // Generate initial players
      const playersData = generateInitialPlayers();
      const players: IPlayer[] = [];
      
      for (const playerData of playersData) {
        const player = new Player({
          name: playerData.name,
          position: playerData.position,
          teamId: (savedTeam._id as any).toString(),
          value: playerData.value,
          isOnTransferList: false,
          originalTeamName: teamName
        });
        
        const savedPlayer = await player.save();
        players.push(savedPlayer);
      }
      
      // Update team with player IDs
      savedTeam.players = players.map(p => (p._id as any).toString());
      await savedTeam.save();
      
      // Update user with team ID
      await User.findByIdAndUpdate(userId, { teamId: (savedTeam._id as any).toString() });
      
      return savedTeam;
    } catch (error) {
      throw new Error(`Failed to create team: ${error}`);
    }
  }
  
  static async getTeamByUserId(userId: string): Promise<ITeam | null> {
    return Team.findOne({ userId }).populate('players');
  }
  
  static async getTeamWithPlayers(teamId: string): Promise<any> {
    const team = await Team.findById(teamId);
    if (!team) return null;
    
    const players = await Player.find({ teamId });
    
    return {
      ...team.toObject(),
      players
    };
  }
  
  static async updateTeamBudget(teamId: string, newBudget: number): Promise<void> {
    await Team.findByIdAndUpdate(teamId, { budget: newBudget });
  }
  
  static async addPlayerToTeam(teamId: string, playerId: string): Promise<void> {
    await Team.findByIdAndUpdate(teamId, {
      $push: { players: playerId }
    });
  }
  
  static async removePlayerFromTeam(teamId: string, playerId: string): Promise<void> {
    await Team.findByIdAndUpdate(teamId, {
      $pull: { players: playerId }
    });
  }
}
