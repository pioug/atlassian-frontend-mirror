/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ImgHTMLAttributes, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const imageStyles = css({
	maxWidth: '100%',
	height: 'auto',
});

const actionItemContainerStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'row-reverse',
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.negative.050'),
		marginInlineStart: token('space.negative.050'),
	},
});

const actionItemStyles = cssMap({
	root: {
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.050'),
		marginInlineStart: token('space.050'),
	},
});

/**
 * __Dialog image__
 *
 * An optional header image in spotlight dialogs.
 *
 * @internal
 */
export const DialogImage = ({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>): JSX.Element => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<img css={imageStyles} alt={alt} {...props} />
);

/**
 * __Dialog action item container__
 *
 * Flex wrapper around dialog action items.
 *
 * @internal
 */
export const DialogActionItemContainer = ({ children }: { children: ReactNode }): JSX.Element => (
	<Box xcss={actionItemContainerStyles.root}>{children}</Box>
);

/**
 * __Dialog action item__
 *
 * Action items shown inside of the dialog.
 *
 * @internal
 */
export const DialogActionItem = ({ children }: { children: ReactNode }): JSX.Element => (
	<Box xcss={actionItemStyles.root}>{children}</Box>
);
