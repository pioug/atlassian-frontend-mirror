/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';
import type { MouseEventHandler, ReactNode } from 'react';

import { jsx } from '@compiled/react';

import {
	cssMap,
	cx,
	type StrictXCSSProp,
	type XCSSAllProperties,
	type XCSSAllPseudos,
} from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	radiusUpdate: {
		borderRadius: token('radius.large'),
	},
	emptyMenuSectionStyles: {
		/*
		 * This is not great - but there is no way to know using React if a specific component returns null.
		 * This style hides a menu-section if there are no menu items inside of it
		 */
		// @ts-expect-error - nested selectors are not typed in cssMap
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-toolbar-component="menu-section"]:not(:has([data-toolbar-component="menu-item"]))': {
			display: 'none',
		},
		/*
		 * Hides the separator for any section that doesn't have any non-empty sections before it
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-toolbar-component="menu-section"]:not(:has([data-toolbar-component="menu-item"]) ~ *)': {
			borderBlockStart: 'none',
		},
	},
});

type ToolbarMenuContainerProps = {
	children?: ReactNode;
	onMouseDown?: MouseEventHandler<HTMLDivElement>;
	onMouseEnter?: MouseEventHandler<HTMLDivElement>;
	testId?: string;
	/**
	 * Additional styles to merge onto the menu surface (e.g. a max-width constraint).
	 */
	xcss?: StrictXCSSProp<Exclude<XCSSAllProperties, 'background'>, XCSSAllPseudos>;
};

/**
 * Shared visual shell for popup-hosted editor toolbar menus.
 *
 * This intentionally does not provide a trigger or popup positioning; callers own those concerns.
 */
export const ToolbarMenuContainer: React.ForwardRefExoticComponent<
	ToolbarMenuContainerProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, ToolbarMenuContainerProps>(
	({ children, onMouseDown, onMouseEnter, testId, xcss }, ref): React.JSX.Element => {
		return (
			<Box
				xcss={cx(
					styles.container,
					expValEquals('platform_editor_menu_radius_update', 'isEnabled', true) &&
						styles.radiusUpdate,
					expValEquals('platform_editor_menu_radius_update', 'isEnabled', true) &&
						styles.emptyMenuSectionStyles,
					expValEquals('platform_editor_menu_radius_update', 'isEnabled', true) && xcss,
				)}
				testId={testId}
				onMouseDown={onMouseDown}
				onMouseEnter={onMouseEnter}
				data-toolbar-component="menu"
				role="menu"
				ref={ref}
			>
				{children}
			</Box>
		);
	},
);
