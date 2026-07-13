import { type DomainConfig } from '../../../common/constants/host-based-lookup/types';

export function configure(data: DomainConfig): void {
	if (!data || Object.keys(data).length < 1) {
		throw new Error('Data are not available');
	}

	// @ts-ignore - This is causing ts errors when this package is being enrolled into jira local consumption so temporarily ts ignoring this line for now
	globalThis.ATL_CONTEXT_DOMAIN = data;
}
