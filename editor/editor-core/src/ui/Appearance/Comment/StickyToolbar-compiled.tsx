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
import type { ReactNode, RefObject } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;
const akEditorMenuZIndex = 500;
const akEditorToolbarKeylineHeight = 2;

const stickyToolbarCompiledStyles = cssMap({
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
	mainToolbarWithPadding: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
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
	stickyToolbarWrapper: {
		position: 'sticky',
		paddingBottom: token('space.100'),
		zIndex: akEditorMenuZIndex,
		transition: 'box-shadow ease-in-out 0.2s',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&.show-keyline': {
			boxShadow: `0 ${akEditorToolbarKeylineHeight}px 0 0 ${token('color.background.accent.gray.subtlest')}`,
		},
	},
});

type StickyToolbarCompiledProps = {
	children?: ReactNode;
	externalToolbarRef?: RefObject<HTMLElement>;
	isEditorModernisationEnabled?: boolean;
	isNewToolbarEnabled?: boolean;
	offsetTop?: number;
	twoLineEditorToolbar?: boolean;
};

export const StickyToolbarCompiled = (props: StickyToolbarCompiledProps): React.JSX.Element => {
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

	const wrapperStyle = useMemo(() => ({ top: `${top}px` }), [top]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
		<div
			css={[
				stickyToolbarCompiledStyles.mainToolbarWrapper,
				props.twoLineEditorToolbar &&
					// eslint-disable-next-line @typescript-eslint/no-explicit-any -- cssMap with @media containing nested selectors produces RemapMedia type incompatible with css prop
					(stickyToolbarCompiledStyles.mainToolbarTwoLine as any),
				stickyToolbarCompiledStyles.mainToolbarWrapperVisualRefresh,
				stickyToolbarCompiledStyles.stickyToolbarWrapper,
				props.isNewToolbarEnabled && stickyToolbarCompiledStyles.mainToolbarWithPadding,
				expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
					stickyToolbarCompiledStyles.mainToolbarRadius,
				!expValEquals('platform_editor_comment_editor_border_radius', 'isEnabled', true) &&
					fg('platform_editor_comments_border_radius') &&
					stickyToolbarCompiledStyles.mainToolbarWithRadius,
				props.isEditorModernisationEnabled &&
					stickyToolbarCompiledStyles.editorModernisationToolbar,
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
