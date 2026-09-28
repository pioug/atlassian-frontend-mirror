import { useContext } from 'react';

import { TabContext } from './internal/tab-context';
import { TabMotionContext } from './internal/tab-motion-context';

// TODO: Fill in the hook {description}.
/**
 * {description}.
 */
export default function useTab(): import('./types').TabAttributesType {
	const tabData = useContext(TabContext);
	const tabMotion = useContext(TabMotionContext);
	if (tabData == null || typeof tabData === 'undefined') {
		throw Error('@atlaskit/tabs: A Tab must have a TabList parent.');
	}
	if (tabMotion === null) {
		return tabData;
	}

	const index = tabData['aria-posinset'] - 1;

	return {
		...tabData,
		...tabMotion.getTabMotionAttributes(index),
	};
}
