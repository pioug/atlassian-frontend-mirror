import { useContext } from 'react';

import { TabListContext } from './internal/tab-list-context';

// TODO: Fill in the hook {description}.
/**
 * {description}.
 */
export default function useTabList(): import('./types').TabListAttributesType {
	const tabListData = useContext(TabListContext);
	if (tabListData === null || typeof tabListData === 'undefined') {
		throw Error('@atlaskit/tabs: A TabList must have a Tabs parent.');
	}
	return tabListData;
}
