/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

interface OverflowContainerProps {
	isSingleLine?: boolean;
	chilren?: ReactNode;
}

const overflowContainerStyles = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

/**
 * __Overflow container__
 */
const OverflowContainer: FC<OverflowContainerProps & HTMLAttributes<HTMLSpanElement>> = ({
	isSingleLine,
	...props
}) => (
	<span
		css={isSingleLine && overflowContainerStyles}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

export default OverflowContainer;
