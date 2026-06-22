/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `Toolbar.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;

const mainToolbarWrapperStyleNew = css({
	position: 'relative',
	alignItems: 'center',
	padding: `${token('space.100')} ${token('space.100')} 0`,
	display: 'flex',
	height: 'auto',
	backgroundColor: token('elevation.surface'),
	boxShadow: 'none',
	paddingLeft: token('space.250'),
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
});

/** keep default padding for entire toolbar */
const mainToolbarWithoutLeftPadding = css({
	padding: `${token('space.100')} ${token('space.100')} 0`,
});

const mainToolbarTwoLineStylesNew = css({
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
});

const mainToolbarWrapperStylesVisualRefresh = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'span svg': { maxWidth: '100%' },
});

const mainToolbarWithRadiusStyle = css({
	borderRadius: `${token('radius.small', '3px')} ${token('radius.small', '3px')} 0 0`,
});

const mainToolbarRadius = css({
	borderRadius: `${token('radius.medium', '6px')} ${token('radius.medium', '6px')} 0 0`,
});

const editorModernisationToolbarStyle = css({
	borderRadius: `${token('radius.xlarge', '12px')} ${token('radius.xlarge', '12px')} 0 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.show-keyline': {
		boxShadow: 'none',
	},
});

type FixedToolbarEmotionProps = {
	children?: ReactNode;
	isEditorModernisationEnabled?: boolean;
	isNewToolbarEnabled?: boolean;
	twoLineEditorToolbar?: boolean;
};

export const FixedToolbarEmotion = (props: FixedToolbarEmotionProps): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
	<div
		css={[
			mainToolbarWrapperStyleNew,
			props.twoLineEditorToolbar && mainToolbarTwoLineStylesNew,
			mainToolbarWrapperStylesVisualRefresh,
			props.isNewToolbarEnabled && mainToolbarWithoutLeftPadding,
			!expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
				fg('platform_editor_comments_border_radius') &&
				mainToolbarWithRadiusStyle,
			expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
				mainToolbarRadius,
			props.isEditorModernisationEnabled && editorModernisationToolbarStyle,
		]}
		data-testid="ak-editor-main-toolbar"
	>
		{props.children}
	</div>
);
