"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useHydration } from "@/hooks/useHydration";
import { teamsApi, tournamentsApi, matchesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Users,
  Trophy,
  Calendar,
  TrendingUp,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const hydrated = useHydration();

  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    const fetchData = async () => {
      try {
        const [teamsRes, tournamentsRes, matchesRes] = await Promise.all([
          teamsApi.getMyTeams(),
          tournamentsApi.getAll(),
          matchesApi.getMyMatches(),
        ]);

        setTeams(teamsRes.data.teams);
        setTournaments(tournamentsRes.data.tournaments.slice(0, 3)); // Latest 3
        setMatches(matchesRes.data.matches.slice(0, 5)); // Next 5
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hydrated]);

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glassmorphism-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Teams
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Active team memberships
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tournaments
            </CardTitle>
            <Trophy className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournaments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Ongoing tournaments</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming Matches
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
            <p className="text-xs text-gray-500 mt-1">Matches to play</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Skill Level
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 mt-1">Your rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Teams */}
        <Card className="lg:col-span-2 glassmorphism-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Teams</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/teams">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  You&apos;re not in any teams yet
                </p>
                <Button asChild>
                  <Link href="/dashboard/teams">Create your first team</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/dashboard/teams/${team.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{
                          background: team.primaryColor || "#3b82f6",
                        }}
                      >
                        {team.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{team.name}</p>
                        <p className="text-sm text-gray-500">
                          {team.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tournaments */}
        <Card className="glassmorphism-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tournaments</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/tournaments">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tournaments.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No tournaments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tournaments.map((tournament) => (
                  <Link
                    key={tournament.id}
                    href={`/dashboard/tournaments/${tournament.id}`}
                    className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{tournament.name}</p>
                      <Badge
                        variant={
                          tournament.status === "in_progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {tournament.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {tournament.teams?.length || 0} teams •{" "}
                      {tournament.matches?.length || 0} matches
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Matches */}
      <Card className="glassmorphism-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Matches</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/matches">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No upcoming matches</p>
              <Button asChild>
                <Link href="/dashboard/matches">Schedule a match</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/dashboard/matches/${match.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold">
                          {new Date(match.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-600">
                          {new Date(match.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{match.venue?.name}</span>
                      </div>
                      {match && (
                        <p className="text-xs text-gray-500 mt-1">
                          {match.players?.length} players confirmed
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
