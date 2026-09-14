import { useContext } from 'react';

import InteractionContext from '@atlaskit/interaction-context';

import type { UFOInteractionContextType } from './index';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function useInteractionContext(): any {
	return useContext(InteractionContext) as UFOInteractionContextType | null;
}
