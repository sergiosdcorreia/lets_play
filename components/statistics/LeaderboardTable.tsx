import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  type: "goal" | "assist";
  title: string;
}

export function LeaderboardTable({ data, type, title }: LeaderboardTableProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <div className="p-4 border-b bg-gray-50/50">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">{type === "goal" ? "Goals" : "Assists"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry) => (
              <TableRow key={entry.player.id}>
                <TableCell className="font-medium">#{entry.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.player.avatar || undefined} alt={entry.player.name} />
                      <AvatarFallback>{entry.player.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{entry.player.name}</span>
                      <span className="text-xs text-gray-500">{entry.player.position || "Unknown Position"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  {type === "goal" ? entry.goal : entry.assist}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
