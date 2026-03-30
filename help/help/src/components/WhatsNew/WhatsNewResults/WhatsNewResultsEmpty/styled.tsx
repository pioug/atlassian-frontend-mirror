/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const whatsNewResultsEmptyMessageImageStyles = css({
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: 0,
	paddingLeft: token('space.300'),
	textAlign: 'center',
});

export const WhatsNewResultsEmptyMessageImage = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={whatsNewResultsEmptyMessageImageStyles}>{children}</div>;

const whatsNewResultsEmptyMessageTextStyles = css({
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: 0,
	paddingLeft: token('space.300'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	p: {
		color: token('color.text.subtlest'),
	},
});

export const WhatsNewResultsEmptyMessageText = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={whatsNewResultsEmptyMessageTextStyles}>{children}</div>;
