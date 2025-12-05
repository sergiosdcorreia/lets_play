"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tournamentsApi, teamsApi } from "@/lib/api";
import { useHydration } from "@/hooks/useHydration";
import { TournamentStandings } from "@/components/tournaments/TournamentStandings";
import { TournamentFixtures } from "@/components/tournaments/TournamentFixtures";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Trophy, Users, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const hydrated = useHydration();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (!hydrated || !id) return;
    fetchTournamentData();
    fetchMyTeams();
  }, [hydrated, id]);

  const fetchTournamentData = async () => {
    try {
      const [tournamentRes, standingsRes] = await Promise.all([
        tournamentsApi.getById(id as string),
        tournamentsApi.getStandings(id as string),
      ]);
      
      setTournament(tournamentRes.data.tournament);
      setStandings(standingsRes.data.standings);
      setMatches(tournamentRes.data.tournament.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tournament");
      console.error("Failed to load tournament:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeams = async () => {
    try {
      const response = await teamsApi.getMyTeams();
      setMyTeams(response.data.teams);
    } catch (err) {
      console.error("Failed to fetch my teams:", err);
    }
  };

  const handleInviteTeam = async (teamId: string) => {
    setInviteLoading(true);
    try {
      await tournamentsApi.inviteTeam(id as string, teamId);
      setInviteOpen(false);
      fetchTournamentData();
    } catch (err) {
      console.error("Failed to invite team:", err);
    } finally {
      setInviteLoading(false);
    }
  };

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-900">Tournament not found</h3>
      </div>
    );
  }

  const isOwner = true; // TODO: Check ownership properly

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
              <Badge variant="secondary" className="text-sm">
                {tournament.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <p className="text-gray-600 max-w-2xl">{tournament.description}</p>
            
            <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(tournament.startDate), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="capitalize">{tournament.format} Format</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{tournament.teams?.length || 0} Teams</span>
              </div>
            </div>
          </div>

          {isOwner && tournament.status === "upcoming" && (
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team to Tournament</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Select onValueChange={handleInviteTeam} disabled={inviteLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team..." />
                    </SelectTrigger>
                    <SelectContent>
                      {myTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="standings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="teams">Teams ({tournament.teams?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="standings">
          <TournamentStandings standings={standings} />
        </TabsContent>

        <TabsContent value="fixtures">
          <TournamentFixtures 
            tournamentId={tournament.id} 
            matches={matches} 
            onUpdate={fetchTournamentData}
            isOwner={isOwner}
          />
        </TabsContent>

        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.teams?.map((team) => (
              <div key={team.id} className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between">
                <span className="font-semibold">{team.name}</span>
                <Badge variant="outline">Participating</Badge>
              </div>
            ))}
            {(!tournament.teams || tournament.teams.length === 0) && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No teams have joined yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
