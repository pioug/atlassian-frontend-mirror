/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, type MouseEvent, useCallback, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import noop from '@atlaskit/ds-lib/noop';
import { N100A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import type { BlanketProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const analyticsAttributes = {
	componentName: 'blanket',
	packageName,
	packageVersion,
};

const baseStyles = css({
	position: 'fixed',
	zIndex: layers.blanket(),
	inset: 0,
	backgroundColor: token('color.blanket', N100A),
	overflowY: 'auto',
	pointerEvents: 'initial',
});

const shouldAllowClickThroughStyles = css({
	pointerEvents: 'none',
});

const invisibleStyles = css({
	backgroundColor: 'transparent',
});

/**
 * __Blanket__
 *
 * A Blanket provides the overlay layer for components such as a modal dialog or a tooltip
 *
 * - [Examples](https://atlaskit.atlassian.com/examples/design-system/blanket/basic-usage)
 */
const Blanket = memo(
	forwardRef<HTMLDivElement, BlanketProps>(function Blanket(
		{
			shouldAllowClickThrough = false,
			isTinted = false,
			onBlanketClicked = noop,
			testId,
			children,
			analyticsContext,
		},
		ref,
	) {
		const mouseDownTarget = useRef<EventTarget | null>(null);

		const onBlanketClickedWithAnalytics = usePlatformLeafEventHandler({
			fn: onBlanketClicked,
			action: 'clicked',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const blanketClickOutsideChildren = useCallback(
			(e: MouseEvent<HTMLDivElement>) =>
				e.currentTarget === e.target && mouseDownTarget.current === e.target
					? onBlanketClickedWithAnalytics(e)
					: undefined,
			[onBlanketClickedWithAnalytics],
		);

		const onClick = shouldAllowClickThrough ? undefined : blanketClickOutsideChildren;

		const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
			mouseDownTarget.current = e.target;
		}, []);

		return (
			/**
			 * It is not normally acceptable to add click and key handlers to non-interactive
			 * elements as this is an accessibility anti-pattern. However, because this
			 * instance is to enable light dismiss functionality instead of creating an
			 * inaccessible custom element, we can add role="presentation" so that there
			 * are no negative impacts to assistive technologies.
			 */
			// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
			<div
				role="presentation"
				css={[
					baseStyles,
					shouldAllowClickThrough && shouldAllowClickThroughStyles,
					!isTinted && invisibleStyles,
				]}
				onClick={onClick}
				onMouseDown={onMouseDown}
				data-testid={testId}
				ref={ref}
			>
				{children}
			</div>
		);
	}),
);

Blanket.displayName = 'Blanket';

export default Blanket;
