/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ModalImageProps = { alt: string; src?: string };

type ModalActionContainerProps = {
	shouldReverseButtonOrder: boolean;
	children: ReactNode;
};

const modalBodyStyles = css({
	padding: `${token('space.500', '40px')} ${token('space.200', '16px')}`,
	textAlign: 'center',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-array-arguments -- Ignored via go/DSP-18766
const modalHeadingStyles = css({
	color: 'inherit',
	font: token('font.heading.medium'),
	marginBlockEnd: token('space.100', '8px'),
});

const modalImageStyles = css({
	width: '100%',
	height: 'auto',
	borderStartEndRadius: token('border.radius', '3px'),
	borderStartStartRadius: token('border.radius', '3px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 320px) and (max-width: 480px)': {
		borderRadius: 0,
	},
});

const modalActionContainerStyles = css({
	display: 'flex',
	padding: `${token('space.0', '0px')} ${token('space.500', '40px')} 36px`,
	justifyContent: 'center',
	flexDirection: 'row',
	flexFlow: 'wrap',
});

const modalActionContainerReversedStyles = css({
	flexDirection: 'row-reverse',
});

const modalActionItemStyles = css({
	margin: `${token('space.0', '0px')} ${token('space.050', '4px')} ${token('space.050', '4px')}`,
});

/**
 * __Modal body__
 *
 * @internal
 */
export const ModalBody = ({ children }: { children: ReactNode }) => (
	<div css={modalBodyStyles}>{children}</div>
);

/**
 * __Modal heading__
 *
 * @internal
 */
export const ModalHeading = ({ children, id }: { children: ReactNode; id: string }) => {
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
export const ModalImage = ({ alt, src }: ModalImageProps) => (
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
}: ModalActionContainerProps) => (
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
export const ModalActionItem = ({ children }: { children: ReactNode }) => (
	<div css={modalActionItemStyles}>{children}</div>
);
