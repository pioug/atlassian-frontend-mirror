import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context/FabricEditorAnalyticsContext';

import { getAnalyticsAppearance } from '../../../utils/getAnalyticsAppearance';
import type { EnrichmentEvent } from '../types';
import { isFirstOccurrenceOnPageLoad } from './tracker';

export type IdentityMapper = (event: EnrichmentEvent) => string | null;

const appearances = new Set<string>(Object.values(EDITOR_APPEARANCE_CONTEXT));

/** Tracks the selected identity within its event and normalized Editor appearance. */
export function classifyEvent(
	event: EnrichmentEvent,
	appearance: string | undefined,
	identify: IdentityMapper,
	fallbackAppearance?: 'renderer',
): boolean | undefined {
	const value = appearance ?? event.attributes?.appearance;
	const surface = typeof value === 'string' ? value : undefined;
	const editorAppearance =
		(surface && appearances.has(surface) ? surface : getAnalyticsAppearance(surface)) ??
		fallbackAppearance;
	if (!editorAppearance) {
		return;
	}

	const identity = identify(event);
	if (identity === null) {
		return;
	}
	const { eventType, actionSubject, action } = event;
	return isFirstOccurrenceOnPageLoad(
		JSON.stringify([eventType, actionSubject, action, editorAppearance, identity]),
	);
}
