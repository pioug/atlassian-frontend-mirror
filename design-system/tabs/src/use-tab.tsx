import { useContext } from 'react';

import { TabContext } from './internal/tab-context';

// TODO: Fill in the hook {description}.
/**
 * {description}.
 */
export default function useTab(): import('./types').TabAttributesType {
	const tabData = useContext(TabContext);
	if (tabData == null || typeof tabData === 'undefined') {
		throw Error('@atlaskit/tabs: A Tab must have a TabList parent.');
	}
	return tabData;
}
