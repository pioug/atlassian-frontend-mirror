/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Manager, type Placement, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const popupStyles = {
	root: css({
		boxSizing: 'border-box',
		padding: token('space.150'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('border.radius'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'auto',
	}),
	content: css({
		display: 'contents',
	}),
};

const contentStyles = {
	root: css({
		padding: token('space.100'),
		border: `1px solid ${token('color.border.accent.blue')}`,
	}),
	wide: css({
		width: '110vw',
	}),
	tall: css({
		height: '110vh',
	}),
};

const containerStyles = {
	root: css({
		display: 'inline-flex',
		padding: token('space.200'),
	}),
	top: css({
		marginBlockStart: 400,
	}),
	left: css({
		marginInlineStart: 1000,
	}),
};

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
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						style={style}
						css={popupStyles.root}
						data-testid={`placement--${placement}`}
						// Making the scrollable region focusable
						// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
						tabIndex={0}
					>
						<div css={popupStyles.content}>{children}</div>
					</div>
				)}
			</Popper>
		</Manager>
	);
}

export function MaxSizeRightExample() {
	return (
		<MaxSizeExample placement="right">
			<div css={[contentStyles.root, contentStyles.wide]}>This popup is very wide</div>
		</MaxSizeExample>
	);
}

export function MaxSizeLeftExample() {
	return (
		<div css={containerStyles.left}>
			<MaxSizeExample placement="left">
				<div css={[contentStyles.root, contentStyles.wide]}>This popup is very wide</div>
			</MaxSizeExample>
		</div>
	);
}

export function MaxSizeTopExample() {
	return (
		<div css={containerStyles.top}>
			<MaxSizeExample placement="top">
				<div css={[contentStyles.root, contentStyles.tall]}>This popup is very tall</div>
			</MaxSizeExample>
		</div>
	);
}

export function MaxSizeBottomExample() {
	return (
		<MaxSizeExample placement="bottom">
			<div css={[contentStyles.root, contentStyles.tall]}>This popup is very tall</div>
		</MaxSizeExample>
	);
}

export default MaxSizeRightExample;
