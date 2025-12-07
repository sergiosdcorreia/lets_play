"use client";

import { useEffect, useState } from "react";
import { statsApi } from "@/lib/api";
import { LeaderboardTable } from "@/components/statistics/LeaderboardTable";
import { useHydration } from "@/hooks/useHydration";
import { Trophy, TrendingUp } from "lucide-react";

export default function StatisticsPage() {
  const hydrated = useHydration();
  const [topScorers, setTopScorers] = useState<LeaderboardEntry[]>([]);
  const [topAssists, setTopAssists] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;

    const fetchData = async () => {
      try {
        const [scorersRes, assistsRes] = await Promise.all([
          statsApi.getLeaderboard("goal", 10),
          statsApi.getLeaderboard("assist", 10),
        ]);
        setTopScorers(scorersRes.data.leaderboard);
        setTopAssists(assistsRes.data.leaderboard);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Statistics</h1>
        <p className="text-gray-600 mt-2">
          Top performers across all tournaments and matches.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2>Top Scorers</h2>
          </div>
          <LeaderboardTable 
            data={topScorers} 
            type="goal" 
            title="Goals Leaderboard" 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <h2>Top Assists</h2>
          </div>
          <LeaderboardTable 
            data={topAssists} 
            type="assist" 
            title="Assists Leaderboard" 
          />
        </div>
      </div>
    </div>
  );
}
