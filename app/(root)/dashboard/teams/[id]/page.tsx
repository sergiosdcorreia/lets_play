"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { teamsApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useHydration } from "@/hooks/useHydration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditTeamDialog } from "@/components/teams/EditTeamDialog";
import { DeleteTeamDialog } from "@/components/teams/DeleteTeamDialog";
import { LeaveTeamDialog } from "@/components/teams/LeaveTeamDialog";
import { TeamMembersList } from "@/components/teams/TeamMembersList";
import { InviteMemberDialog } from "@/components/teams/InviteMemberDialog";
import { ArrowLeft, Users, Calendar, Trophy, Target } from "lucide-react";
import Link from "next/link";

export default function TeamDetailsPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const hydrated = useHydration();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const teamId = params.id as string;

  useEffect(() => {
    if (!hydrated) return;

    const fetchTeam = async () => {
      try {
        const response = await teamsApi.getById(teamId);
        setTeam(response.data.team);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch team");
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [hydrated, teamId]);

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/teams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Link>
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || "Team not found"}
        </div>
      </div>
    );
  }

  const isManager = user?.id === team.managerId;
  const memberCount = team.members?.length || 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/teams">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Link>
      </Button>

      {/* Team Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Team Badge */}
          <div
            className="w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg"
            style={{ backgroundColor: team.primaryColor || "#3b82f6" }}
          >
            {team.name.charAt(0).toUpperCase()}
          </div>

          {/* Team Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            {team.description && (
              <p className="text-gray-600 mt-1">{team.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>
                Managed by{" "}
                <span className="font-medium">
                  {team.manager?.name || "Unknown"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isManager ? (
            <>
              <EditTeamDialog team={team} />
              <DeleteTeamDialog teamId={team.id} teamName={team.name} />
            </>
          ) : (
            <LeaveTeamDialog teamId={team.id} teamName={team.name} />
          )}
        </div>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Members
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Matches Played
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Wins
            </CardTitle>
            <Trophy className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Goals
            </CardTitle>
            <Target className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({memberCount})</CardTitle>
                {isManager && (
                  <InviteMemberDialog teamId={team.id} teamName={team.name} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {team.members && team.members.length > 0 ? (
                <TeamMembersList
                  members={team.members}
                  managerId={team.managerId}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No members yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p>No matches yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p>Statistics will appear here after matches</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
