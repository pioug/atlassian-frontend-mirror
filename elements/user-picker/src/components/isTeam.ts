import { type OptionData, type Team, TeamType } from '../types';

export const isTeam = (option: OptionData): option is Team => option?.type === TeamType;
