/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `Toolbar.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ReactNode } from 'react';
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;

const fixedToolbarCompiledStyles = cssMap({
	mainToolbarWrapper: {
		position: 'relative',
		alignItems: 'center',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: 0,
		paddingLeft: token('space.250'),
		display: 'flex',
		height: 'auto',
		backgroundColor: token('elevation.surface'),
		boxShadow: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'> div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> div:first-of-type:not(style), > style:first-of-type + *': {
				marginLeft: 0,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.block-type-btn': {
			paddingLeft: 0,
		},
	},
	/** keep default padding for entire toolbar */
	mainToolbarWithoutLeftPadding: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: 0,
		paddingLeft: token('space.100'),
	},
	mainToolbarTwoLine: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > div': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
				flexDirection: 'column-reverse',
				alignItems: 'end',
				display: 'flex',
				justifyContent: 'flex-end',
			},

			/* make this more explicit for a toolbar */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> div:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				[`@media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px)`]: {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
					'> div:nth-of-type(2)': {
						justifyContent: 'flex-end',
						display: 'flex',
					},
				},
			},
		},
	},
	mainToolbarWrapperVisualRefresh: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span svg': { maxWidth: '100%' },
	},
	mainToolbarWithRadius: {
		borderRadius: `${token('radius.small', '3px')} ${token('radius.small', '3px')} 0 0`,
	},
	mainToolbarRadius: {
		borderRadius: `${token('radius.medium', '6px')} ${token('radius.medium', '6px')} 0 0`,
	},
	editorModernisationToolbar: {
		borderRadius: `${token('radius.xlarge', '12px')} ${token('radius.xlarge', '12px')} 0 0`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.show-keyline': {
			boxShadow: 'none',
		},
	},
});

type FixedToolbarCompiledProps = {
	children?: ReactNode;
	isEditorModernisationEnabled?: boolean;
	isNewToolbarEnabled?: boolean;
	twoLineEditorToolbar?: boolean;
};

export const FixedToolbarCompiled = (props: FixedToolbarCompiledProps): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
	<div
		css={[
			fixedToolbarCompiledStyles.mainToolbarWrapper,
			props.twoLineEditorToolbar &&
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- cssMap with @media containing nested selectors produces RemapMedia type incompatible with css prop
				(fixedToolbarCompiledStyles.mainToolbarTwoLine as any),
			fixedToolbarCompiledStyles.mainToolbarWrapperVisualRefresh,
			props.isNewToolbarEnabled && fixedToolbarCompiledStyles.mainToolbarWithoutLeftPadding,
			!expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
				fg('platform_editor_comments_border_radius') &&
				fixedToolbarCompiledStyles.mainToolbarWithRadius,
			expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
				fixedToolbarCompiledStyles.mainToolbarRadius,
			props.isEditorModernisationEnabled && fixedToolbarCompiledStyles.editorModernisationToolbar,
		]}
		data-testid="ak-editor-main-toolbar"
	>
		{props.children}
	</div>
);
