/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';

import { MainStickyContext } from './main-sticky-context';

const contentInsetBlockStart = `calc(var(--n_bnrM, 0px) + var(--n_tNvM, 0px))`;

const stickyHeaderStyles = cssMap({
	root: {
		position: 'sticky',
		zIndex: 1,
	},
	stickyInMain: {
		insetBlockStart: 0,
	},
	stickyInBody: {
		insetBlockStart: contentInsetBlockStart,
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
	const isMainFixed = useContext(MainStickyContext);

	return (
		<div
			data-testid={testId}
			className={xcss}
			css={[
				stickyHeaderStyles.root,
				isMainFixed && stickyHeaderStyles.stickyInMain,
				!isMainFixed && stickyHeaderStyles.stickyInBody,
			]}
		>
			{children}
		</div>
	);
}
