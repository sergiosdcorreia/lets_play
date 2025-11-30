"use client";

import { useEffect, useState } from "react";
import { matchesApi } from "@/lib/api";
import { useHydration } from "@/hooks/useHydration";
import { CreateMatchDialog } from "@/components/matches/CreateMatchDialog";
import { MatchCard } from "@/components/matches/MatchCard";
import { MatchDetailsDialog } from "@/components/matches/MatchDetailsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";

export default function MatchesPage() {
  const hydrated = useHydration();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    fetchMatches();
  }, [hydrated]);

  const fetchMatches = async () => {
    try {
      const response = await matchesApi.getMyMatches();
      setMatches(response.data.matches);
      setFilteredMatches(response.data.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter matches based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMatches(matches);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = matches.filter(
      (match) =>
        match.venue?.name.toLowerCase().includes(query) ||
        match.venue?.city.toLowerCase().includes(query) ||
        match.notes?.toLowerCase().includes(query)
    );
    setFilteredMatches(filtered);
  }, [searchQuery, matches]);

  const handleRSVP = async (matchId: string, status: "confirmed" | "declined") => {
    try {
      await matchesApi.rsvp(matchId, status);
      await fetchMatches();
    } catch (err) {
      console.error("Failed to RSVP:", err);
    }
  };

  const handleViewDetails = (match: Match) => {
    setSelectedMatch(match);
    setDetailsOpen(true);
  };

  // Split matches into upcoming and past
  const now = new Date();
  const upcomingMatches = filteredMatches.filter(
    (match) => new Date(match.date) >= now && match.status !== "cancelled"
  );
  const pastMatches = filteredMatches.filter(
    (match) => new Date(match.date) < now || match.status === "completed"
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-600 mt-1">
            View and manage your football matches
          </p>
        </div>
        <CreateMatchDialog onMatchCreated={fetchMatches} />
      </div>

      {/* Search */}
      {matches.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search matches by venue or location..."
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

      {/* Matches Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMatches.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Matches */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onViewDetails={handleViewDetails}
                  onRSVP={handleRSVP}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No upcoming matches
              </h3>
              <p className="text-gray-600 mb-6">
                {matches.length === 0
                  ? "Create your first match to get started"
                  : "No upcoming matches found"}
              </p>
              {matches.length === 0 && <CreateMatchDialog onMatchCreated={fetchMatches} />}
            </div>
          )}
        </TabsContent>

        {/* Past Matches */}
        <TabsContent value="past" className="space-y-4">
          {pastMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No past matches
              </h3>
              <p className="text-gray-600">
                Your match history will appear here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Match Details Dialog */}
      <MatchDetailsDialog
        match={selectedMatch}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onRSVP={handleRSVP}
      />
    </div>
  );
}
