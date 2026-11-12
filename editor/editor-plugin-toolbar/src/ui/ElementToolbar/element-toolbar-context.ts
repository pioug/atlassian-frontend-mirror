import { createContext, useContext } from 'react';
import type { Context } from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type ElementToolbarContextValue = {
	node: PMNode;
	nodePos: number;
};

/**
 * State of the element toolbar the host is showing, starting with its node. The node changes on
 * each edit inside it, so `ElementToolbarPopup` re-renders and repositions without re-rendering
 * the toolbar items.
 */
export const ElementToolbarContext: Context<ElementToolbarContextValue | undefined> = createContext<
	ElementToolbarContextValue | undefined
>(undefined);

export const useElementToolbarContext = (): ElementToolbarContextValue | undefined =>
	useContext(ElementToolbarContext);
