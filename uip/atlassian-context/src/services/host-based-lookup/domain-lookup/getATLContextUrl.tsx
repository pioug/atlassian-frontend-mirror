import { type DomainKey } from '../../../common/constants/host-based-lookup/types';

import { getATLContextDomain } from './getATLContextDomain';

export function getATLContextUrl(domain: DomainKey | string): string {
	return `${globalThis.location?.protocol ?? 'https:'}//${getATLContextDomain(domain)}`;
}
