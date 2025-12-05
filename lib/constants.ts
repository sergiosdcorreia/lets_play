import { Home, Users, Trophy, Calendar, TrendingUp, User } from "lucide-react";

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/dashboard/teams",
    label: "Teams",
    icon: Users,
  },
  {
    href: "/dashboard/tournaments",
    label: "Tournaments",
    icon: Trophy,
  },
  {
    href: "/dashboard/matches",
    label: "Matches",
    icon: Calendar,
  },
  {
    href: "/dashboard/statistics",
    label: "Statistics",
    icon: TrendingUp,
  },
];
