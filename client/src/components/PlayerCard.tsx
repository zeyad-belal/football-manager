import React, { useState } from 'react';
import { Player } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { transferService } from '@/services/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { 
  CurrencyDollarIcon, 
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { getPositionColor } from '@/utils';

interface PlayerCardProps {
  player: Player;
  isOwned?: boolean;
  onUpdate?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isOwned = false, onUpdate }) => {
  const { team, refreshProfile } = useAuth();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<{ askingPrice: number }>();


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToTransferList = async (data: { askingPrice: number }) => {
    try {
      setIsLoading(true);
      await transferService.addPlayerToTransferList(player._id, data.askingPrice);
      toast.success('Player added to transfer list');
      setIsTransferModalOpen(false);
      reset();
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

  const canBuy = !isOwned && player.isOnTransferList && team && team.budget >= (player.askingPrice || 0) * 0.95;

  return (
    <>
      <div className="card">
        <div className="card-body">
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

          <div className="space-y-2">
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
                      <MinusIcon className="h-4 w-4 mr-1" />
                      Remove from List
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  List for Transfer
                </button>
              )
            ) : (
              player.isOnTransferList && (
                <button
                  onClick={handleBuyPlayer}
                  disabled={isLoading || !canBuy}
                  className={`flex-1 flex items-center justify-center ${
                    canBuy ? 'btn-success' : 'btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-4 w-4 mr-1" />
                      {canBuy ? 'Buy Player' : 'Insufficient Budget'}
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <Dialog
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">
                List Player for Transfer
              </Dialog.Title>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>{player.name}</strong> - {player.position}
              </p>
              <p className="text-sm text-gray-500">
                Current Value: {formatCurrency(player.value)}
              </p>
            </div>

            <form onSubmit={handleSubmit(handleAddToTransferList)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asking Price
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('askingPrice', {
                      required: 'Asking price is required',
                      min: {
                        value: 1,
                        message: 'Price must be greater than 0',
                      },
                    })}
                    type="number"
                    className="input pl-10"
                    placeholder="Enter asking price"
                  />
                </div>
                {errors.askingPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.askingPrice.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? <div className="spinner" /> : 'List Player'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default PlayerCard;
