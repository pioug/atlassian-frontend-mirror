/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import { SpotlightCard as Legacy, type SpotlightCardProps } from './legacy';
import { SpotlightCard as TopLayer } from './top-layer';

export type { SpotlightCardProps };

/**
 * __Spotlight__
 *
 * The base UI card that wraps composable spotlight components.
 *
 */
export const SpotlightCard: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightCardProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightCardProps>(
	({ children, placement, testId }: SpotlightCardProps, ref) =>
		fg('platform-dst-top-layer') ? (
			<TopLayer ref={ref} placement={placement} testId={testId}>
				{children}
			</TopLayer>
		) : (
			<Legacy ref={ref} placement={placement} testId={testId}>
				{children}
			</Legacy>
		),
);
