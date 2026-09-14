/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { SmartCardProvider } from './smart-card-provider';
import { SMART_CARD_EXTERNAL_AUTH_EVENT } from './smart-card-external-auth-event';
import { type CardProviderProps } from './state/context/types';

/**
 * @deprecated Use `import { SMART_CARD_EXTERNAL_AUTH_EVENT } from '@atlaskit/link-provider/smart-card-external-auth-event'` instead.
 */
export { SMART_CARD_EXTERNAL_AUTH_EVENT };

/**
 * @deprecated Use `import type { CardProviderProps } from '@atlaskit/link-provider/types'` instead.
 */
export type { CardProviderProps as ProviderProps };

/**
 * @deprecated Use `import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider'` instead.
 */
export default SmartCardProvider;

/**
 * @deprecated Use `import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider'` instead.
 */
export { SmartCardProvider } from './smart-card-provider';
