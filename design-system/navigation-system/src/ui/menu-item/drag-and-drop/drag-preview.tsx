/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { ExpandableMenuItemLevelContext } from '../expandable-menu-item/expandable-menu-item-level-context';
import { MenuItemBase } from '../menu-item';
import { COLLAPSE_ELEM_BEFORE } from '../menu-item-signals';

// Using JavaScript for detecting Safari, as I could not find a reliable way to do it with CSS.
function isSafari(): boolean {
	if (process.env.NODE_ENV === 'test') {
		return false;
	}

	if (typeof window === 'undefined') {
		return false;
	}

	const { userAgent } = navigator;
	return userAgent.includes('AppleWebKit') && !userAgent.includes('Chrome');
}

const dragPreviewStyles = cssMap({
	root: {
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		backgroundColor: token('elevation.surface'),
		// menu items already have a border radius, but adding on this element too
		// as we are adding a border on this element
		borderRadius: token('border.radius'),

		// helps the preview feel more feel more balanced
		paddingInlineEnd: token('space.050'),
		// cannot go above 280px (web platform limitation), so leaving a bit of room
		maxWidth: 260,
	},

	/**
	 * Unfortunately native drag previews in Safari do not work well with `-webkit-line-clamp`,
	 * and the width of the drag preview collapses down to be much smaller than it should be.
	 *
	 * To get around this, we explicitly set a min width for safari, causing the preview to always
	 * be at least that size (it will still grow up to the max width)
	 *
	 * This is only a temporary measure. We plan on removing `Text` from menu item as a true fix.
	 *
	 * _Alternative: bespoke grid and elements for the drag preview_
	 *
	 * We could make our own elements here that mirror what menu item is doing (placement and spacing),
	 * but that feels brittle, as if we make a change to menu item, we would also need to update this call site
	 */
	safariFix: {
		minWidth: 200,
	},
});

/**
 * A drag preview for sidebar menu items.
 *
 * The limited API corresponds with the limited amount of information we
 * want to show in drag previews.
 *
 * If no `elemBefore` is provided, then the `elemBefore` will automatically collapse.
 * There is no need to pass in `COLLAPSE_ELEM_BEFORE`. We do this as there is no
 * need to maintain vertical side navigation vertical alignment in the drag preview.
 *
 * Please ensure the drag preview is pushed away from the users pointer
 * (with `pointerOutsideOfPreview()` from Pragmatic drag and drop) by our
 * standard amount (`{x: token('space.200'), y: token('space.100')`)
 */
export function DragPreview({
	elemBefore,
	children,
}: {
	elemBefore?: ReactNode;
	children: ReactNode;
}) {
	return (
		// Resetting the expandable menu items to 0.
		// This is to prevent our hidden element from pushing
		// the drag preview further away from the users pointer
		<ExpandableMenuItemLevelContext.Provider value={0}>
			<div css={[dragPreviewStyles.root, isSafari() && dragPreviewStyles.safariFix]}>
				{/* For drag previews, we can collapse if there is no elemBefore as we don't
			need to worry about vertical alignment with other elements */}
				<MenuItemBase elemBefore={elemBefore ?? COLLAPSE_ELEM_BEFORE}>{children}</MenuItemBase>
			</div>
		</ExpandableMenuItemLevelContext.Provider>
	);
}
