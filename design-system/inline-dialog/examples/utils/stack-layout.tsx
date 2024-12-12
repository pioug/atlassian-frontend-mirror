/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

const spacingScale = {
	SMALLEST: 4,
	SMALL: 8,
	MEDIUM: 16,
	LARGE: 24,
	XLARGE: 32,
	XXLARGE: 40,
	LARGEST: 160,
};

const stackLayoutStyles = css({
	display: 'grid',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	gap: `var(--size-spacing)`,
	gridAutoFlow: 'column',
});

const gridTemplateColumnStyles = css({
	gridTemplateColumns: '5fr',
});

const gridAutoFlowStyles = css({
	gridAutoFlow: 'row',
});

interface StackLayoutProps {
	direction: 'VERTICAL' | 'HORIZONTAL';
	size?: 'SMALLEST' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'XLARGE' | 'XXLARGE' | 'LARGEST';
	testId?: string;
	children: ReactNode;
}

/**
 * __Stack layout__
 *
 * A stack layout makes it easy to stack UI components together for VR tests.
 *
 */
const StackLayout = ({
	children,
	direction = 'VERTICAL',
	size = 'MEDIUM',
	testId,
}: StackLayoutProps) => {
	return (
		<div
			css={[
				stackLayoutStyles,
				direction === 'VERTICAL' && gridTemplateColumnStyles,
				direction === 'VERTICAL' && gridAutoFlowStyles,
			]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ ['--size-spacing']: `${spacingScale[size]}px` } as React.CSSProperties}
		>
			{children}
		</div>
	);
};

export default StackLayout;
