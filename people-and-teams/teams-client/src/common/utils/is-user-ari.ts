import { USER_ARI_PREFIX, type UserARI } from '../types';

export const isUserARI = (ari: string): ari is UserARI => ari.startsWith(USER_ARI_PREFIX);
