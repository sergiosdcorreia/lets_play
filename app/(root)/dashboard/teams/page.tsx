"use client";

import { useEffect, useState } from "react";
import { teamsApi } from "@/lib/api";
import { useHydration } from "@/hooks/useHydration";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { TeamCard } from "@/components/teams/TeamCard";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

export default function TeamsPage() {
  const hydrated = useHydration();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) return;

    const fetchTeams = async () => {
      try {
        const response = await teamsApi.getMyTeams();
        setTeams(response.data.teams);
        setFilteredTeams(response.data.teams);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch teams");
        console.error("Failed to fetch teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [hydrated]);

  // Filter teams based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTeams(teams);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query)
    );
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
          <p className="text-gray-600 mt-1">
            Manage your teams and organize matches
          </p>
        </div>
        <CreateTeamDialog />
      </div>

      {/* Search */}
      {teams.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : teams.length === 0 ? (
        // Empty State - No teams at all
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No teams yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first team to start organizing matches
          </p>
          <CreateTeamDialog />
        </div>
      ) : (
        // No results from search
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No teams found
          </h3>
          <p className="text-gray-600 mb-6">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
