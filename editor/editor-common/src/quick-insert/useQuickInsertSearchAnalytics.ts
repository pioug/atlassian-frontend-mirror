import { useCallback, useEffect, useRef } from 'react';

import type { EditorAnalyticsAPI } from '../analytics/api';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics/types/enums';
import type {
	QuickInsertSearchOutcomeEventPayload,
	QuickInsertSearchSurface,
} from '../analytics/types/quick-insert-events';

type Options = {
	category?: string;
	fireAnalyticsEvent?: EditorAnalyticsAPI['fireAnalyticsEvent'];
	isOpen?: boolean;
	query: string;
	resultCount: number;
	surface: QuickInsertSearchSurface;
};

type PendingSearch = {
	query: string;
	timer: ReturnType<typeof setTimeout>;
};

const SEARCH_DEBOUNCE_MS = 1000;

export const useQuickInsertSearchAnalytics = ({
	query,
	resultCount,
	surface,
	category,
	isOpen = true,
	fireAnalyticsEvent,
}: Options): (() => void) => {
	const latestOptions = useRef({ query, resultCount, surface, category, fireAnalyticsEvent });
	latestOptions.current = { query, resultCount, surface, category, fireAnalyticsEvent };
	const pendingSearch = useRef<PendingSearch | null>(null);
	const effectVersion = useRef(0);

	const flush = useCallback(() => {
		const pending = pendingSearch.current;
		if (!pending) {
			return;
		}

		clearTimeout(pending.timer);
		pendingSearch.current = null;

		const current = latestOptions.current;
		if (current.query.trim() !== pending.query || !current.fireAnalyticsEvent) {
			return;
		}

		const attributes = {
			...(current.surface === 'element-browser' && current.category !== undefined
				? { category: current.category }
				: {}),
			isEmpty: current.resultCount === 0,
			queryLength: current.query.trim().length,
			resultCount: current.resultCount,
			surface: current.surface,
		};

		const payload: QuickInsertSearchOutcomeEventPayload = {
			action: ACTION.SEARCHED,
			actionSubject: ACTION_SUBJECT.QUICK_INSERT,
			eventType: EVENT_TYPE.TRACK,
			attributes,
		};

		current.fireAnalyticsEvent(payload);
	}, []);

	useEffect(() => {
		const currentVersion = ++effectVersion.current;

		if (!isOpen) {
			flush();
			return;
		}

		const trimmedQuery = query.trim();
		if (!trimmedQuery) {
			if (pendingSearch.current) {
				clearTimeout(pendingSearch.current.timer);
				pendingSearch.current = null;
			}
			return;
		}

		if (pendingSearch.current) {
			clearTimeout(pendingSearch.current.timer);
		}

		const timer = setTimeout(flush, SEARCH_DEBOUNCE_MS);
		pendingSearch.current = {
			query: trimmedQuery,
			timer,
		};

		return () => {
			if (pendingSearch.current) {
				clearTimeout(pendingSearch.current.timer);
			}

			Promise.resolve().then(() => {
				// oxlint-disable-next-line react-hooks/exhaustive-deps -- The live effect version distinguishes dependency cleanup from a real unmount.
				if (effectVersion.current === currentVersion) {
					flush();
				}
			});
		};
	}, [query, surface, category, isOpen, flush]);

	return flush;
};
