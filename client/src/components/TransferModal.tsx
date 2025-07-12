import React from 'react';
import { Player } from '@/types';
import { useForm } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import { 
  DollarSign, 
  X
} from 'lucide-react';
import { formatCurrency } from '@/utils';

interface TransferModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { askingPrice: number }) => Promise<void>;
  isLoading: boolean;
}

const TransferModal: React.FC<TransferModalProps> = ({
  player,
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{ askingPrice: number }>();

  const handleFormSubmit = async (data: { askingPrice: number }) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
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

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asking Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                onClick={handleClose}
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
  );
};

export default TransferModal;
