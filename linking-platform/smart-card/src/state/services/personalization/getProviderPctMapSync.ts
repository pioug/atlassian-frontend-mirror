import { personalizationService } from './index';
import type { ProviderPctMap } from './types';

export function getProviderPctMapSync(
	cloudId: string | undefined,
	traitName: string,
): ProviderPctMap | null {
	return personalizationService.getProviderPctMapSync(cloudId, traitName);
}
