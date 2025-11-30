"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface MatchDetailsDialogProps {
  match: Match | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRSVP?: (matchId: string, status: "confirmed" | "declined") => void;
}

export function MatchDetailsDialog({
  match,
  open,
  onOpenChange,
  onRSVP,
}: MatchDetailsDialogProps) {
  if (!match) return null;

  const matchDate = new Date(match.date);
  const isPast = matchDate < new Date();
  const confirmedPlayers = match.players?.filter(p => p.status === "confirmed") || [];
  const pendingPlayers = match.players?.filter(p => p.status === "pending") || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Match Details</DialogTitle>
          <DialogDescription>
            {format(matchDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Match Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{format(matchDate, "PPP")}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{format(matchDate, "p")} • {match.duration} minutes</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{match.venue?.name}</span>
              <span className="text-gray-500">• {match.venue?.city}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{confirmedPlayers.length} player{confirmedPlayers.length !== 1 ? 's' : ''} confirmed</span>
            </div>
          </div>

          {match.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{match.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Players List */}
          <div>
            <h4 className="text-sm font-semibold mb-3">
              Players ({confirmedPlayers.length + pendingPlayers.length})
            </h4>

            {confirmedPlayers.length > 0 && (
              <div className="space-y-2 mb-3">
                <p className="text-xs text-gray-500 uppercase font-medium">Confirmed</p>
                {confirmedPlayers.map((player) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-600 text-white text-xs">
                        {getInitials(player.user?.name || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{player.user?.name}</span>
                    <Badge variant="secondary" className="ml-auto">Confirmed</Badge>
                  </div>
                ))}
              </div>
            )}

            {pendingPlayers.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
                {pendingPlayers.map((player) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-400 text-white text-xs">
                        {getInitials(player.user?.name || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{player.user?.name}</span>
                    <Badge variant="outline" className="ml-auto">Pending</Badge>
                  </div>
                ))}
              </div>
            )}

            {confirmedPlayers.length === 0 && pendingPlayers.length === 0 && (
              <p className="text-sm text-gray-500">No players yet</p>
            )}
          </div>

          {/* RSVP Actions */}
          {!isPast && match.status === "scheduled" && onRSVP && (
            <>
              <Separator />
              <div className="flex gap-3">
                <Button
                  variant="default"
                  onClick={() => {
                    onRSVP(match.id, "confirmed");
                    onOpenChange(false);
                  }}
                  className="flex-1"
                >
                  Confirm Attendance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onRSVP(match.id, "declined");
                    onOpenChange(false);
                  }}
                  className="flex-1"
                >
                  Decline
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
