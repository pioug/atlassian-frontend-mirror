/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import { cssMap, cx, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const keylineColor = token('color.border');

const styles = cssMap({
	base: {
		display: 'inherit',
		flex: 'inherit',
		flexDirection: 'inherit',
		flexGrow: 1,
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		overflowX: 'hidden',
		overflowY: 'auto',
		'@media (min-width: 30rem)': {
			// @ts-ignore
			height: 'unset',
			overflowY: 'auto',
		},
	},
	topKeyline: {
		borderBlockStart: `${token('border.width.selected')} solid ${keylineColor}`,
	},
	bottomKeyline: {
		borderBlockEnd: `${token('border.width.selected')} solid ${keylineColor}`,
	},
});

const keylineHeight = 2;

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
			<Focusable
				as="div"
				isInset
				// tabindex is allowed here so that keyboard users can scroll content
				// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
				tabIndex={showContentFocus ? 0 : undefined}
				role={showContentFocus ? 'region' : undefined}
				aria-label={showContentFocus ? 'Scrollable content' : undefined}
				testId={testId && `${testId}--scrollable`}
				ref={mergeRefs([ref, scrollableRef])}
				xcss={cx(
					styles.base,
					showTopKeyline && styles.topKeyline,
					showBottomKeyline && styles.bottomKeyline,
				)}
			>
				{children}
			</Focusable>
		);
	},
);

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
