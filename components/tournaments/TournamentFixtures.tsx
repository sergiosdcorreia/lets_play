"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { tournamentsApi, venuesApi } from "@/lib/api";
import { format } from "date-fns";
import { Loader2, Trophy, Calendar, MapPin } from "lucide-react";

interface TournamentFixturesProps {
  tournamentId: string;
  matches: Match[];
  onUpdate: () => void;
  isOwner: boolean;
}

export function TournamentFixtures({ tournamentId, matches, onUpdate, isOwner }: TournamentFixturesProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  
  // Generate fixtures state
  const [generateOpen, setGenerateOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [daysPerRound, setDaysPerRound] = useState("7");
  const [error, setError] = useState("");

  useEffect(() => {
    if (generateOpen && venues.length === 0) {
      loadVenues();
    }
  }, [generateOpen]);

  const loadVenues = async () => {
    try {
      const response = await venuesApi.getAll();
      setVenues(response.data.venues);
    } catch (err) {
      console.error("Failed to load venues:", err);
      setError("Failed to load venues");
    }
  };

  const handleScoreChange = (matchId: string, type: "home" | "away", value: string) => {
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [type]: value
      }
    }));
  };

  const handleCompleteMatch = async (matchId: string) => {
    const matchScores = scores[matchId];
    if (!matchScores?.home || !matchScores?.away) return;

    setLoading(matchId);
    try {
      await tournamentsApi.completeMatch(
        tournamentId,
        matchId,
        parseInt(matchScores.home),
        parseInt(matchScores.away)
      );
      onUpdate();
    } catch (error) {
      console.error("Failed to update match:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateFixtures = async () => {
    if (!selectedVenueId || !startDate) {
      setError("Please select a venue and start date");
      return;
    }

    setLoading("generate");
    setError("");
    
    try {
      await tournamentsApi.generateFixtures(tournamentId, { 
        venueId: selectedVenueId,
        startDate: new Date(startDate).toISOString(), 
        daysPerRound: parseInt(daysPerRound) || 7
      });
      setGenerateOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to generate fixtures:", error);
      setError("Failed to generate fixtures. Check if you have enough teams.");
    } finally {
      setLoading(null);
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Trophy className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No matches scheduled
        </h3>
        <p className="text-gray-600 mb-6">
          Generate fixtures to start the tournament.
        </p>
        
        {isOwner && (
          <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Generate Fixtures
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Tournament Fixtures</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name} ({venue.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Days Between Rounds</Label>
                  <Input 
                    type="number" 
                    min="1"
                    value={daysPerRound}
                    onChange={(e) => setDaysPerRound(e.target.value)}
                    placeholder="e.g. 7 for weekly"
                  />
                </div>

                <Button 
                  onClick={handleGenerateFixtures} 
                  disabled={!!loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white mt-4"
                >
                  {loading === "generate" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Fixtures"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // Group matches by round (if available) or date
  const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-4">
      {sortedMatches.map((match) => {
        const isCompleted = match.status === "completed";
        const homeTeam = match.homeTeam;
        const awayTeam = match.awayTeam;

        return (
          <Card key={match.id} className="glassmorphism-card backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
                  {format(new Date(match.date), "MMM d, h:mm a")}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <MapPin className="h-3 w-3" />
                    {match.venue?.name}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center gap-4 w-full">
                  {/* Home Team */}
                  <div className="flex-1 text-right font-semibold truncate">
                    {homeTeam?.name || "TBD"}
                  </div>

                  {/* Score / Inputs */}
                  <div className="flex items-center gap-2 min-w-[120px] justify-center">
                    {isCompleted ? (
                      <div className="flex items-center gap-2 text-xl font-bold">
                        <span>{match.homeScore}</span>
                        <span className="text-gray-400">-</span>
                        <span>{match.awayScore}</span>
                      </div>
                    ) : isOwner ? (
                      <>
                        <Input
                          type="number"
                          className="w-12 h-10 text-center p-1"
                          value={scores[match.id]?.home ?? ""}
                          onChange={(e) => handleScoreChange(match.id, "home", e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <Input
                          type="number"
                          className="w-12 h-10 text-center p-1"
                          value={scores[match.id]?.away ?? ""}
                          onChange={(e) => handleScoreChange(match.id, "away", e.target.value)}
                        />
                      </>
                    ) : (
                      <Badge variant="outline">vs</Badge>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 text-left font-semibold truncate">
                    {awayTeam?.name || "TBD"}
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto flex justify-center">
                  {!isCompleted && isOwner && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteMatch(match.id)}
                      disabled={loading === match.id || !scores[match.id]?.home || !scores[match.id]?.away}
                    >
                      {loading === match.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  )}
                  {isCompleted && (
                    <Badge variant="secondary" className="bg-gray-100">
                      Final
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
