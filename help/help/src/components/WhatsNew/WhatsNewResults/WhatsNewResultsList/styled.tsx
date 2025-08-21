/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N200 } from '@atlaskit/theme/colors';

const whatsNewResultsListContainerStyles = css({
	position: 'relative',
});

export const WhatsNewResultsListContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={whatsNewResultsListContainerStyles}>{children}</div>
);

const whatsNewResultsListGroupWrapperStyles = css({
	paddingTop: token('space.100', '8px'),
	paddingRight: 0,
	paddingBottom: token('space.100', '8px'),
	paddingLeft: 0,
});

export const WhatsNewResultsListGroupWrapper = ({
	key,
	children,
}: {
	children: React.ReactNode;
	key: string | number;
}) => (
	<div css={whatsNewResultsListGroupWrapperStyles} key={key}>
		{children}
	</div>
);

const whatsNewResultsListGroupTitleStyles = css({
	color: token('color.text.subtlest', N200),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	paddingTop: 0,
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	textTransform: 'uppercase',
});

export const WhatsNewResultsListGroupTitle = ({ children }: { children: React.ReactNode }) => (
	<div css={whatsNewResultsListGroupTitleStyles}>{children}</div>
);
