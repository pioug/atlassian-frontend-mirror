/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import memoizeOne from 'memoize-one';
import rafSchedule from 'raf-schd';

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
const getBodyWidth = memoizeOne(() => {
	return typeof document !== 'undefined' ? document.body?.offsetWidth ?? 0 : 0;
});

export const WidthProvider = ({
	className,
	shouldCheckExistingValue,
	children,
}: WidthProviderProps) => {
	const existingContextValue: WidthConsumerContext = React.useContext(WidthContext);
	const [width, setWidth] = React.useState(getBodyWidth);
	const widthRef = React.useRef(width);
	const isMountedRef = React.useRef(true);
	const providerValue = React.useMemo(() => createWidthContext(width), [width]);

	const updateWidth = React.useMemo(() => {
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

	React.useLayoutEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
		};
	}, []);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div css={styles} className={className}>
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
