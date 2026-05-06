import { legacyColors } from './legacy-colors';

export const isLegacyColor: (value: string) => boolean = (value: string) =>
	legacyColors.includes(value);
