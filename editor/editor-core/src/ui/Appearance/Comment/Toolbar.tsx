/** @jsx jsx */
import type { RefObject } from 'react';
import React, { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';
import { akEditorMenuZIndex, akEditorToolbarKeylineHeight } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 490;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
const mainToolbarWrapperStyle = (isTwoLineEditorToolbar = false) => css`
	position: relative;
	align-items: center;
	padding: ${token('space.100', '8px')} ${token('space.100', '8px')} 0;
	display: flex;
	height: auto;
	background-color: ${token('elevation.surface', 'white')};
	box-shadow: none;
	padding-left: ${token('space.250', '20px')};

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

        //make this more explicit for a toolbar
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
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
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
			css={[mainToolbarWrapperStyle(props.twoLineEditorToolbar), stickyToolbarWrapperStyle]}
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
		css={mainToolbarWrapperStyle(props.twoLineEditorToolbar)}
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
				{...getStickyParameters(useStickyToolbar)}
				twoLineEditorToolbar={twoLineEditorToolbar}
			>
				{children}
			</StickyToolbar>
		);
	}
	return <FixedToolbar twoLineEditorToolbar={twoLineEditorToolbar}>{children}</FixedToolbar>;
};

export const mainToolbarCustomComponentsSlotStyle = (isTwoLineEditorToolbar = false) =>
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
	css`
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 1;
		padding-right: ${token('space.250', '20px')};
		> div {
			display: flex;
			flex-shrink: 0;
		}
		${isTwoLineEditorToolbar &&
		`
    @media (max-width: ${MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT}px) {
      {
        padding-right: 0;
      }
    }
  `}
	`;
