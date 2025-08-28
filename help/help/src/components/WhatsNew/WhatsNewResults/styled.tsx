/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const selectContainerStyles = css({
	width: '152px',
});

export const SelectContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={selectContainerStyles}>{children}</div>
);

const whatsNewResultsListContainerStyles = css({
	paddingTop: token('space.100', '8px'),
});

export const WhatsNewResultsListContainer = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={whatsNewResultsListContainerStyles}>{children}</div>
);

const whatsNewResultsListTitleContainerStyles = css({
	paddingTop: 0,
	paddingRight: token('space.100', '8px'),
	paddingBottom: 0,
	paddingLeft: token('space.100', '8px'),
});

export const WhatsNewResultsListTitleContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={whatsNewResultsListTitleContainerStyles}>{children}</div>
);
