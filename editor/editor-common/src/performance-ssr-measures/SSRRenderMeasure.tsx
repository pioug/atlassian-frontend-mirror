import React, { type ReactNode, useCallback, memo, useRef } from 'react';

import { isSSR } from '../core-utils/is-ssr';

import { RenderMarker } from './RenderMarker';

/**
 * Props for SSRRenderMeasure component
 */
interface SSRRenderMeasureProps {
	children?: ReactNode;

	/**
	 * Callback invoked during Server-Side Rendering (SSR) to measure and track performance metrics.
	 * Provides timing information for the render duration of the measured component.
	 *
	 * @param measure.segmentName - Name identifier of the measured segment
	 * @param measure.startTimestamp - Absolute timestamp when rendering started (from `performance.now()`)
	 * @param measure.endTimestamp - Absolute timestamp when rendering completed (from `performance.now()`)
	 *
	 * **Note:** Both timestamps are absolute values from `performance.now()`, not relative times.
	 * Calculate duration as: `measure.endTimestamp - measure.startTimestamp`
	 *
	 * Optional - if not provided, the component renders without measurement.
	 */
	onSSRMeasure?: (measure: {
		endTimestamp: number;
		segmentName: string;
		startTimestamp: number;
	}) => void;

	/**
	 * The name identifier of the component being measured for tracing.
	 *
	 * @example 'ssr-app/render/fullPageEditor'
	 */
	segmentName: string;

	/**
	 * Reference to the start timestamp of the component render.
	 *
	 * **CRITICAL:** Must be created using `useRef(performance.now())` as the **first line**
	 * in the component being profiled to capture the most accurate start time.
	 *
	 * Using a ref (instead of state or regular variable) is essential to:
	 * - Avoid triggering re-renders
	 * - Preserve the initial timestamp across component lifecycle
	 * - Ensure measurement accuracy
	 *
	 * @example
	 * ```tsx
	 * function MyComponent() {
	 *   const startTimestampRef = useRef(performance.now()); // MUST be first line
	 *   // ...rest of component logic
	 *
	 *   return (
	 *     <SSRRenderMeasure
	 *       segmentName="ssr-app/render/myComponent"
	 *       startTimestampRef={startTimestampRef}
	 *       onSSRMeasure={handleMeasure}
	 *     >
	 *       {content}
	 *     </SSRRenderMeasure>
	 *   );
	 * }
	 * ```
	 */
	startTimestampRef: { current: number };
}

function SSRRenderMeasureImpl({
	onSSRMeasure,
	segmentName,
	startTimestampRef,
	children,
}: SSRRenderMeasureProps) {
	const wasMeasured = useRef(false);

	const handleOnRender = useCallback(() => {
		if (wasMeasured.current) {
			return;
		}

		onSSRMeasure?.({
			segmentName,
			startTimestamp: startTimestampRef.current,
			endTimestamp: performance.now(),
		});

		wasMeasured.current = true;
	}, [onSSRMeasure, segmentName, startTimestampRef]);

	return (
		<>
			{children}

			<RenderMarker onRender={handleOnRender} />
		</>
	);
}

const SSRRenderMeasureNoOp = memo(({ children }: SSRRenderMeasureProps) => {
	return children;
});

/**
 * Component for measuring render performance during Server-Side Rendering (SSR).
 *
 * This component wraps content to measure its render duration in SSR mode.
 * On client builds, it's optimized to a no-op component with zero performance overhead.
 * On SSR builds, it captures timing data and reports it via the `onSSRMeasure` callback.
 *
 * **How it works:**
 * - Measures from `startTimestampRef.current` (component start) to when `RenderMarker` is rendered
 * - Uses `RenderMarker` to detect when the render completes successfully
 * - Only reports the measurement once (protected by `wasMeasured` ref)
 * - If child components throw errors during render, the measurement will not be reported
 *
 * **Usage pattern:**
 * 1. Create `startTimestampRef` as the **first line** in your component using `useRef(performance.now())`
 * 2. Wrap your content with `SSRRenderMeasure` at the end of your component
 * 3. Provide the `onSSRMeasure` callback to receive timing data
 *
 * @example
 * ```tsx
 * function FullPageEditor({ onSSRMeasure }) {
 *   // CRITICAL: Must be the first line for accurate timing
 *   const startTimestampRef = useRef(performance.now());
 *
 *   // ...component logic, hooks, etc.
 *
 *   return (
 *     <SSRRenderMeasure
 *       segmentName="ssr-app/render/fullPageEditor"
 *       startTimestampRef={startTimestampRef}
 *       onSSRMeasure={onSSRMeasure}
 *     >
 *       <EditorContent />
 *     </SSRRenderMeasure>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Handling the measurement callback
 * const handleSSRMeasure = (measure) => {
 *   const duration = measure.endTimestamp - measure.startTimestamp;
 *   console.log(`${measure.segmentName} rendered in ${duration}ms`);
 *   // Send to analytics, logging, etc.
 * };
 * ```
 */
export const SSRRenderMeasure = isSSR() ? SSRRenderMeasureImpl : SSRRenderMeasureNoOp;
