/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

type EmptyViewWithFixedHeightProps = {
	testId?: string;
	children?: ReactNode;
};

type EmptyViewContainerProps = {
	testId?: string;
	children: ReactNode;
};

const fixedHeightStyles = css({
	height: '9rem',
});

export const EmptyViewWithFixedHeight: FC<EmptyViewWithFixedHeightProps> = ({
	children,
	testId,
}) => (
	<div css={fixedHeightStyles} data-testid={testId && `${testId}--empty-view-with-fixed-height`}>
		{children}
	</div>
);

const emptyViewContainerStyles = css({
	width: '50%',
	margin: 'auto',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	textAlign: 'center',
});

export const EmptyViewContainer: FC<EmptyViewContainerProps> = (props) => {
	const { children, testId } = props;
	return (
		<div css={emptyViewContainerStyles} data-testid={testId && `${testId}--empty-view-container`}>
			{children}
		</div>
	);
};
