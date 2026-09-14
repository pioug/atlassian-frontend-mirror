/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type Context, createContext } from 'react';

import DefaultInteractionID, { type InteractionIDContextType } from './defaultInteractionId';

/**
 * @deprecated Use `import DefaultInteractionID from '@atlaskit/react-ufo/default-interaction-id'` instead.
 */
export { default as DefaultInteractionID } from './defaultInteractionId';
export type { InteractionIDContextType } from './defaultInteractionId';

// We use a context to allow modals to have their own lifecycle
const interactionContext: Context<InteractionIDContextType> =
	createContext<InteractionIDContextType>(DefaultInteractionID);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default interactionContext;
/**
 * @deprecated Use `import { subscribeToInteractionIdChanges } from '@atlaskit/react-ufo/subscribe-to-interaction-id-changes'` instead.
 */
export { subscribeToInteractionIdChanges } from './subscribeToInteractionIdChanges';
/**
 * @deprecated Use `import { getInteractionId } from '@atlaskit/react-ufo/get-interaction-id'` instead.
 */
export { getInteractionId } from './getInteractionId';
/**
 * @deprecated Use `import { useInteractionId } from '@atlaskit/react-ufo/use-interaction-id'` instead.
 */
export { useInteractionId } from './useInteractionId';
