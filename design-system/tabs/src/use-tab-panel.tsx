import { useContext } from 'react';

import { TabPanelContext } from './internal/tab-panel-context';

export default function useTabPanel(): import('./types').TabPanelAttributesType {
	const tabPanelData = useContext(TabPanelContext);
	if (tabPanelData === null || typeof tabPanelData === 'undefined') {
		throw Error('@atlaskit/tabs:  A TabPanel must have a Tabs parent.');
	}
	return tabPanelData;
}
