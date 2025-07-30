export { isFedRamp } from './services/host-based-lookup/is-fedramp';
export { getATLContextUrl, getATLContextDomain } from './services/host-based-lookup/domain-lookup';
export type { Perimeter, DomainConfig } from './common/constants/host-based-lookup/types';
export { isFedrampModerate, isIsolatedCloud, isolatedCloudDomain, isolationContextId } from './services/perimeter';
export { getDomainInContext, getUrlForDomainInContext } from './services/generalized-domain-lookup';
