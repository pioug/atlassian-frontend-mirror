/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { RefObject } from 'react';
import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;
const akEditorMenuZIndex = 500;
const akEditorToolbarKeylineHeight = 2;

const mainToolbarWrapperStyle = (
	isTwoLineEditorToolbar = false,
	isToolbarAifcEnabled = false,
	/* eslint-disable @atlaskit/platform/ensure-feature-flag-registration */
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
) => css`
	position: relative;
	align-items: center;
	padding: ${token('space.100', '8px')} ${token('space.100', '8px')} 0;
	display: flex;
	height: auto;
	background-color: ${token('elevation.surface', 'white')};
	box-shadow: none;
	${isToolbarAifcEnabled ? '' : `padding-left: ${token('space.250', '20px')};`}

	& > div {
		> :first-child:not(style),
		> style:first-child + * {
			margin-left: 0;
		}
		${isTwoLineEditorToolbar &&
		`
        @media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px) {
          flex-direction: column-reverse;
          align-items: end;
          display: flex;
          justify-content: flex-end;
        }

        /* make this more explicit for a toolbar */
        > *:nth-child(1) {
          @media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px) {
            > div:nth-child(2) {
              justify-content: flex-end;
              display: flex;
            }
          }
        }
    `}
	}

	.block-type-btn {
		padding-left: 0;
	}

	${fg('platform-visual-refresh-icons') && 'span svg { max-width: 100%; }'}
`;

const mainToolbarWrapperStyleNew = css({
	position: 'relative',
	alignItems: 'center',
	padding: `${token('space.100', '8px')} ${token('space.100', '8px')} 0`,
	display: 'flex',
	height: 'auto',
	backgroundColor: token('elevation.surface', 'white'),
	boxShadow: 'none',
	paddingLeft: token('space.250', '20px'),
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
	padding: `${token('space.100', '8px')} ${token('space.100', '8px')} 0`,
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

/* eslint-enable @atlaskit/platform/ensure-feature-flag-registration */

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const stickyToolbarWrapperStyle = css`
	/* stylelint-disable declaration-block-no-duplicate-properties */
	position: relative;
	position: sticky;
	/* stylelint-enable declaration-block-no-duplicate-properties */
	padding-bottom: ${token('space.100', '8px')};
	z-index: ${akEditorMenuZIndex};
	transition: box-shadow ease-in-out 0.2s;
	&.show-keyline {
		box-shadow: 0 ${akEditorToolbarKeylineHeight}px 0 0
			${token('color.background.accent.gray.subtlest', '#F1F2F4')};
	}
`;

const stickyToolbarWrapperStyleNew = css({
	position: 'sticky',
	paddingBottom: token('space.100', '8px'),
	zIndex: akEditorMenuZIndex,
	transition: 'box-shadow ease-in-out 0.2s',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.show-keyline': {
		boxShadow: `0 ${akEditorToolbarKeylineHeight}px 0 0 ${token('color.background.accent.gray.subtlest')}`,
	},
});

type StickyToolbarProps = {
	externalToolbarRef?: RefObject<HTMLElement>;
	offsetTop?: number;
	twoLineEditorToolbar?: boolean;
	children?: React.ReactNode;
};

const StickyToolbar = (props: StickyToolbarProps) => {
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

	return (
		// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
		<div
			css={
				expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true)
					? [
							mainToolbarWrapperStyleNew,
							props.twoLineEditorToolbar && mainToolbarTwoLineStylesNew,
							fg('platform-visual-refresh-icons') && mainToolbarWrapperStylesVisualRefresh,
							stickyToolbarWrapperStyleNew,
							expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true) &&
								mainToolbarWithoutLeftPadding,
						]
					: [
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							mainToolbarWrapperStyle(
								props.twoLineEditorToolbar,
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
								expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true),
							),
							stickyToolbarWrapperStyle,
						]
			}
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
			style={{ top: `${top}px` }}
			data-testid="ak-editor-main-toolbar"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={'show-keyline'}
		>
			{props.children}
		</div>
	);
};

type FixedToolbarProps = {
	twoLineEditorToolbar?: boolean;
	children?: React.ReactNode;
};

const FixedToolbar = (props: FixedToolbarProps) => (
	// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
	<div
		css={
			expValEquals('platform_editor_core_static_emotion_non_central', 'isEnabled', true)
				? [
						mainToolbarWrapperStyleNew,
						props.twoLineEditorToolbar && mainToolbarTwoLineStylesNew,
						fg('platform-visual-refresh-icons') && mainToolbarWrapperStylesVisualRefresh,
						expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true) &&
							mainToolbarWithoutLeftPadding,
					]
				: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					mainToolbarWrapperStyle(
						props.twoLineEditorToolbar,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
						expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true),
					)
		}
		data-testid="ak-editor-main-toolbar"
	>
		{props.children}
	</div>
);

/**
 * ED-15802: Scenarios when a sticky bar is used:
 * 1. useStickyToolbar is true
 * 2. useStickyToolbar is a DOM element
 * 3. useStickyToolbar is an object and has offsetTop key;
 */
const getStickyParameters = (configuration: UseStickyToolbarType) => {
	// const isUsingStickyOffset, isHTMLElement is used so TS can properly infer types.
	const isHTMLElement = typeof configuration === 'object' && !('offsetTop' in configuration);
	const isUsingStickyOffset = typeof configuration === 'object' && 'offsetTop' in configuration;

	if (typeof configuration !== 'object') {
		return { externalToolbarRef: undefined, offsetTop: undefined };
	}
	if (isUsingStickyOffset) {
		return { offsetTop: configuration.offsetTop };
	}
	if (isHTMLElement) {
		return {
			externalToolbarRef: configuration,
		};
	}
};

type MainToolbarProps = {
	useStickyToolbar?: UseStickyToolbarType;
	twoLineEditorToolbar?: boolean;
	children?: React.ReactNode;
};

export const MainToolbar = ({
	useStickyToolbar,
	twoLineEditorToolbar,
	children,
}: MainToolbarProps) => {
	if (useStickyToolbar) {
		return (
			<StickyToolbar
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...getStickyParameters(useStickyToolbar)}
				twoLineEditorToolbar={twoLineEditorToolbar}
			>
				{children}
			</StickyToolbar>
		);
	}
	return <FixedToolbar twoLineEditorToolbar={twoLineEditorToolbar}>{children}</FixedToolbar>;
};
