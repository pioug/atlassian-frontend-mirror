import type { RovoConfig } from '../state/hooks/use-rovo-config';

export const getIsRovoChatEnabled = (rovoConfig?: RovoConfig): boolean =>
	rovoConfig?.isRovoEnabled && rovoConfig?.isRovoLLMEnabled ? true : false;
