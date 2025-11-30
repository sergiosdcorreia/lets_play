import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  onViewDetails?: (match: Match) => void;
  onRSVP?: (matchId: string, status: "confirmed" | "declined") => void;
}

export function MatchCard({ match, onViewDetails, onRSVP }: MatchCardProps) {
  const matchDate = new Date(match.date);
  const isPast = matchDate < new Date();
  const confirmedPlayers = match.players?.filter(p => p.status === "confirmed").length || 0;

  const getStatusBadge = () => {
    if (match.status === "completed") {
      return <Badge variant="secondary">Completed</Badge>;
    }
    if (match.status === "cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (isPast) {
      return <Badge variant="secondary">Past</Badge>;
    }
    return <Badge className="bg-green-600">Upcoming</Badge>;
  };

  return (
    <Card className="glassmorphism-card backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails?.(match)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-semibold text-gray-900">
                {format(matchDate, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{format(matchDate, "h:mm a")}</span>
              <span className="text-gray-400">•</span>
              <span>{match.duration} min</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{match.venue?.name}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="h-4 w-4 text-gray-500" />
          <span>{confirmedPlayers} player{confirmedPlayers !== 1 ? 's' : ''} confirmed</span>
        </div>

        {match.notes && (
          <p className="text-sm text-gray-600 line-clamp-2">{match.notes}</p>
        )}

        {!isPast && match.status === "scheduled" && onRSVP && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onRSVP(match.id, "confirmed");
              }}
              className="flex-1"
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onRSVP(match.id, "declined");
              }}
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
