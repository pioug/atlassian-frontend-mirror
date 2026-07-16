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
import type { ReactNode, RefObject } from 'react';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;
const akEditorMenuZIndex = 500;
const akEditorToolbarKeylineHeight = 2;

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

const mainToolbarWithPadding = css({
	padding: `${token('space.100')}`,
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
		boxShadow: token('elevation.shadow.overflow'),
	},
});

const stickyToolbarWrapperStyleNew = css({
	position: 'sticky',
	paddingBottom: token('space.100'),
	zIndex: akEditorMenuZIndex,
	transition: 'box-shadow ease-in-out 0.2s',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.show-keyline': {
		boxShadow: `0 ${akEditorToolbarKeylineHeight}px 0 0 ${token('color.background.accent.gray.subtlest')}`,
	},
});

type StickyToolbarEmotionProps = {
	children?: ReactNode;
	externalToolbarRef?: RefObject<HTMLElement>;
	isEditorModernisationEnabled?: boolean;
	isNewToolbarEnabled?: boolean;
	offsetTop?: number;
	twoLineEditorToolbar?: boolean;
};

export const StickyToolbarEmotion = (props: StickyToolbarEmotionProps): JSX.Element => {
	const [top, setTop] = useState(0);

	// ED-15802: if externalToolbarRef is passed in, set top to externalToolbarRef?.current?.clientHeight
	// else if offsetTop is a number set top to offsetTop
	// otherwise top is 0 as initial state
	useEffect(() => {
		if (props.externalToolbarRef?.current?.clientHeight) {
			setTop(props.externalToolbarRef.current.clientHeight);
		} else {
			setTop(props.offsetTop || 0);
		}
	}, [props.externalToolbarRef, props.offsetTop]);

	const wrapperStyle = { top: `${top}px` };

	return (
		// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
		<div
			css={[
				mainToolbarWrapperStyleNew,
				props.twoLineEditorToolbar && mainToolbarTwoLineStylesNew,
				mainToolbarWrapperStylesVisualRefresh,
				stickyToolbarWrapperStyleNew,
				props.isNewToolbarEnabled && mainToolbarWithPadding,
				expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
					mainToolbarRadius,
				!expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
					fg('platform_editor_comments_border_radius') &&
					mainToolbarWithRadiusStyle,
				props.isEditorModernisationEnabled && editorModernisationToolbarStyle,
			]}
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/enforce-style-prop -- top is computed dynamically from externalToolbarRef height / offsetTop and cannot be a static css value
			style={wrapperStyle}
			data-testid="ak-editor-main-toolbar"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={'show-keyline'}
		>
			{props.children}
		</div>
	);
};
