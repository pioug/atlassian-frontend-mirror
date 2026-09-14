import { type DomainConfig } from '../../../common/constants/host-based-lookup/types';

export function configure(data: DomainConfig): void {
	if (!data || Object.keys(data).length < 1) {
		throw new Error('Data are not available');
	}

	globalThis.ATL_CONTEXT_DOMAIN = data;
}
