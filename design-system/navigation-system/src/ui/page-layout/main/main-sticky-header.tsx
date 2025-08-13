/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';

const stickyHeaderStyles = cssMap({
	root: {
		position: 'sticky',
		zIndex: 1,
		insetBlockStart: 0,
	},
});

/**
 * The sticky header of the main layout area.
 */
export function MainStickyHeader({
	children,
	xcss,
	testId,
}: {
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * The content of the layout area.
	 */
	children?: React.ReactNode;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
}) {
	return (
		<div data-testid={testId} className={xcss} css={stickyHeaderStyles.root}>
			{children}
		</div>
	);
}
