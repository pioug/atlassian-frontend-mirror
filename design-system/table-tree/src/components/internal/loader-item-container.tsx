/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { FC, ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const commonCellElementStyles = css({
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	// indentBase is re-used elsewhere and is primarily used as positive value; we need to negate it here
	marginInlineStart: `calc(${token('space.300')} * -1)`,
});
const loadingItemContainerStyles = css({
	width: '100%',
});
const paddingLeftStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingInlineStart: '50%',
});

type LoaderItemContainerProps = {
	isRoot?: boolean;
	children: ReactNode;
};

/**
 * __Loader item container__
 *
 * A loader item container.
 */
export const LoaderItemContainer: FC<LoaderItemContainerProps> = ({ isRoot, ...props }) => (
	<span
		css={[commonCellElementStyles, loadingItemContainerStyles, isRoot && paddingLeftStyles]}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
