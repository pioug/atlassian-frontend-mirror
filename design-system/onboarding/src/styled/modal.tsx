/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
type ModalImageProps = { alt: string; src?: string };

type ModalActionContainerProps = {
	shouldReverseButtonOrder: boolean;
	children: ReactNode;
};

const modalBodyStyles = css({
	paddingBlockEnd: token('space.500'),
	paddingBlockStart: token('space.500'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
	textAlign: 'center',
});

const modalHeadingStyles = css({
	color: 'inherit',
	font: token('font.heading.medium'),
	marginBlockEnd: token('space.100', '8px'),
});

const modalImageStyles = css({
	width: '100%',
	height: 'auto',
	borderStartEndRadius: token('radius.small', '3px'),
	borderStartStartRadius: token('radius.small', '3px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 320px) and (max-width: 480px)': {
		borderRadius: 0,
	},
});

const modalActionContainerStyles = css({
	display: 'flex',
	justifyContent: 'center',

	flexFlow: 'row wrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingBlockEnd: '36px',
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.500'),
	paddingInlineStart: token('space.500'),
});

const modalActionContainerReversedStyles = css({
	flexDirection: 'row-reverse',
});

const modalActionItemStyles = cssMap({
	root: {
		marginBlockEnd: token('space.050'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.050'),
		marginInlineStart: token('space.050'),
	},
});

/**
 * __Modal body__
 *
 * @internal
 */
export const ModalBody = ({ children }: { children: ReactNode }): JSX.Element => (
	<div css={modalBodyStyles}>{children}</div>
);

/**
 * __Modal heading__
 *
 * @internal
 */
export const ModalHeading = ({
	children,
	id,
}: {
	children: ReactNode;
	id: string;
}): JSX.Element => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-heading
		<h1 css={modalHeadingStyles} id={id}>
			{children}
		</h1>
	);
};

/**
 * __Modal image__
 *
 * @internal
 */
export const ModalImage = ({ alt, src }: ModalImageProps): JSX.Element => (
	<img css={modalImageStyles} alt={alt} src={src} />
);

/**
 * __Modal action container__
 *
 * @internal
 */
export const ModalActionContainer = ({
	children,
	shouldReverseButtonOrder,
}: ModalActionContainerProps): JSX.Element => (
	<div
		css={[
			modalActionContainerStyles,
			shouldReverseButtonOrder && modalActionContainerReversedStyles,
		]}
	>
		{children}
	</div>
);

/**
 * __Modal action item__
 *
 * @internal
 */
export const ModalActionItem = ({ children }: { children: ReactNode }): JSX.Element => (
	<Box xcss={modalActionItemStyles.root}>{children}</Box>
);
