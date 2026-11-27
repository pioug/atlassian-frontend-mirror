import React, { useContext, useInsertionEffect, useMemo, useRef } from 'react';

import AnalyticsReactContext from '@atlaskit/analytics-next/AnalyticsReactContext';
import type { UIAnalyticsEventHandler } from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { getDefaultEnrichers } from './get-default-enrichers';
import type { EventEnricher } from './types';

/**
 * Enriches descendant and portal events through modern analytics context.
 * Legacy analytics providers bypass these handlers and send the original payload,
 * even when the first-in-session experiment assigns the host to treatment.
 */
export function AnalyticsEnrichmentBoundary({
	appearance,
	children,
	enrichers,
}: {
	appearance?: string;
	children: React.ReactNode;
	/** Replaces the default enrichers. */
	enrichers?: readonly EventEnricher[];
}): React.JSX.Element {
	const parent = useContext(AnalyticsReactContext);
	const enrichAnalytics =
		typeof window !== 'undefined' &&
		isExperimentEnabled('platform_editor_first_in_activity_session');
	const activeEnrichers = useMemo(
		() => (enrichAnalytics ? (enrichers ?? getDefaultEnrichers()) : undefined),
		[enrichAnalytics, enrichers],
	);
	const optionsRef = useRef({ activeEnrichers, appearance });
	// Keep the analytics factory stable for the EditorView's ref callback.
	useInsertionEffect(() => {
		optionsRef.current = { activeEnrichers, appearance };
	}, [activeEnrichers, appearance]);

	const context = useMemo(() => {
		const enrich: UIAnalyticsEventHandler = (event) => {
			const { activeEnrichers, appearance } = optionsRef.current;
			if (!activeEnrichers) {
				return;
			}
			const options = { event: event.payload, appearance };
			let additions: Record<string, unknown> | undefined;
			for (const enrichEvent of activeEnrichers) {
				const attributes = enrichEvent(options);
				if (attributes) {
					additions = { ...additions, ...attributes };
				}
			}
			if (additions) {
				event.update({ attributes: { ...event.payload.attributes, ...additions } });
			}
		};
		return {
			getAtlaskitAnalyticsContext: parent.getAtlaskitAnalyticsContext,
			getAtlaskitAnalyticsEventHandlers: () => {
				const handlers = parent.getAtlaskitAnalyticsEventHandlers();
				return optionsRef.current.activeEnrichers && handlers.length
					? [enrich, ...handlers]
					: handlers;
			},
		};
	}, [parent]);
	// Keep descendants mounted when the experiment assignment changes.
	return (
		<AnalyticsReactContext.Provider value={context}>{children}</AnalyticsReactContext.Provider>
	);
}
