/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const whatsNewResultsListContainerStyles = css({
	position: 'relative',
});

export const WhatsNewResultsListContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={whatsNewResultsListContainerStyles}>{children}</div>;

const whatsNewResultsListGroupWrapperStyles = css({
	paddingTop: token('space.100'),
	paddingRight: 0,
	paddingBottom: token('space.100'),
	paddingLeft: 0,
});

export const WhatsNewResultsListGroupWrapper = ({
	key,
	children,
}: {
	children: React.ReactNode;
	key: string | number;
}): JSX.Element => (
	<div css={whatsNewResultsListGroupWrapperStyles} key={key}>
		{children}
	</div>
);

const whatsNewResultsListGroupTitleStyles = css({
	color: token('color.text.subtlest'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	paddingTop: 0,
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	textTransform: 'uppercase',
});

export const WhatsNewResultsListGroupTitle = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={whatsNewResultsListGroupTitleStyles}>{children}</div>;
