/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const tabContainerStyles = css({
	width: '100%',
});

export const TabContainer = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={tabContainerStyles}>{children}</div>
);

const tabLabelsStyles = css({
	display: 'flex',
	justifyContent: 'space-between',
});

export const TabLabels = ({ children }: { children: React.ReactNode }) => (
	<div css={tabLabelsStyles}>{children}</div>
);

const tabLabelStyles = css({
	flex: 1,
	paddingTop: token('space.150', '12px'),
	paddingRight: token('space.150', '12px'),
	paddingBottom: token('space.150', '12px'),
	paddingLeft: token('space.150', '12px'),
	textAlign: 'center',
	alignContent: 'center',
	cursor: 'pointer',
});

export const TabLabel = ({
	isActive,
	onClick,
	children,
}: {
	isActive: boolean;
	onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	children: React.ReactNode;
}) => (
	// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
	<div
		css={tabLabelStyles}
		style={{
			color: isActive ? token('color.text.selected') : token('color.text'),
			borderBottom: isActive
				? `1px solid ${token('color.text.selected')}`
				: `1px solid ${token('color.text.disabled')}`,
		}}
		onClick={onClick}
	>
		{children}
	</div>
);
