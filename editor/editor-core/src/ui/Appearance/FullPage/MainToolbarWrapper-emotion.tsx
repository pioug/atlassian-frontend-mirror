/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `MainToolbarWrapper.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import {
	akEditorFloatingDialogZIndex,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT } from './MainToolbar';

const baseToolbarStyles = css({
	position: 'relative',
	alignItems: 'center',
	boxShadow: 'none',
	borderBottom: `${token('border.width')} solid ${token('color.border')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `box-shadow 200ms ${akEditorSwoopCubicBezier}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	zIndex: akEditorFloatingDialogZIndex,
	display: 'flex',
	height: 'var(--ak-editor-fullpage-toolbar-height)',
	flexShrink: 0,
	backgroundColor: token('elevation.surface'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& object': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		height: '0 !important',
	},
});

const flexibleIconSize = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& span svg': {
		maxWidth: '100%',
	},
});

const mainToolbarWithKeyline = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	boxShadow: `${token('elevation.shadow.overflow')}`,
});

const mainToolbarTwoLineStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
		flexWrap: 'wrap',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `calc(var(--ak-editor-fullpage-toolbar-height) * 2)`,
	},
});

export interface MainToolbarWrapperEmotionProps {
	children: React.ReactNode;
	'data-testid'?: string;
	showKeyline: boolean;
	twoLineEditorToolbar: boolean;
}

export const MainToolbarWrapperEmotion = ({
	showKeyline,
	twoLineEditorToolbar,
	children,
	'data-testid': testId,
}: MainToolbarWrapperEmotionProps): jsx.JSX.Element => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[
				baseToolbarStyles,
				flexibleIconSize,
				showKeyline && mainToolbarWithKeyline,
				twoLineEditorToolbar && mainToolbarTwoLineStyle,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
};
