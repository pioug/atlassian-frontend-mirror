/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `MainToolbar.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const nonCustomToolbarWrapperEmotionStyles = css({
	alignItems: 'center',
	display: 'flex',
	flexGrow: 1,
});

export const NonCustomToolbarWrapperEmotion = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={nonCustomToolbarWrapperEmotionStyles}>{children}</div>;

const customToolbarWrapperEmotionStyles = css({
	alignItems: 'center',
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const CustomToolbarWrapperEmotion = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={customToolbarWrapperEmotionStyles}>{children}</div>;

const mainToolbarIconBeforeEmotionStyles = css({
	margin: token('space.200'),
	height: token('space.400'),
	width: token('space.400'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		gridColumn: 1,
		gridRow: 1,
	},
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const MainToolbarIconBeforeEmotion = ({
	children,
}: {
	children: React.ReactNode;
}): jsx.JSX.Element => <div css={mainToolbarIconBeforeEmotionStyles}>{children}</div>;
