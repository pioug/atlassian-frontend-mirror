/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	akEditorFloatingDialogZIndex,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT } from './MainToolbar';

// Base styles that don't depend on feature flags
const baseToolbarStyles = css({
	position: 'relative',
	alignItems: 'center',
	boxShadow: 'none',
	borderBottom: `${token('border.width')} solid ${token('color.border')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	transition: `box-shadow 200ms ${akEditorSwoopCubicBezier}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	zIndex: akEditorFloatingDialogZIndex,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	display: 'flex',
	height: 'var(--ak-editor-fullpage-toolbar-height)',
	flexShrink: 0,
	backgroundColor: token('elevation.surface'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& object': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		height: '0 !important',
	},
});

const flexibleIconSize = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& span svg': {
		maxWidth: '100%',
	},
});

interface MainToolbarWrapperProps {
	children: React.ReactNode;
	'data-testid'?: string;
	showKeyline: boolean;
	twoLineEditorToolbar: boolean;
}

// box-shadow is overriden by the mainToolbar
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

export const MainToolbarWrapper = ({
	showKeyline,
	twoLineEditorToolbar,
	children,
	'data-testid': testId,
}: MainToolbarWrapperProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
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
