/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Manager, type Placement, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const popupStyles = cssMap({
	root: {
		boxSizing: 'border-box',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'auto',
		paddingBlockEnd: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
	},
	content: {
		display: 'contents',
	},
});

const contentStyles = cssMap({
	root: {
		border: `${token('border.width')} solid ${token('color.border.accent.blue')}`,
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	wide: {
		width: '110vw',
	},
	tall: {
		height: '110vh',
	},
});

const containerStyles = cssMap({
	root: {
		display: 'inline-flex',
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	top: {
		marginBlockStart: 400,
	},
	left: {
		marginInlineStart: 1000,
	},
});

function MaxSizeExample({ children, placement }: { children: ReactNode; placement: Placement }) {
	return (
		<Manager>
			<Reference>
				{({ ref }) => (
					<Button appearance="primary" ref={ref}>
						Reference element
					</Button>
				)}
			</Reference>
			<Popper placement={placement} shouldFitViewport>
				{({ ref, style }) => (
					<div
						ref={ref}
						style={style}
						css={popupStyles.root}
						data-testid={`placement--${placement}`}
						// Making the scrollable region focusable
						// eslint-disable-next-line @atlassian/a11y/no-noninteractive-tabindex
						tabIndex={0}
					>
						<div css={popupStyles.content}>{children}</div>
					</div>
				)}
			</Popper>
		</Manager>
	);
}

export function MaxSizeRightExample(): JSX.Element {
	return (
		<MaxSizeExample placement="right">
			<div css={[contentStyles.root, contentStyles.wide]}>This popup is very wide</div>
		</MaxSizeExample>
	);
}

export function MaxSizeLeftExample(): JSX.Element {
	return (
		<div css={containerStyles.left}>
			<MaxSizeExample placement="left">
				<div css={[contentStyles.root, contentStyles.wide]}>This popup is very wide</div>
			</MaxSizeExample>
		</div>
	);
}

export function MaxSizeTopExample(): JSX.Element {
	return (
		<div css={containerStyles.top}>
			<MaxSizeExample placement="top">
				<div css={[contentStyles.root, contentStyles.tall]}>This popup is very tall</div>
			</MaxSizeExample>
		</div>
	);
}

export function MaxSizeBottomExample(): JSX.Element {
	return (
		<MaxSizeExample placement="bottom">
			<div css={[contentStyles.root, contentStyles.tall]}>This popup is very tall</div>
		</MaxSizeExample>
	);
}

export default MaxSizeRightExample;
