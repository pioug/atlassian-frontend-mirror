import Fuse from 'fuse.js';

import type { RegisterMenuItemMatch } from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

type QuickInsertSearchData = {
	description?: string;
	keywords?: string[];
	shortcut?: string;
	title: string;
};

type FormatMessage = Parameters<RegisterMenuItemMatch>[0]['formatMessage'];

type QuickInsertMatcher = RegisterMenuItemMatch & {
	getSearchData?: (context: { formatMessage: FormatMessage }) => QuickInsertSearchData;
};

type QuickInsertMatcherFactory = {
	(
		getSearchData: (context: { formatMessage: FormatMessage }) => QuickInsertSearchData,
	): QuickInsertMatcher;
	getDescription?: (
		matcher: RegisterMenuItemMatch | undefined,
		formatMessage: FormatMessage,
	) => string | undefined;
};

const options = {
	includeScore: true,
	keys: [
		{ name: 'title', weight: 0.57 },
		{ name: 'keywords', weight: 0.08 },
		{ name: 'description', weight: 0.04 },
		{ name: 'shortcut', weight: 0.01 },
	],
	threshold: 0.3,
};

const normalizeScore = (score: number | undefined): number => Math.min(1, Math.max(0, score ?? 1));

const getDescription = (matcher: RegisterMenuItemMatch | undefined, formatMessage: FormatMessage) =>
	(matcher as QuickInsertMatcher | undefined)?.getSearchData?.({ formatMessage }).description;

/** Creates a cached matcher using consumer-formatted Quick Insert search data. */
export const createQuickInsertMatcher: QuickInsertMatcherFactory = (
	getSearchData: (context: { formatMessage: FormatMessage }) => QuickInsertSearchData,
): QuickInsertMatcher => {
	let cachedFormatMessage: FormatMessage | undefined;
	let fuse: Fuse<QuickInsertSearchData> | undefined;

	const matcher: QuickInsertMatcher = ({ formatMessage, query }) => {
		const normalizedQuery = query.trim();
		if (!normalizedQuery) {
			return { score: 0 };
		}

		if (!fuse || cachedFormatMessage !== formatMessage) {
			fuse = new Fuse([getSearchData({ formatMessage })], options);
			cachedFormatMessage = formatMessage;
		}

		const result = fuse.search(normalizedQuery)[0];
		return result ? { score: normalizeScore(result.score) } : null;
	};
	if (isExperimentEnabled('platform_editor_slash_command')) {
		matcher.getSearchData = getSearchData;
		createQuickInsertMatcher.getDescription = getDescription;
	}
	return matcher;
};
