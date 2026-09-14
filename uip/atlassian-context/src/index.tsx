/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { isFedRamp } from '@atlassian/atlassian-context/is-fedramp'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { isFedRamp } from './services/host-based-lookup/is-fedramp';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { getATLContextDomain } from '@atlassian/atlassian-context/get-atl-context-domain'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { getATLContextDomain } from './services/host-based-lookup/domain-lookup/getATLContextDomain';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { getATLContextUrl } from '@atlassian/atlassian-context/get-atl-context-url'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { getATLContextUrl } from './services/host-based-lookup/domain-lookup/getATLContextUrl';
export type { Perimeter, DomainConfig } from './common/constants/host-based-lookup/types';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { isFedrampModerate } from '@atlassian/atlassian-context/is-fedramp-moderate'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { isFedrampModerate } from './services/perimeter/isFedrampModerate';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { isIsolatedCloud } from '@atlassian/atlassian-context/is-isolated-cloud'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { isIsolatedCloud } from './services/perimeter/isIsolatedCloud';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { isolatedCloudDomain } from '@atlassian/atlassian-context/isolated-cloud-domain'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { isolatedCloudDomain } from './services/perimeter/isolatedCloudDomain';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { isolationContextId } from '@atlassian/atlassian-context/isolation-context-id'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { isolationContextId } from './services/perimeter/isolationContextId';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { getDomainInContext } from '@atlassian/atlassian-context/get-domain-in-context'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { getDomainInContext } from './services/generalized-domain-lookup/getDomainInContext';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import { getUrlForDomainInContext } from '@atlassian/atlassian-context/get-url-for-domain-in-context'`.
 * Retained only while consumers migrate off the root barrel.
 */
export { getUrlForDomainInContext } from './services/generalized-domain-lookup/getUrlForDomainInContext';
