/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `MainToolbar.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
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

export const NonCustomToolbarWrapperCompiled = ({
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

export const CustomToolbarWrapperCompiled = ({
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

export const MainToolbarIconBeforeCompiled = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={mainToolbarIconBeforeCompiledStyles.root}>{children}</div>;
