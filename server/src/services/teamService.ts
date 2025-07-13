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
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    // Check if adding this player would exceed the limit
    if (team.players.length >= 25) {
      throw new Error('Cannot add player: Team already has maximum of 25 players');
    }
    
    team.players.push(playerId);
    await team.save();
  }
  
  static async removePlayerFromTeam(teamId: string, playerId: string): Promise<void> {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    // Check if removing this player would go below the minimum
    if (team.players.length <= 15) {
      throw new Error('Cannot remove player: Team must have at least 15 players');
    }
    
    team.players = team.players.filter(id => id !== playerId);
    await team.save();
  }
}
