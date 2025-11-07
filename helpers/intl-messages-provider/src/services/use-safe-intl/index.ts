import { useContext } from 'react';

import { createIntl, createIntlCache, IntlContext, type IntlShape } from 'react-intl-next';

import { DEFAULT_LOCALE_STATE } from '../../common/constants';

// Prevents memory leaks
const cache = createIntlCache();

/**
 * Returns current context from `IntlShape`. When there is no context returns
 * an `IntlShape` with default `{locale: 'en', messages: {}}`
 * Removes the need for an `IntlProvodier` to be present in the DOM Tree
 */
export const useSafeIntl = (): IntlShape => {
	const context = useContext(IntlContext);
	if (!context) {
		return createIntl(DEFAULT_LOCALE_STATE, cache);
	}
	return context;
};
