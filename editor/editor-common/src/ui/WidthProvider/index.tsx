/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import memoizeOne from 'memoize-one';
import rafSchedule from 'raf-schd';

import { fg } from '@atlaskit/platform-feature-flags';
import { WidthObserver } from '@atlaskit/width-detector';

const styles = css({
	position: 'relative',
	width: '100%',
});

export type Breakpoints = 'S' | 'M' | 'L';

export type WidthConsumerContext = {
	width: number;
	breakpoint: Breakpoints;
};

const SCROLLBAR_WIDTH = 30;

export function getBreakpoint(width: number = 0): Breakpoints {
	const MAX_S = 1266;
	const MAX_M = 2146;

	if (width >= MAX_S && width < MAX_M) {
		return 'M';
	} else if (width >= MAX_M) {
		return 'L';
	}

	return 'S';
}

export function createWidthContext(width: number = 0): WidthConsumerContext {
	return { width, breakpoint: getBreakpoint(width) };
}

export const WidthContext = React.createContext(createWidthContext());

const { Provider, Consumer } = WidthContext;

export type WidthProviderState = {
	width?: number;
};

type WidthProviderProps = {
	className?: string;
	shouldCheckExistingValue?: boolean;
	children?: React.ReactNode;
};

/**
 * 🧱 Internal function: Editor FE Platform
 *
 * Returns the width of the document body.
 *
 * This function is memoized to avoid forcing a layout reflow multiple times.
 * It uses `document.body.offsetWidth` as the source of the width, which can lead to
 * a layout reflow if accessed repeatedly. To mitigate performance issues, the result
 * is cached using `memoizeOne`.
 *
 * @returns {number} The width of the document body or 0 if the document is undefined.
 */
export const getBodyWidth = memoizeOne(() => {
	return typeof document !== 'undefined' ? document.body?.offsetWidth ?? 0 : 0;
});

export const WidthProvider = ({
	className,
	shouldCheckExistingValue,
	children,
}: WidthProviderProps) => {
	const shouldFixTableResizing = Boolean(fg('platform-fix-table-ssr-resizing'));
	const containerRef = useRef<HTMLDivElement>(null);
	const existingContextValue: WidthConsumerContext = useContext(WidthContext);
	const [isInitialWidthUpdated, setIsInitialWidthUpdated] = useState(false);
	const [width, setWidth] = useState<number>(getBodyWidth);
	const widthRef = useRef(width);
	const isMountedRef = useRef(true);
	const providerValue = useMemo(() => createWidthContext(width), [width]);

	const updateWidth = useMemo(() => {
		return rafSchedule((nextWidth: number) => {
			const currentWidth = widthRef.current || 0;
			// Ignore changes that are less than SCROLLBAR_WIDTH, otherwise it can cause infinite re-scaling
			if (Math.abs(currentWidth - nextWidth) < SCROLLBAR_WIDTH) {
				return;
			}

			// Avoid React memory leak by checking if the component is still mounted
			if (!isMountedRef.current) {
				return;
			}

			setWidth(nextWidth);
		});
	}, []);

	const skipWidthDetection = shouldCheckExistingValue && existingContextValue.width > 0;

	useLayoutEffect(() => {
		isMountedRef.current = true;
		if (shouldFixTableResizing && !isInitialWidthUpdated) {
			// useLayoutEffect is not run in SSR mode
			// The visibility change for SSR is done in packages/editor/renderer/src/ui/Renderer/breakout-ssr.tsx
			setIsInitialWidthUpdated(true);
			if (containerRef.current) {
				setWidth(containerRef.current.offsetWidth);
			}
		}
		return () => {
			isMountedRef.current = false;
		};
	}, [isInitialWidthUpdated, shouldFixTableResizing, width]);

	return (
		<div
			css={styles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			ref={containerRef}
			// Using style not css prop because we need to also reset these style in SSR
			// It is done in packages/editor/renderer/src/ui/Renderer/breakout-ssr.tsx
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Intended
			style={
				shouldFixTableResizing && !isInitialWidthUpdated
					? {
							// Width is initialized with body width but in Confluence this is too wide as side nav takes some space.
							// Putting the div into hidden until we can get the correct width.
							// Only setting the visibility so children still takes space which will make scrollbar to correct appear.
							// Scrollbar has width too it needs to be taken into account otherwise table is going to shrink after appeared.
							visibility: 'hidden',
							// Because the body width is too wide, the horizontal scrollbar gonna shown
							// Temporary hide it until we get the correct width
							overflowX: 'hidden',
						}
					: {}
			}
		>
			{!skipWidthDetection && (
				<Fragment>
					<WidthObserver setWidth={updateWidth} offscreen />
					<Provider value={providerValue}>{children}</Provider>
				</Fragment>
			)}
			{skipWidthDetection && children}
		</div>
	);
};

export { Consumer as WidthConsumer };
