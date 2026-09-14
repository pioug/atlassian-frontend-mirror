import { personalizationService } from './index';
import type { ProviderPctMap } from './types';

export const getProviderPctMap = (
	cloudId: string | undefined,
	traitName: string,
): Promise<ProviderPctMap | undefined> =>
	personalizationService.getProviderPctMap(cloudId, traitName);
