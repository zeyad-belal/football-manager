import React, { useState } from 'react';
import { Player } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { transferService } from '@/services/api';
import toast from 'react-hot-toast';
import { 
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react';
import { formatCurrency, getPositionColor } from '@/utils';
import TransferModal from './TransferModal';

interface PlayerCardProps {
  player: Player;
  isOwned?: boolean;
  onUpdate?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isOwned = false, onUpdate }) => {
  const { team, refreshProfile } = useAuth();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToTransferList = async (data: { askingPrice: number }) => {
    try {
      setIsLoading(true);
      await transferService.addPlayerToTransferList(player._id, data.askingPrice);
      toast.success('Player added to transfer list');
      setIsTransferModalOpen(false);
      if (onUpdate) onUpdate();
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add player to transfer list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromTransferList = async () => {
    try {
      setIsLoading(true);
      await transferService.removePlayerFromTransferList(player._id);
      toast.success('Player removed from transfer list');
      if (onUpdate) onUpdate();
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove player from transfer list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyPlayer = async () => {
    try {
      setIsLoading(true);
      await transferService.buyPlayer(player._id);
      toast.success('Player purchased successfully');
      if (onUpdate) onUpdate();
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to buy player');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate available players (not on transfer list)
  const availablePlayers = team?.players?.filter(p => !p.isOnTransferList) || [];
  const totalPlayers = team?.players?.length || 0;
  
  // Check if user can list this player (must have more than 15 available players)
  const canListPlayer = isOwned && !player.isOnTransferList && availablePlayers.length > 15;
  
  // Check if user can buy (must have less than 25 total players and sufficient budget and not own player)
  const canBuy = !isOwned && 
    player.isOnTransferList && 
    team && 
    team.budget >= (player.askingPrice || 0) * 0.95 &&
    totalPlayers < 25;

  return (
    <>
      <div className="card h-full flex flex-col">
        <div className="card-body flex flex-col flex-1">
          <div className="flex justify-between md:flex-row flex-col items-start mb-3">
            <div>
              <h3 className="md:text-lg text-sm font-medium text-gray-900 truncate">
                {player.name}
              </h3>
              <p className="text-sm text-gray-500">{player.originalTeamName}</p>
            </div>
            <span className={`badge  ${getPositionColor(player.position, 'badge')}`}>
              {player.position}
            </span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Value:</span>
              <span className="font-medium">{formatCurrency(player.value)}</span>
            </div>

            {player.isOnTransferList && player.askingPrice && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Asking Price:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(player.askingPrice)}
                </span>
              </div>
            )}

            {!isOwned && player.isOnTransferList && player.askingPrice && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Your Price (95%):</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(Math.floor(player.askingPrice * 0.95))}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex space-x-2">
            {isOwned ? (
              player.isOnTransferList ? (
                <button
                  onClick={handleRemoveFromTransferList}
                  disabled={isLoading}
                  className="btn-danger flex-1 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Minus className="h-4 w-4 mr-1" />
                      Remove from List
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  disabled={!canListPlayer}
                  className={`flex-1 flex items-center justify-center ${
                    canListPlayer ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                  title={!canListPlayer ? 'Cannot list: Team must have more than 15 available players' : ''}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {canListPlayer ? 'List for Transfer' : 'Cannot List'}
                </button>
              )
            ) : (
              player.isOnTransferList && (
                <button
                  onClick={handleBuyPlayer}
                  disabled={isLoading || !canBuy || isOwned}
                  className={`flex-1 flex items-center justify-center ${
                    canBuy && !isOwned ? 'btn-success' : 'btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                  title={
                    isOwned 
                      ? 'Cannot buy your own player'
                      : !canBuy 
                        ? totalPlayers >= 25 
                          ? 'Cannot buy: Team already has 25 players' 
                          : 'Insufficient budget'
                        : ''
                  }
                >
                  {isLoading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {isOwned 
                        ? 'Your Player'
                        : canBuy 
                          ? 'Buy Player' 
                          : totalPlayers >= 25 
                            ? 'Team Full' 
                            : 'Insufficient Budget'
                      }
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <TransferModal
        player={player}
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSubmit={handleAddToTransferList}
        isLoading={isLoading}
      />
    </>
  );
};

export default PlayerCard;
