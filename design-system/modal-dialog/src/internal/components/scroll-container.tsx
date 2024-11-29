/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { forwardRef, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import FocusRing from '@atlaskit/focus-ring';
import { media } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { keylineColor, keylineHeight } from '../constants';

const baseStyles = css({
	display: 'inherit',
	margin: token('space.0', '0px'),
	flex: 'inherit',
	flexDirection: 'inherit',
	flexGrow: 1,
	overflowX: 'hidden',
	overflowY: 'auto',
	[media.above.xs]: {
		height: 'unset',
		overflowY: 'auto',
	},
});

const topKeylineStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderBlockStart: `${keylineHeight}px solid ${keylineColor}`,
});

const bottomKeylineStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderBlockEnd: `${keylineHeight}px solid ${keylineColor}`,
});

interface ScrollContainerProps {
	/**
	 * Children of the body within modal dialog.
	 */
	children: React.ReactNode;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * A container that shows top and bottom keylines when the
 * content overflows into the scrollable element.
 */
const ScrollContainer = forwardRef<HTMLElement | null, ScrollContainerProps>(
	({ testId, children }, ref) => {
		const scrollableRef = useRef<HTMLDivElement>(null);
		const [showTopKeyline, setTopKeyline] = useState(false);
		const [showBottomKeyline, setBottomKeyline] = useState(false);

		const [showContentFocus, setContentFocus] = useState(false);

		// Schedule a content focus on the target element
		// WARNING: In theory, `target` may not be available when `rafSchedule` hits in concurrent rendering
		useEffect(() => {
			const schedule = rafSchedule(() => {
				const target = scrollableRef.current;
				target && setContentFocus(target.scrollHeight > target.clientHeight);
			});

			schedule();
		}, [scrollableRef]);

		const setLazyKeylines = useLazyCallback(
			rafSchedule(() => {
				const target = scrollableRef.current;
				if (target) {
					const scrollableDistance = target.scrollHeight - target.clientHeight;

					if (target.previousElementSibling) {
						setTopKeyline(target.scrollTop > keylineHeight);
					}

					if (target.nextElementSibling) {
						setBottomKeyline(target.scrollTop <= scrollableDistance - keylineHeight);
					}
				}
			}),
		);

		// On load (and scroll/resize events), we set "keylines"
		// these border the content to indicate scrollability when content underflows the header or footer
		useEffect(() => {
			const target = scrollableRef.current;
			setLazyKeylines();

			const unbindWindowEvent = bind(window, {
				type: 'resize',
				listener: setLazyKeylines,
			});

			const unbindTargetEvent = target
				? bind(target, { type: 'scroll', listener: setLazyKeylines })
				: noop;

			return () => {
				unbindWindowEvent();
				unbindTargetEvent();
			};
		}, [setLazyKeylines]);

		return (
			<FocusRing isInset>
				<div
					// tabindex is allowed here so that keyboard users can scroll content
					// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
					tabIndex={showContentFocus ? 0 : undefined}
					role={showContentFocus ? 'region' : undefined}
					aria-label={showContentFocus ? 'Scrollable content' : undefined}
					data-testid={testId && `${testId}--scrollable`}
					ref={mergeRefs([ref, scrollableRef])}
					css={[
						baseStyles,
						showTopKeyline && topKeylineStyles,
						showBottomKeyline && bottomKeylineStyles,
					]}
				>
					{children}
				</div>
			</FocusRing>
		);
	},
);

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
