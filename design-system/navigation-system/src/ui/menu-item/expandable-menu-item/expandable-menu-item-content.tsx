/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { List } from '../../../components/list';
import { expandableMenuItemIndentation } from '../constants';

import {
	AreAllAncestorsExpandedContext,
	LevelContext,
	useAreAllAncestorsExpanded,
	useIsExpanded,
	useLevel,
} from './expandable-menu-item-context';

const styles = cssMap({
	content: {
		// Padding is used to achieve alignment of content when nesting expandable menu items.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		paddingInlineStart: expandableMenuItemIndentation,
	},
	collapsedContent: {
		display: 'none',
	},
});

export type ExpandableMenuItemContentProps = {
	/**
	 * The contents of the expandable menu item.
	 */
	children: ReactNode;
};

/**
 * __ExpandableMenuItemContent__
 *
 * The expandable and collapsable section of the expandable menu item. It should contain the nested menu items.
 */
export const ExpandableMenuItemContent = forwardRef<HTMLDivElement, ExpandableMenuItemContentProps>(
	({ children }, forwardedRef) => {
		const isExpanded = useIsExpanded();
		const level = useLevel();
		const hasExpanded = useRef(false);
		const areAllAncestorsExpanded = useAreAllAncestorsExpanded();

		if (!isExpanded && !hasExpanded.current) {
			return null;
		}

		hasExpanded.current = true;

		return (
			<LevelContext.Provider value={level + 1}>
				{/**
				 * We are providing `AreAllAncestorsExpandedContext` in `ExpandableMenuItemContent` rather than within `ExpandableMenuItem`,
				 * so that the `ExpandableMenuItemTrigger` element is not affected by whether the current menu item is expanded or not.
				 *
				 * This is because the trigger is visually not a child of the `ExpandableMenuItem`. It is visible regardless
				 * of whether its `ExpandableMenuItem` is expanded or not.
				 */}
				<AreAllAncestorsExpandedContext.Provider
					value={
						/**
						 * By combining the current ancestor and with the current menu item's state, all nested menu items will know if their
						 * ancestor menu items are all expanded.
						 */
						areAllAncestorsExpanded && isExpanded
					}
				>
					<List
						ref={forwardedRef}
						xcss={cx(styles.content, !isExpanded && styles.collapsedContent)}
					>
						{children}
					</List>
				</AreAllAncestorsExpandedContext.Provider>
			</LevelContext.Provider>
		);
	},
);
