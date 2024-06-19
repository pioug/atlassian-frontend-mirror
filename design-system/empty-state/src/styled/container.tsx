/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import type { Width } from '../index';

const gridSize = getGridSize();

const verticalMarginSize = token('space.600', '48px');

const columnWidth = gridSize * 8;
const gutter = gridSize * 2;

const containerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	margin: `${verticalMarginSize} auto`,
	textAlign: 'center',
});

/* Use max-width so the component can shrink on smaller viewports. */
const wideContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `${columnWidth * 6 + gutter * 5}px`,
});

const narrowContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `${columnWidth * 4 + gutter * 3}px`,
});

type ContainerProps = {
	testId?: string;
	width: Width;
	children: ReactNode;
};

/**
 * __Container__
 *
 * Upper level container for Empty State.
 *
 * @internal
 */
const Container: FC<ContainerProps> = ({ children, width, testId }) => (
	<div
		data-testid={testId}
		css={[containerStyles, width === 'narrow' ? narrowContainerStyles : wideContainerStyles]}
	>
		{children}
	</div>
);

export default Container;
