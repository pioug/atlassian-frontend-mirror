/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

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
