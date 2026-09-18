/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import React, { createContext } from 'react';

import { type ProviderProps } from '../../provider';
import { SmartCardProvider } from '../../smart-card-provider';
import { type CardContext } from './types';

export const SmartCardContext: React.Context<CardContext | undefined> = createContext<
	CardContext | undefined
>(undefined);

export type { ProviderProps, CardContext };

export default SmartCardContext;

/**
 * @deprecated Use `import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider'` instead.
 */
export { SmartCardProvider };
/**
 * @deprecated Use `import { useSmartLinkContext } from '@atlaskit/link-provider/use-smart-link-context'` instead.
 */
export { useSmartLinkContext } from './useSmartLinkContext';
/**
 * @deprecated Use `import { useSmartCardContext } from '@atlaskit/link-provider/use-smart-card-context'` instead.
 */
export { useSmartCardContext } from './useSmartCardContext';
/**
 * @deprecated Use `import { EditorSmartCardProviderValueGuard } from '@atlaskit/link-provider/editor-smart-card-provider-value-guard'` instead.
 */
export { EditorSmartCardProviderValueGuard } from './EditorSmartCardProviderValueGuard';
/**
 * @deprecated Use `import { EditorSmartCardProvider } from '@atlaskit/link-provider/editor-smart-card-provider'` instead.
 */
export { EditorSmartCardProvider } from './EditorSmartCardProvider';
