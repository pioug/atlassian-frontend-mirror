/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, HTMLAttributes, ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

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
