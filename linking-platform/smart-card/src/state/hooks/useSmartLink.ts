import { useEffect, useState } from 'react';

import type { JsonLd } from '@atlaskit/json-ld-types';
import {
	useSmartLinkContext,
	type CardAuthFlowOpts,
	type CardProviderRenderers,
} from '@atlaskit/link-provider';
import type { CardState } from '@atlaskit/linking-common';

import type { InvokeClientOpts, InvokeServerOpts } from '../../model/invoke-opts';
import type { CardInnerAppearance } from '../../view/Card/types';
import { useSmartCardActions as useSmartLinkActions } from '../actions';
import { useSmartLinkConfig } from '../config';
import { useSmartLinkRenderers } from '../renderers';
import { useSmartCardState as useSmartLinkState } from '../store';

export function useSmartLink(
	id: string,
	url: string,
): {
	state: CardState;
	actions: {
		register: () => Promise<void>;
		reload: () => void;
		authorize: (appearance: CardInnerAppearance) => void;
		invoke: (
			opts: InvokeClientOpts | InvokeServerOpts,
			appearance: CardInnerAppearance,
		) => Promise<JsonLd.Response | void>;
		loadMetadata: () => Promise<void> | undefined;
	};
	config: CardAuthFlowOpts | undefined;
	renderers: CardProviderRenderers | undefined;
	error: Error | null;
	isPreviewPanelAvailable: ((props: { ari: string }) => boolean) | undefined;
	openPreviewPanel:
		| ((props: {
				ari: string;
				iconUrl: string | undefined;
				name: string;
				panelData: {
					embedUrl?: string;
				};
				url: string;
		  }) => void)
		| undefined;
} {
	const state = useSmartLinkState(url);
	const { store, isPreviewPanelAvailable, openPreviewPanel } = useSmartLinkContext();
	const actions = useSmartLinkActions(id, url);
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
		renderers,
		error,
		isPreviewPanelAvailable,
		openPreviewPanel,
	};
}
