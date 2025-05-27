import { useState, useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { FindReplacePlugin } from '../../findReplacePluginType';
import type { FindReplacePluginState } from '../../types';

// custom non-debounced hook for the find-replace plugin shared state
export function useFindReplacePluginStateSelector<Key extends keyof FindReplacePluginState>(
	api: ExtractInjectionAPI<FindReplacePlugin> | null | undefined,
	key: Key,
): FindReplacePluginState[Key] | undefined {
	const [selectedState, setSelectedState] = useState<FindReplacePluginState[Key] | undefined>(
		() => {
			const currentState = api?.findReplace.sharedState.currentState();
			return currentState?.[key];
		},
	);
	const previousStateRef = useRef<FindReplacePluginState[Key] | undefined>(selectedState);

	useEffect(() => {
		const unsub = api?.findReplace.sharedState.onChange(({ nextSharedState }) => {
			const newState = nextSharedState?.[key];
			if (!isEqual(previousStateRef.current, newState)) {
				previousStateRef.current = newState;
				setSelectedState(newState);
			}
		});

		return () => {
			unsub?.();
		};
	}, [api, key]);

	return selectedState;
}
