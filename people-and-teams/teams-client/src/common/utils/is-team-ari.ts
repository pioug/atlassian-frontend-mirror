import { TEAM_ARI_PREFIX, type TeamARI } from '../types';

export const isTeamARI = (ari: string): ari is TeamARI => ari.startsWith(TEAM_ARI_PREFIX);
