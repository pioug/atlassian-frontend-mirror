import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import { elementBrowserPmKey } from './elementBrowser';

/**
 * For insert menu in right rail experiment
 * - Clean up ticket ED-24801
 */
export const toggleInsertMenuRightRail = (tr: Transaction) => {
	return tr.setMeta(elementBrowserPmKey, { update: true });
};
