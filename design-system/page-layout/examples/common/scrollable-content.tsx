/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { Fragment, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ScrollableContentProps = {
	shouldHighlightNth?: boolean;
};

const itemStyles = css({
	boxSizing: 'border-box',
	width: '80%',
	height: '2rem',
	margin: '2rem auto',
	backgroundColor: token('color.background.accent.orange.subtler'),
	borderRadius: token('radius.small', '3px'),
});

const highlightStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':nth-of-type(4n)': {
		padding: token('space.050', '4px'),
		position: 'sticky',
		backgroundColor: token('color.background.accent.blue.subtle'),
		insetBlockStart: 65,
		textAlign: 'center',
		'&::after': {
			color: token('color.text.inverse'),
			content: '"Stickied element"',
		},
	},
});

const ScrollableContent = ({ shouldHighlightNth = false }: ScrollableContentProps): React.JSX.Element => {
	const items = useMemo(
		() =>
			Array.from({ length: 50 }, (_, i) => (
				<div key={i} css={[itemStyles, shouldHighlightNth && highlightStyles]} />
			)),
		[shouldHighlightNth],
	);

	return <Fragment>{items}</Fragment>;
};

export default ScrollableContent;
