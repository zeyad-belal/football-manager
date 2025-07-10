import React, { useState, useCallback, useEffect } from "react";
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragItem, Player, PlayerPosition } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getPositionColor } from "@/utils";

interface FieldViewProps {
  players: Player[];
  onClose: () => void;
}
interface PlayerSlotProps {
  player: Player | null;
  position: string;
  onDrop: (draggedPlayer: Player, fromFormation: boolean) => void;
  className?: string;
}
interface SubstitutePlayerProps {
  player: Player;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({
  player,
  position,
  onDrop,
  className = "",
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "player",
    drop: (item: DragItem) => {
      onDrop(item.player, item.fromFormation);
    },
    canDrop: (item: DragItem) => {
      // Position validation for visual feedback
      if (position === "GK")
        return item.player.position === PlayerPosition.GOALKEEPER;
      if (position === "DEF")
        return item.player.position === PlayerPosition.DEFENDER;
      if (position === "MID")
        return item.player.position === PlayerPosition.MIDFIELDER;
      if (position === "ATT")
        return item.player.position === PlayerPosition.ATTACKER;
      return false;
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: "player",
    item: player
      ? { id: player._id, type: "player", player, fromFormation: true }
      : null,
    canDrag: !!player,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      className={`
        relative w-20 h-24 rounded-xl transition-all duration-300 cursor-pointer
        ${isOver && canDrop ? "scale-110 shadow-lg" : ""}
        ${isOver && !canDrop ? "scale-95 opacity-50" : ""}
        ${isDragging ? "opacity-30 scale-95" : ""}
        ${className}
      `}
    >
      {player ? (
        <div className="relative">
          {/* Player Circle */}
          <div
            className={`w-16 h-16 mx-auto bg-gradient-to-br ${getPositionColor(
              position
            )} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white`}
          >
            {player.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          {/* Player Info */}
          <div className="mt-1 text-center">
            <div className="text-xs font-bold text-white drop-shadow-lg">
              {player.name.split(" ")[0]}
            </div>
            <div className="text-xs text-white opacity-90 drop-shadow">
              ${(player.value / 1000000).toFixed(1)}M
            </div>
          </div>
          {/* Hover Effect */}
          <div className="absolute inset-0 rounded-xl bg-white opacity-0 hover:opacity-10 transition-opacity duration-200" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          {/* Empty Slot Circle */}
          <div
            className={`w-16 h-16 bg-gradient-to-br ${getPositionColor(
              position
            )} rounded-full flex items-center justify-center border-2 border-dashed border-white opacity-40`}
          >
            <span className="text-white font-bold text-xs">{position}</span>
          </div>
          <div className="mt-1 text-xs text-white opacity-60 font-medium">
            {position}
          </div>
        </div>
      )}

      {/* Drop Zone Indicator */}
      {isOver && (
        <div
          className={`absolute inset-0 rounded-xl border-2 ${
            canDrop
              ? "border-green-400 bg-green-100"
              : "border-red-400 bg-red-100"
          } opacity-50`}
        />
      )}
    </div>
  );
};

const SubstitutePlayer: React.FC<SubstitutePlayerProps> = ({ player }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "player",
    item: { id: player._id, type: "player", player, fromFormation: false },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move
        hover:shadow-md transition-all duration-200
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${getPositionColor(
          player.position
        )} flex items-center justify-center text-white text-sm font-bold mr-3`}
      >
        {player.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {player.name}
        </div>
        <div className="text-xs text-gray-500">
          {player.position} • ${(player.value / 1000000).toFixed(1)}M
        </div>
      </div>
    </div>
  );
};

const FieldView: React.FC<FieldViewProps> = ({ players, onClose }) => {
  const FORMATION_STORAGE_KEY = 'football-manager-formation';

  // Save formation to localStorage
  const saveFormationToStorage = (formationData: {
    gk: Player | null;
    defenders: (Player | null)[];
    midfielders: (Player | null)[];
    attackers: (Player | null)[];
  }) => {
    try {
      // Convert formation to a serializable format (store only player IDs)
      const serializableFormation = {
        gk: formationData.gk?._id || null,
        defenders: formationData.defenders.map((p: Player | null) => p?._id || null),
        midfielders: formationData.midfielders.map((p: Player | null) => p?._id || null),
        attackers: formationData.attackers.map((p: Player | null) => p?._id || null),
      };
      localStorage.setItem(FORMATION_STORAGE_KEY, JSON.stringify(serializableFormation));
    } catch (error) {
      console.error('Failed to save formation to localStorage:', error);
    }
  };

  // Load formation from localStorage
  const loadFormationFromStorage = () => {
    try {
      const savedFormation = localStorage.getItem(FORMATION_STORAGE_KEY);
      if (!savedFormation) return null;

      const parsedFormation = JSON.parse(savedFormation);
      
      // Convert player IDs back to player objects
      const gk = parsedFormation.gk 
        ? players.find((p) => p._id === parsedFormation.gk) || null 
        : null;
      
      const defenders = parsedFormation.defenders.map((id: string | null): Player | null => 
        id ? players.find((p) => p._id === id) || null : null
      );
      
      const midfielders = parsedFormation.midfielders.map((id: string | null): Player | null => 
        id ? players.find((p) => p._id === id) || null : null
      );
      
      const attackers = parsedFormation.attackers.map((id: string | null): Player | null => 
        id ? players.find((p) => p._id === id) || null : null
      );

      return {
        gk,
        defenders,
        midfielders,
        attackers,
      };
    } catch (error) {
      console.error('Failed to load formation from localStorage:', error);
      return null;
    }
  };

  // Initialize formation with best 11 players (sorted by value as proxy for quality)
  const initializeFormation = () => {
    // First try to load from localStorage
    const savedFormation = loadFormationFromStorage();
    if (savedFormation) {
      return savedFormation;
    }

    // If no saved formation, create default formation
    const gk =
      players
        .filter((p) => p.position === PlayerPosition.GOALKEEPER)
        .sort((a, b) => b.value - a.value)[0] || null;
    const defenders = players
      .filter((p) => p.position === PlayerPosition.DEFENDER)
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
    const midfielders = players
      .filter((p) => p.position === PlayerPosition.MIDFIELDER)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    const attackers = players
      .filter((p) => p.position === PlayerPosition.ATTACKER)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    // Pad arrays with null values to ensure correct length
    const paddedDefenders: (Player | null)[] = [...defenders];
    while (paddedDefenders.length < 4) paddedDefenders.push(null);

    const paddedMidfielders: (Player | null)[] = [...midfielders];
    while (paddedMidfielders.length < 3) paddedMidfielders.push(null);

    const paddedAttackers: (Player | null)[] = [...attackers];
    while (paddedAttackers.length < 3) paddedAttackers.push(null);

    return {
      gk: gk as Player | null,
      defenders: paddedDefenders.slice(0, 4),
      midfielders: paddedMidfielders.slice(0, 3),
      attackers: paddedAttackers.slice(0, 3),
    };
  };

  const [formation, setFormation] = useState(initializeFormation());

  // Save formation to localStorage whenever it changes
  useEffect(() => {
    saveFormationToStorage(formation);
  }, [formation]);

  const getSubstitutes = () => {
    const formationPlayers: Player[] = [
      ...(formation.gk ? [formation.gk] : []),
      ...formation.defenders.filter(
        (player: Player | null): player is Player => player !== null
      ),
      ...formation.midfielders.filter(
        (player: Player | null): player is Player => player !== null
      ),
      ...formation.attackers.filter(
        (player: Player | null): player is Player => player !== null
      ),
    ];

    return players.filter(
      (player) => !formationPlayers.some((fp) => fp._id === player._id)
    );
  };

  const handlePlayerDrop = useCallback((position: string, index: number) => {
    return (draggedPlayer: Player, fromFormation: boolean) => {
      // Position validation - only allow players in their correct positions
      const isValidPosition = (player: Player, targetPosition: string) => {
        if (targetPosition === "gk")
          return player.position === PlayerPosition.GOALKEEPER;
        if (targetPosition === "defenders")
          return player.position === PlayerPosition.DEFENDER;
        if (targetPosition === "midfielders")
          return player.position === PlayerPosition.MIDFIELDER;
        if (targetPosition === "attackers")
          return player.position === PlayerPosition.ATTACKER;
        return false;
      };

      if (!isValidPosition(draggedPlayer, position)) {
        // Invalid position - don't allow the drop
        return;
      }

      setFormation((prev) => {
        const newFormation = { ...prev };

        // First, identify where the dragged player is coming from
        let draggedPlayerOriginalPosition: string | null = null;
        let draggedPlayerOriginalIndex: number = -1;

        if (fromFormation) {
          if (prev.gk?._id === draggedPlayer._id) {
            draggedPlayerOriginalPosition = "gk";
          } else {
            ["defenders", "midfielders", "attackers"].forEach((pos) => {
              const posArray = prev[
                pos as keyof typeof prev
              ] as (Player | null)[];
              const playerIndex = posArray.findIndex(
                (p) => p?._id === draggedPlayer._id
              );
              if (playerIndex !== -1) {
                draggedPlayerOriginalPosition = pos;
                draggedPlayerOriginalIndex = playerIndex;
              }
            });
          }
        }

        // Place player in new position and handle swapping
        if (position === "gk") {
          const currentPlayer = newFormation.gk;
          newFormation.gk = draggedPlayer;

          // If there was a player there and we're moving from formation, swap them
          if (currentPlayer && fromFormation && draggedPlayerOriginalPosition) {
            if (draggedPlayerOriginalPosition === "gk") {
              // Moving within same position, shouldn't happen
            } else {
              (
                newFormation[
                  draggedPlayerOriginalPosition as keyof typeof newFormation
                ] as (Player | null)[]
              )[draggedPlayerOriginalIndex] = currentPlayer;
            }
          } else if (fromFormation && draggedPlayerOriginalPosition) {
            // Clear the original position if no swap needed
            if (draggedPlayerOriginalPosition === "gk") {
              newFormation.gk = null;
            } else {
              (
                newFormation[
                  draggedPlayerOriginalPosition as keyof typeof newFormation
                ] as (Player | null)[]
              )[draggedPlayerOriginalIndex] = null;
            }
          }
        } else {
          const posArray = newFormation[
            position as keyof typeof newFormation
          ] as (Player | null)[];
          const currentPlayer = posArray[index];
          posArray[index] = draggedPlayer;

          // If there was a player there and we're moving from formation, swap them
          if (currentPlayer && fromFormation && draggedPlayerOriginalPosition) {
            if (draggedPlayerOriginalPosition === "gk") {
              newFormation.gk = currentPlayer;
            } else {
              (
                newFormation[
                  draggedPlayerOriginalPosition as keyof typeof newFormation
                ] as (Player | null)[]
              )[draggedPlayerOriginalIndex] = currentPlayer;
            }
          } else if (fromFormation && draggedPlayerOriginalPosition) {
            // Clear the original position if no swap needed
            if (draggedPlayerOriginalPosition === "gk") {
              newFormation.gk = null;
            } else {
              (
                newFormation[
                  draggedPlayerOriginalPosition as keyof typeof newFormation
                ] as (Player | null)[]
              )[draggedPlayerOriginalIndex] = null;
            }
          }
        }

        return newFormation;
      });
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Field View - 4-3-3 Formation
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">↕</span>
                </div>
                <span>Drag players to rearrange formation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⇄</span>
                </div>
                <span>Swap players between positions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💾</span>
                </div>
                <span>Formation auto-saves</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Football Field */}
            <div className="flex-1 p-6">
              <div
                className="relative w-full h-96 lg:h-[600px] rounded-xl shadow-2xl overflow-hidden"
                style={{
                  background: `
                    radial-gradient(ellipse at center, #22c55e 0%, #16a34a 50%, #15803d 100%),
                    linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                    linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
                    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)
                  `,
                  backgroundSize:
                    "100% 100%, 30px 30px, 30px 30px, 30px 30px, 30px 30px",
                  backgroundPosition: "0 0, 0 0, 15px 0, 15px -15px, 0px 15px",
                }}
              >
                {/* Field Border */}
                <div className="absolute inset-3 border-4 border-white border-opacity-80 rounded-lg">
                  {/* Center Line */}
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-white bg-opacity-80"></div>

                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white border-opacity-90 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>

                  {/* Penalty Areas */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-12 border-3 border-white border-opacity-80 border-t-0 rounded-b-lg"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-12 border-3 border-white border-opacity-80 border-b-0 rounded-t-lg"></div>

                  {/* Goal Areas */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-6 border-2 border-white border-opacity-80 border-t-0"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-6 border-2 border-white border-opacity-80 border-b-0"></div>

                  {/* Corner Arcs */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-r-2 border-b-2 border-white border-opacity-60 rounded-br-full"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-l-2 border-b-2 border-white border-opacity-60 rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-r-2 border-t-2 border-white border-opacity-60 rounded-tr-full"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-l-2 border-t-2 border-white border-opacity-60 rounded-tl-full"></div>
                </div>

                {/* Goalkeeper */}
                <div className="absolute md:bottom-12 bottom-7 left-1/2 transform -translate-x-1/2">
                  <PlayerSlot
                    player={formation.gk}
                    position="GK"
                    onDrop={handlePlayerDrop("gk", 0)}
                  />
                </div>

                {/* Defenders (4) */}
                <div className="absolute lg:bottom-28 bottom-20 left-1/2 transform -translate-x-1/2 flex md:space-x-16 space-x-[2rem]">
                  {formation.defenders.map((player: Player | null, index: number) => (
                    <PlayerSlot
                      key={`def-${index}`}
                      player={player}
                      position="DEF"
                      onDrop={handlePlayerDrop("defenders", index)}
                    />
                  ))}
                </div>

                {/* Midfielders (3) */}
                <div className="absolute lg:bottom-64 bottom-[9rem] left-1/2 transform -translate-x-1/2 flex md:space-x-[12rem] space-x-[4rem]">
                  {formation.midfielders.map((player: Player | null, index: number) => (
                    <PlayerSlot
                      key={`mid-${index}`}
                      player={player}
                      position="MID"
                      onDrop={handlePlayerDrop("midfielders", index)}
                    />
                  ))}
                </div>

                {/* Attackers (3) */}
                <div className="absolute lg:bottom-[28rem] bottom-[16rem] left-1/2 transform -translate-x-1/2 flex md:space-x-20 space-x-[4rem]">
                  {formation.attackers.map((player: Player | null, index: number) => (
                    <PlayerSlot
                      key={`att-${index}`}
                      player={player}
                      position="ATT"
                      onDrop={handlePlayerDrop("attackers", index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Substitutes */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Substitutes ({getSubstitutes().length})
              </h3>
              <div className="space-y-3 max-h-[35rem] overflow-y-auto">
                {getSubstitutes().map((player) => (
                  <SubstitutePlayer key={player._id} player={player} />
                ))}
              </div>
              {getSubstitutes().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-sm">
                    All players are in the formation
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FieldView;
