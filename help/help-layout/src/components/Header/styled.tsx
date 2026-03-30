/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Box } from '@atlaskit/primitives/compiled';
import React from 'react';
import { cssMap } from '@atlaskit/css';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { type TransitionStatus } from '../constants';

const headerContainerStyles = css({
	backgroundColor: token('color.background.neutral'),
	borderBottom: `${token('border.width.selected')} solid ${token('color.border')}`,
	justifyContent: 'space-between',
	position: 'relative',
});

export const HeaderContainer = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={headerContainerStyles}>{children}</div>
);

const styles = cssMap({
	closeButtonContainer: {
		position: 'absolute',
		right: token('space.100'),
		top: token('space.150'),
	},
});

export const CloseButtonContainer = ({
	inDynamicHeader,
	children,
}: {
	children: React.ReactNode;
	inDynamicHeader: boolean;
}): JSX.Element => <Box xcss={!inDynamicHeader && styles.closeButtonContainer}>{children}</Box>;

export const TRANSITION_DURATION_MS = 220;

const backButtonContainerStyles = css({
	transition: `left ${TRANSITION_DURATION_MS}ms, opacity ${TRANSITION_DURATION_MS}ms`,
	left: token('space.300'),
	opacity: 0,
	position: 'absolute',
	top: token('space.150'),
});

const backButtonContainerTransitionStyles: { [id: string]: React.CSSProperties } = {
	entered: { left: token('space.100'), opacity: 1 },
	exited: { left: token('space.100'), opacity: 0 },
};

type BackButtonContainerProps = {
	children: React.ReactNode;
	transitionState: TransitionStatus;
};

export const BackButtonContainer: React.ForwardRefExoticComponent<
	BackButtonContainerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, BackButtonContainerProps>(
	({ transitionState, children }, ref) => (
		<div
			ref={ref}
			css={backButtonContainerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={backButtonContainerTransitionStyles[transitionState]}
		>
			{children}
		</div>
	),
);

BackButtonContainer.displayName = 'BackButtonContainer';

const headerTitleStyles = css({
	color: token('color.text.subtle'),
	textAlign: 'center',
	font: token('font.body.large'),
	fontWeight: token('font.weight.semibold'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: token('space.800'),
	width: '100%',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	display: 'inline-block',
	overflow: 'hidden',
	verticalAlign: 'middle',
});

export const HeaderTitle = ({ children }: { children: React.ReactNode }): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-heading
	<h2 css={headerTitleStyles}>{children}</h2>
);

const headerContentStyles = css({
	paddingTop: 0,
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
});

export const HeaderContent = ({ children }: { children: React.ReactNode }): JSX.Element => (
	<div css={headerContentStyles}>{children}</div>
);
