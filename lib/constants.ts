import {
  Home,
  Users,
  Trophy,
  Calendar,
  TrendingUp,
  LogOut,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/teams",
    label: "Teams",
    icon: Users,
  },
  {
    href: "/tournaments",
    label: "Tournaments",
    icon: Trophy,
  },
  {
    href: "/matches",
    label: "Matches",
    icon: Calendar,
  },
  {
    href: "/statistics",
    label: "Statistics",
    icon: TrendingUp,
  },
];
