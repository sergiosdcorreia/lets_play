declare global {
  interface SignInFormData {
    email: string;
    password: string;
  }

  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
  };

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };

  interface User {
    id: string;
    email: string;
    name: string;
    position?: string;
    skillLevel?: number;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  interface AuthResponse {
    user: User;
    token: string;
    message: string;
  }

  // Team types
  interface Team {
    id: string;
    name: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    description?: string;
    managerId: string;
    subManagerId?: string;
    manager?: User;
    subManager?: User;
    members?: TeamMember[];
    createdAt: string;
    updatedAt: string;
  }

  interface TeamMember {
    id: string;
    teamId: string;
    userId: string;
    role: string;
    status: string;
    joinedAt?: string;
    leftAt?: string;
    user?: User;
  }

  interface CreateTeamInput {
    name: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    description?: string;
    subManagerId?: string;
  }

  interface UpdateTeamInput {
    name?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    description?: string;
    subManagerId?: string | null;
  }

  // Tournament types
  interface Tournament {
    id: string;
    name: string;
    description?: string;
    format: "league" | "knockout" | "custom";
    startDate: string;
    status: "upcoming" | "in_progress" | "completed" | "cancelled";
    autoGenerateMatches: boolean;
    createdById: string;
    createdBy?: User;
    teams?: TournamentTeam[];
    matches?: Match[];
    createdAt: string;
    updatedAt: string;
  }

  interface TournamentTeam {
    id: string;
    tournamentId: string;
    teamId: string;
    status: "invited" | "confirmed" | "declined";
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    team?: Team;
    joinedAt?: string;
  }

  interface CreateTournamentInput {
    name: string;
    description?: string;
    format: "league" | "knockout" | "custom";
    startDate: string;
    autoGenerateMatches?: boolean;
  }

  interface UpdateTournamentInput {
    name?: string;
    description?: string;
    format?: "league" | "knockout" | "custom";
    startDate?: string;
    status?: "upcoming" | "in_progress" | "completed" | "cancelled";
  }

  // Match types
  interface Match {
    id: string;
    date: string;
    duration: number;
    venueId: string;
    status: "scheduled" | "completed" | "cancelled";
    notes?: string;
    tournamentId?: string;
    homeTeamId?: string;
    awayTeamId?: string;
    homeScore?: number;
    awayScore?: number;
    createdById: string;
    venue?: Venue;
    players?: MatchPlayer[];
    tournament?: Tournament;
    createdAt: string;
    updatedAt: string;
  }

  interface MatchPlayer {
    id: string;
    matchId: string;
    userId: string;
    status: "pending" | "confirmed" | "declined";
    team?: string;
    user?: User;
  }

  interface CreateMatchInput {
    date: string;
    duration?: number;
    venueId: string;
    notes?: string;
    tournamentId?: string;
    homeTeamId?: string;
    awayTeamId?: string;
  }

  interface UpdateMatchInput {
    date?: string;
    duration?: number;
    venueId?: string;
    notes?: string;
    status?: "scheduled" | "completed" | "cancelled";
  }

  // Venue types
  interface Venue {
    id: string;
    name: string;
    address: string;
    city: string;
    surface: string;
    capacity: number;
    pricePerHour?: number;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    updatedAt: string;
  }

  interface CreateVenueInput {
    name: string;
    address: string;
    city: string;
    surface: string;
    capacity: number;
    pricePerHour?: number;
    latitude?: number;
    longitude?: number;
  }

  // Statistics types
  interface PlayerStats {
    player: User;
    statistics: {
      matchesPlayed: number;
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
      goalsPerMatch: string;
      assistsPerMatch: string;
    };
    recentEvents: MatchEvent[];
  }

  interface MatchEvent {
    id: string;
    matchId: string;
    playerId: string;
    eventType: "goal" | "assist" | "yellow_card" | "red_card";
    minute?: number;
    notes?: string;
    player?: User;
    createdAt: string;
  }

  interface LeaderboardEntry {
    rank: number;
    player: User;
    goal?: number;
    assist?: number;
  }

  interface CreateMatchEventInput {
    playerId: string;
    eventType: "goal" | "assist" | "yellow_card" | "red_card";
    minute?: number;
    notes?: string;
  }

  // Standing types
  interface Standing {
    rank: number;
    team: Team;
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }

  // Fixture generation types
  interface GenerateFixturesInput {
    venueId: string;
    startDate: string;
    daysPerRound?: number;
  }
}

export {};
