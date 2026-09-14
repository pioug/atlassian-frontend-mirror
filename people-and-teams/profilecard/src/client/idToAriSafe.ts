/// <reference types="node" />
// for typing `process`

import { ARI_PREFIX } from './ariPrefix';
import { idToAri } from './idToAri';

export const idToAriSafe = (teamIdOrTeamAri: string): string =>
	teamIdOrTeamAri.startsWith(ARI_PREFIX) ? teamIdOrTeamAri : idToAri(teamIdOrTeamAri);
