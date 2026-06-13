/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `MainToolbarWrapper.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		position: 'relative',
		alignItems: 'center',
		boxShadow: 'none',
		borderBottom: `${token('border.width')} solid ${token('color.border')}`,
		transition: `box-shadow 200ms cubic-bezier(0.15, 1, 0.3, 1)`,
		zIndex: 510, // akEditorFloatingDialogZIndex
		display: 'flex',
		height: 'var(--ak-editor-fullpage-toolbar-height)',
		flexShrink: 0,
		backgroundColor: token('elevation.surface'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& object': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			height: '0 !important',
		},
	},
	flexibleIconSize: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& span svg': {
			maxWidth: '100%',
		},
	},
	keyline: {
		boxShadow: `${token('elevation.shadow.overflow')}`,
	},
	twoLine: {
		'@media (max-width: 868px)': {
			// value from MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT
			flexWrap: 'wrap',
			height: `calc(var(--ak-editor-fullpage-toolbar-height) * 2)`,
		},
	},
});

export interface MainToolbarWrapperCompiledProps {
	children: React.ReactNode;
	'data-testid'?: string;
	showKeyline: boolean;
	twoLineEditorToolbar: boolean;
}

export const MainToolbarWrapperCompiled = ({
	showKeyline,
	twoLineEditorToolbar,
	children,
	'data-testid': testId,
}: MainToolbarWrapperCompiledProps): jsx.JSX.Element => {
	return (
		<div
			css={[
				styles.base,
				styles.flexibleIconSize,
				showKeyline && styles.keyline,
				twoLineEditorToolbar && styles.twoLine,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
};
