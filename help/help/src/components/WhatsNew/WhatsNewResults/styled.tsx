/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const selectContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${19 * gridSize()}px`,
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
