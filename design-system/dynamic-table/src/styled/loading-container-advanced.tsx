/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, forwardRef, type HTMLProps, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const containerStyles = css({
	position: 'relative',
	marginBlockEnd: token('space.300'),
});

type ContainerProps = HTMLProps<HTMLDivElement> & { testId?: string };

export const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
	const { children, testId, ...rest } = props;
	return (
		<div css={containerStyles} {...rest} data-testid={testId} ref={ref}>
			{children}
		</div>
	);
});

const spinnerBackdropStyles = css({
	display: 'flex',
	position: 'absolute',
	inset: 0,
	alignItems: 'center',
	justifyContent: 'center',
	pointerEvents: 'none',
});

type SpinnerBackdropProps = {
	testId?: string;
	children: ReactNode;
};

export const SpinnerBackdrop: FC<SpinnerBackdropProps> = ({ children, testId }) => (
	<div css={spinnerBackdropStyles} data-testid={testId && `${testId}--spinner-backdrop`}>
		{children}
	</div>
);

const spinnerContainerStyles = css({
	position: 'relative',
	insetBlockStart: 0,
});

export const SpinnerContainer = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
	({ children }, ref) => (
		<div css={spinnerContainerStyles} ref={ref}>
			{children}
		</div>
	),
);
