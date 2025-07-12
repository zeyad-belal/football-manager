import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import PlayerCard from "@/components/PlayerCard";
import FieldView from "@/components/FieldView";
import { PlayerPosition } from "@/types";
import {
  Users,
  DollarSign,
  BarChart3,
  Clock,
  Grid3X3,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { team, refreshProfile } = useAuth();
  const [selectedPosition, setSelectedPosition] = useState<
    PlayerPosition | "all"
  >("all");
  const [showFieldView, setShowFieldView] = useState(false);

  if (!team) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Team Creation in Progress
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your team is being created. This may take a few moments.
            </p>
            <button onClick={refreshProfile} className="mt-4 btn-primary">
              Refresh
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredPlayers =
    selectedPosition === "all"
      ? team.players
      : team.players.filter((player) => player.position === selectedPosition);

  const getPlayerCountByPosition = (position: PlayerPosition) => {
    return team.players.filter((player) => player.position === position).length;
  };

  const playersOnTransferList = team.players.filter(
    (player) => player.isOnTransferList
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="px-2 sm:px-4 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Players
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {team.players.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Budget
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(team.budget)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      On Transfer List
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {playersOnTransferList}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Team Value
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(
                        team.players.reduce(
                          (sum, player) => sum + player.value,
                          0
                        )
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Position Summary */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Squad Overview
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {getPlayerCountByPosition(PlayerPosition.GOALKEEPER)}
                </div>
                <div className="text-sm text-gray-500">Goalkeepers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getPlayerCountByPosition(PlayerPosition.DEFENDER)}
                </div>
                <div className="text-sm text-gray-500">Defenders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {getPlayerCountByPosition(PlayerPosition.MIDFIELDER)}
                </div>
                <div className="text-sm text-gray-500">Midfielders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {getPlayerCountByPosition(PlayerPosition.ATTACKER)}
                </div>
                <div className="text-sm text-gray-500">Attackers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPosition("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedPosition === "all"
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All Players ({team.players.length})
              </button>
              {Object.values(PlayerPosition).map((position) => (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedPosition === position
                      ? "bg-primary-100 text-primary-700 border border-primary-200"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {position}s ({getPlayerCountByPosition(position)})
                </button>
              ))}
            </div>

            {/* Field View Button */}
            <button
              onClick={() => setShowFieldView(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Field View
            </button>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:gap-6 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player._id}
              player={player}
              isOwned={true}
              onUpdate={refreshProfile}
            />
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No players found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No players match the selected position filter.
            </p>
          </div>
        )}

        {/* Field View Modal */}
        {showFieldView && (
          <FieldView
            players={team.players}
            onClose={() => setShowFieldView(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
