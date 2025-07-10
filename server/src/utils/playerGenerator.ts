import { PlayerPosition } from '@/types';

interface PlayerData {
  name: string;
  position: PlayerPosition;
  value: number;
}

const playerNames = {
  [PlayerPosition.GOALKEEPER]: [
    'David Martinez', 'Alex Thompson', 'Marco Silva'
  ],
  [PlayerPosition.DEFENDER]: [
    'John Smith', 'Carlos Rodriguez', 'Ahmed Hassan', 'Pierre Dubois', 
    'Marco Rossi', 'James Wilson'
  ],
  [PlayerPosition.MIDFIELDER]: [
    'Michael Johnson', 'Luis Garcia', 'Thomas Mueller', 'Andrea Pirlo', 
    'Kevin De Bruyne', 'Luka Modric'
  ],
  [PlayerPosition.ATTACKER]: [
    'Robert Lewandowski', 'Cristiano Ronaldo', 'Lionel Messi', 
    'Kylian Mbappe', 'Erling Haaland'
  ]
};

const teamNames = [
  'Manchester United', 'Barcelona', 'Real Madrid', 'Bayern Munich',
  'Liverpool', 'Chelsea', 'Arsenal', 'Juventus', 'AC Milan', 'Inter Milan',
  'Paris Saint-Germain', 'Borussia Dortmund', 'Atletico Madrid', 'Tottenham',
  'Manchester City', 'Ajax', 'Porto', 'Benfica', 'Valencia', 'Sevilla'
];

const getRandomValue = (position: PlayerPosition): number => {
  const baseValues = {
    [PlayerPosition.GOALKEEPER]: { min: 800000, max: 2000000 },
    [PlayerPosition.DEFENDER]: { min: 600000, max: 1800000 },
    [PlayerPosition.MIDFIELDER]: { min: 700000, max: 2200000 },
    [PlayerPosition.ATTACKER]: { min: 900000, max: 2500000 }
  };
  
  const range = baseValues[position];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

const getRandomName = (position: PlayerPosition): string => {
  const names = playerNames[position];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomTeamName = (): string => {
  return teamNames[Math.floor(Math.random() * teamNames.length)];
};

export const generateInitialPlayers = (): PlayerData[] => {
  const players: PlayerData[] = [];
  
  // Generate 3 Goalkeepers
  for (let i = 0; i < 3; i++) {
    players.push({
      name: `${getRandomName(PlayerPosition.GOALKEEPER)} ${i + 1}`,
      position: PlayerPosition.GOALKEEPER,
      value: getRandomValue(PlayerPosition.GOALKEEPER)
    });
  }
  
  // Generate 6 Defenders
  for (let i = 0; i < 6; i++) {
    players.push({
      name: `${getRandomName(PlayerPosition.DEFENDER)} ${i + 1}`,
      position: PlayerPosition.DEFENDER,
      value: getRandomValue(PlayerPosition.DEFENDER)
    });
  }
  
  // Generate 6 Midfielders
  for (let i = 0; i < 6; i++) {
    players.push({
      name: `${getRandomName(PlayerPosition.MIDFIELDER)} ${i + 1}`,
      position: PlayerPosition.MIDFIELDER,
      value: getRandomValue(PlayerPosition.MIDFIELDER)
    });
  }
  
  // Generate 5 Attackers
  for (let i = 0; i < 5; i++) {
    players.push({
      name: `${getRandomName(PlayerPosition.ATTACKER)} ${i + 1}`,
      position: PlayerPosition.ATTACKER,
      value: getRandomValue(PlayerPosition.ATTACKER)
    });
  }
  
  return players.map(player => ({
    ...player,
    name: `${player.name} (${getRandomTeamName()})`
  }));
};

export const generateTeamName = (): string => {
  const adjectives = ['United', 'City', 'FC', 'Athletic', 'Rovers', 'Wanderers'];
  const cities = ['London', 'Manchester', 'Liverpool', 'Birmingham', 'Leeds', 'Newcastle'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  return `${city} ${adjective}`;
};
