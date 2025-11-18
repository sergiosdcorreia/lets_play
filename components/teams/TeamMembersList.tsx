"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface TeamMembersListProps {
  members: TeamMember[];
  managerId: string;
}

export function TeamMembersList({ members, managerId }: TeamMembersListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isManager = member.userId === managerId;

        return (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user?.avatar} />
                    <AvatarFallback className="bg-green-600 text-white">
                      {member.user?.name ? getInitials(member.user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.user?.name}</p>
                      {isManager && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {member.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      member.status === "active" ? "default" : "secondary"
                    }
                  >
                    {member.status}
                  </Badge>
                  {isManager && <Badge variant="outline">Manager</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
