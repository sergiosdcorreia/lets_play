"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const memberCount = team.members?.length || 0;

  return (
    <Link href={`/dashboard/teams/${team.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Team Color Badge */}
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md"
              style={{ backgroundColor: team.primaryColor || "#3b82f6" }}
            >
              {team.name.charAt(0).toUpperCase()}
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {team.name}
                  </h3>
                  {team.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{memberCount} members</span>
                </div>

                {/* Você pode adicionar mais stats depois */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>0 matches</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
