import { useContext } from 'react';

import { createIntl, createIntlCache, IntlContext, type IntlShape } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags';

import { DEFAULT_LOCALE_STATE, NEW_DEFAULT_LOCALE_STATE } from '../../common/constants';

// Prevents memory leaks
const cache = createIntlCache();

/**
 * Returns current context from `IntlShape`. When there is no context returns
 * an `IntlShape` with default `{locale: 'en', messages: {}}`
 * Removes the need for an `IntlProvider` to be present in the DOM Tree
 */
export const useSafeIntl = (): IntlShape => {
	const context = useContext(IntlContext);
	if (!context) {
		const defaultState = fg('navx-4615-fix-async-intl-for-gsn')
			? NEW_DEFAULT_LOCALE_STATE
			: DEFAULT_LOCALE_STATE;
		return createIntl(defaultState, cache);
	}
	return context;
};
