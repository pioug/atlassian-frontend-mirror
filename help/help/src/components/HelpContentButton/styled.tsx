/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { B100, B50, N30, N600 } from '@atlaskit/theme/colors';

const wrappedSpanStyles = css({
	display: 'table',
});

const parentListItemHelpContentButtonContainerStyles = css({
	margin: 0,
});

const helpContentButtonContainerStyles = css({
	display: 'block',
	cursor: 'pointer',
	width: `calc(100% - ${token('space.200', '16px')})`,
	color: token('color.text.subtle', N600),
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	borderRadius: '3px',
	border: 'none',
	background: 'transparent',
	font: token('font.body', 'inherit'),
	'&:hover, &:focus, &:visited, &:active': {
		textDecoration: 'none',
		outline: 'none',
		outlineOffset: 'none',
		color: token('color.text.subtle', N600),
	},
	'&:focus': {
		boxShadow: `${token('color.border.focused', B100)} 0 0 0 2px inset`,
	},
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', B50),
	},
});

interface HelpContentButtonContainerProps {
	onClick: (event: React.MouseEvent<HTMLElement>) => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
	href?: string;
	id: string;
	tabIndex: number;
	target?: string;
	children: React.ReactNode;
}

export const HelpContentButtonContainer = ({
	onClick,
	onKeyDown,
	href,
	id,
	tabIndex,
	target,
	children,
}: HelpContentButtonContainerProps) => {
	if (href) {
		return (
			<li css={parentListItemHelpContentButtonContainerStyles}>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
				<a
					onClick={onClick}
					onKeyDown={onKeyDown}
					href={href}
					id={id}
					tabIndex={tabIndex}
					target={target}
					css={helpContentButtonContainerStyles}
				>
					<span css={wrappedSpanStyles}>{children}</span>
				</a>
			</li>
		);
	}

	return (
		<li css={parentListItemHelpContentButtonContainerStyles}>
			<button
				onClick={onClick}
				onKeyDown={onKeyDown}
				id={id}
				tabIndex={tabIndex}
				css={helpContentButtonContainerStyles}
			>
				<span css={wrappedSpanStyles}>{children}</span>
			</button>
		</li>
	);
};

const helpContentButtonIconStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	width: '20px',
	height: '20px',
	borderRadius: '4px',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& span': {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
});

export const HelpContentButtonIcon = ({ children }: { children: React.ReactNode }) => (
	<div css={helpContentButtonIconStyles}>{children}</div>
);

const helpContentButtonTextStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	width: 'calc(100% - 20px)',
	paddingTop: 0,
	paddingRight: token('space.100', '8px'),
	paddingBottom: 0,
	paddingLeft: token('space.100', '8px'),
	boxSizing: 'border-box',
});

export const HelpContentButtonText = ({ children }: { children: React.ReactNode }) => (
	<div css={helpContentButtonTextStyles}>{children}</div>
);

const helpContentButtonExternalLinkIconStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
});

export const HelpContentButtonExternalLinkIcon = ({
	dataTestId,
	children,
}: {
	dataTestId: string;
	children: React.ReactNode;
}) => (
	<div css={helpContentButtonExternalLinkIconStyles} data-testid={dataTestId}>
		{children}
	</div>
);

const helpContentButtonExternalNotificationIconStyles = css({
	display: 'inline-block',
	verticalAlign: 'middle',
	paddingLeft: token('space.050', '4px'),
	marginTop: token('space.negative.050', '-4px'),
});

export const HelpContentButtonExternalNotificationIcon = ({
	children,
}: {
	children: React.ReactNode;
}) => <div css={helpContentButtonExternalNotificationIconStyles}>{children}</div>;
