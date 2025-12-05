"use client";

import { useEffect, useState } from "react";
import { tournamentsApi } from "@/lib/api";
import { useHydration } from "@/hooks/useHydration";
import { CreateTournamentDialog } from "@/components/tournaments/CreateTournamentDialog";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { Input } from "@/components/ui/input";
import { Search, Trophy } from "lucide-react";

export default function TournamentsPage() {
  const hydrated = useHydration();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    fetchTournaments();
  }, [hydrated]);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentsApi.getAll();
      setTournaments(response.data.tournaments);
      setFilteredTournaments(response.data.tournaments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tournaments");
      console.error("Failed to fetch tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter tournaments based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTournaments(tournaments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tournaments.filter(
      (tournament) =>
        tournament.name.toLowerCase().includes(query) ||
        tournament.description?.toLowerCase().includes(query)
    );
    setFilteredTournaments(filtered);
  }, [searchQuery, tournaments]);

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
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <p className="text-gray-600 mt-1">
            Create and join tournaments to compete for glory
          </p>
        </div>
        <CreateTournamentDialog onTournamentCreated={fetchTournaments} />
      </div>

      {/* Search */}
      {tournaments.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tournaments..."
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

      {/* Tournaments Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tournaments found
          </h3>
          <p className="text-gray-600 mb-6">
            {tournaments.length === 0
              ? "Create your first tournament to get started"
              : "No tournaments match your search"}
          </p>
          {tournaments.length === 0 && (
            <CreateTournamentDialog onTournamentCreated={fetchTournaments} />
          )}
        </div>
      )}
    </div>
  );
}
