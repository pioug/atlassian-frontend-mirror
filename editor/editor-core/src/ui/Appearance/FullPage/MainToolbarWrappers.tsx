/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const nonCustomToolbarWrapperCompiledStyles = cssMap({
	root: {
		alignItems: 'center',
		display: 'flex',
		flexGrow: 1,
	},
});

export const NonCustomToolbarWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={nonCustomToolbarWrapperCompiledStyles.root}>{children}</div>;

const customToolbarWrapperCompiledStyles = cssMap({
	root: {
		alignItems: 'center',
		display: 'flex',
	},
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const CustomToolbarWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={customToolbarWrapperCompiledStyles.root}>{children}</div>;

const mainToolbarIconBeforeCompiledStyles = cssMap({
	root: {
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
		marginLeft: token('space.200'),
		height: token('space.400'),
		width: token('space.400'),
		'@media (max-width: 0px)': {
			// value from akEditorMobileMaxWidth
			gridColumn: 1,
			gridRow: 1,
		},
	},
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const MainToolbarIconBefore = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={mainToolbarIconBeforeCompiledStyles.root}>{children}</div>;
