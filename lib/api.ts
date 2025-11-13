import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),
  getCurrentUser: () => api.get<{ user: User }>("/users/me"),
};

// Teams API
export const teamsApi = {
  getAll: () => api.get<{ teams: Team[] }>("/teams"),
  getById: (id: string) => api.get<{ team: Team }>(`/teams/${id}`),
  getMyTeams: () => api.get<{ teams: Team[] }>("/teams/my/teams"),
  create: (data: CreateTeamInput) =>
    api.post<{ message: string; team: Team }>("/teams", data),
  update: (id: string, data: UpdateTeamInput) =>
    api.put<{ message: string; team: Team }>(`/teams/${id}`, data),
  delete: (id: string) => api.delete<{ message: string }>(`/teams/${id}`),
  invite: (id: string, userId: string, role: string) =>
    api.post(`/teams/${id}/invite`, { userId, role }),
  rsvp: (id: string, status: "active" | "declined") =>
    api.post(`/teams/${id}/rsvp`, { status }),
  leave: (id: string) => api.post<{ message: string }>(`/teams/${id}/leave`),
};

// Tournaments API
export const tournamentsApi = {
  getAll: (params?: { status?: string }) =>
    api.get<{ tournaments: Tournament[] }>("/tournaments", { params }),
  getById: (id: string) =>
    api.get<{ tournament: Tournament }>(`/tournaments/${id}`),
  getStandings: (id: string) =>
    api.get<{
      tournament: { id: string; name: string; format: string };
      standings: Standing[];
    }>(`/tournaments/${id}/standings`),
  create: (data: CreateTournamentInput) =>
    api.post<{ message: string; tournament: Tournament }>("/tournaments", data),
  update: (id: string, data: UpdateTournamentInput) =>
    api.put<{ message: string; tournament: Tournament }>(
      `/tournaments/${id}`,
      data
    ),
  delete: (id: string) => api.delete<{ message: string }>(`/tournaments/${id}`),
  inviteTeam: (id: string, teamId: string) =>
    api.post(`/tournaments/${id}/invite`, { teamId }),
  rsvp: (id: string, status: "confirmed" | "declined") =>
    api.post(`/tournaments/${id}/rsvp`, { status }),
  createMatch: (id: string, data: CreateMatchInput) =>
    api.post<{ message: string; match: Match }>(
      `/tournaments/${id}/matches`,
      data
    ),
  completeMatch: (
    id: string,
    matchId: string,
    homeScore: number,
    awayScore: number
  ) =>
    api.post<{ message: string; match: Match }>(
      `/tournaments/${id}/matches/${matchId}/complete`,
      { homeScore, awayScore }
    ),
  generateFixtures: (id: string, data: GenerateFixturesInput) =>
    api.post(`/tournaments/${id}/generate-fixtures`, data),
};

// Matches API
export const matchesApi = {
  getAll: (params?: { status?: string; upcoming?: boolean }) =>
    api.get<{ matches: Match[] }>("/matches", { params }),
  getById: (id: string) => api.get<{ match: Match }>(`/matches/${id}`),
  getMyMatches: () => api.get<{ matches: Match[] }>("/matches/my/matches"),
  create: (data: CreateMatchInput) =>
    api.post<{ message: string; match: Match }>("/matches", data),
  update: (id: string, data: UpdateMatchInput) =>
    api.put<{ message: string; match: Match }>(`/matches/${id}`, data),
  delete: (id: string) => api.delete<{ message: string }>(`/matches/${id}`),
  invite: (id: string, userId: string) =>
    api.post(`/matches/${id}/invite`, { userId }),
  rsvp: (id: string, status: "confirmed" | "declined") =>
    api.post(`/matches/${id}/rsvp`, { status }),
};

// Statistics API
export const statsApi = {
  getLeaderboard: (type: "goal" | "assist", limit?: number) =>
    api.get<{ type: string; leaderboard: LeaderboardEntry[] }>(
      "/statistics/leaderboard",
      { params: { type, limit } }
    ),
  getPlayerStats: (userId: string) =>
    api.get<PlayerStats>(`/statistics/player/${userId}`),
  getMatchStats: (matchId: string) => api.get(`/statistics/match/${matchId}`),
  getMatchEvents: (matchId: string) =>
    api.get(`/statistics/match/${matchId}/events`),
  recordEvent: (matchId: string, data: CreateMatchEventInput) =>
    api.post(`/statistics/match/${matchId}/event`, data),
};

// Venues API
export const venuesApi = {
  getAll: () => api.get<{ venues: Venue[] }>("/venues"),
  getById: (id: string) => api.get<{ venue: Venue }>(`/venues/${id}`),
  create: (data: CreateVenueInput) =>
    api.post<{ message: string; venue: Venue }>("/venues", data),
};
