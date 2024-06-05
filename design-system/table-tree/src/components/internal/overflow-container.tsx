/** @jsx jsx */
import type { FC, HTMLAttributes, ReactNode } from 'react';

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
		// @ts-ignore - This was added when `@atlaskit/table-tree` was enrolled into JFE local consumption
		// There seems to be an incompatibility in the `css` prop between jira and platform
		css={isSingleLine && overflowContainerStyles}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

export default OverflowContainer;
