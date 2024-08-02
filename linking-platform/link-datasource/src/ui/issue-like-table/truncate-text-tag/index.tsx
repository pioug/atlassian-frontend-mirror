/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

const truncateTextStyles = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const TruncateTextTag = forwardRef(
	(props: React.PropsWithChildren<unknown>, ref: React.Ref<HTMLElement>) => {
		return (
			<span css={truncateTextStyles} {...props} ref={ref}>
				{props.children}
			</span>
		);
	},
);
