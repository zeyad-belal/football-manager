export const getPositionColor = (pos: string, type: 'gradient' | 'badge' = 'gradient') => {
    const position = pos.toUpperCase();
    
    if (type === 'badge') {
      switch (position) {
        case 'GK':
        case 'GOALKEEPER':
          return 'bg-yellow-100 text-yellow-800';
        case 'DEF':
        case 'DEFENDER':
          return 'bg-blue-100 text-blue-800';
        case 'MID':
        case 'MIDFIELDER':
          return 'bg-green-100 text-green-800';
        case 'ATT':
        case 'ATTACKER':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Default gradient type for field view
    switch (position) {
      case 'GK':
      case 'GOALKEEPER':
        return 'from-yellow-400 to-yellow-500';
      case 'DEF':
      case 'DEFENDER':
        return 'from-blue-400 to-blue-500';
      case 'MID':
      case 'MIDFIELDER':
        return 'from-green-400 to-green-500';
      case 'ATT':
      case 'ATTACKER':
        return 'from-red-400 to-red-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };


    export const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(amount);
    };