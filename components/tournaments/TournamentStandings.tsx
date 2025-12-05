import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TournamentStandingsProps {
  standings: Standing[];
}

export function TournamentStandings({ standings }: TournamentStandingsProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No standings available yet.
      </div>
    );
  }

  // Sort standings by points (desc), then goal difference (desc), then goals for (desc)
  const sortedStandings = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="rounded-md border bg-white/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-[60px]">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GA</TableHead>
            <TableHead className="text-center">GD</TableHead>
            <TableHead className="text-center font-bold">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStandings.map((standing, index) => (
            <TableRow key={standing.id}>
              <TableCell className="font-medium text-gray-500">
                {index + 1}
              </TableCell>
              <TableCell className="font-semibold">
                {standing.team?.name || "Unknown Team"}
              </TableCell>
              <TableCell className="text-center">{standing.played}</TableCell>
              <TableCell className="text-center">{standing.won}</TableCell>
              <TableCell className="text-center">{standing.drawn}</TableCell>
              <TableCell className="text-center">{standing.lost}</TableCell>
              <TableCell className="text-center text-gray-500">{standing.goalsFor}</TableCell>
              <TableCell className="text-center text-gray-500">{standing.goalsAgainst}</TableCell>
              <TableCell className="text-center font-medium">
                {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
              </TableCell>
              <TableCell className="text-center font-bold text-lg">
                {standing.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
