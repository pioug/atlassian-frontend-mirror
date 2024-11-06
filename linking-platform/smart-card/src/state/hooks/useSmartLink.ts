import { useEffect, useState } from 'react';

import { useSmartLinkContext } from '@atlaskit/link-provider';

import { useSmartCardActions as useSmartLinkActions } from '../actions';
import { useSmartLinkAnalytics } from '../analytics';
import { useSmartLinkConfig } from '../config';
import { useSmartLinkRenderers } from '../renderers';
import { useSmartCardState as useSmartLinkState } from '../store';

export function useSmartLink(id: string, url: string) {
	const state = useSmartLinkState(url);
	const { store } = useSmartLinkContext();
	const analytics = useSmartLinkAnalytics(url, id);
	const actions = useSmartLinkActions(id, url, analytics);
	const config = useSmartLinkConfig();
	const renderers = useSmartLinkRenderers();

	// NB: used to propagate errors from hooks to error boundaries.
	const [error, setError] = useState<Error | null>(null);
	// Register the current card.
	const register = () => {
		actions.register().catch((err) => setError(err));
	};
	// AFP-2511 TODO: Fix automatic suppressions below
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(register, [url, store]);

	// Provide the state and card actions to consumers.
	return {
		state,
		actions,
		config,
		analytics,
		renderers,
		error,
	};
}
