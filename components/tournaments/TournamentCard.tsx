import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const startDate = new Date(tournament.startDate);
  const isUpcoming = startDate > new Date();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="glassmorphism-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge className={getStatusColor(tournament.status)} variant="secondary">
              {tournament.status.replace("_", " ").toUpperCase()}
            </Badge>
            <CardTitle className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">
              {tournament.name}
            </CardTitle>
          </div>
          <Trophy className="h-8 w-8 text-yellow-500 opacity-80" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
            {tournament.description || "No description provided."}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{format(startDate, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{tournament.teams?.length || 0} Teams</span>
            </div>
          </div>

          <div className="pt-2">
            <Button asChild className="w-full group-hover:bg-primary/90">
              <Link href={`/dashboard/tournaments/${tournament.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
