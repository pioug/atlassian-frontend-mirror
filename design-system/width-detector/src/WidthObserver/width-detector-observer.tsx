import React from 'react';

import { useInView } from './hooks';
import { type WidthObserverProps } from './types';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const WidthDetectorObserver: React.MemoExoticComponent<({ setWidth, offscreen }: WidthObserverProps) => React.JSX.Element> = React.memo(
	({ setWidth, offscreen }: WidthObserverProps): React.JSX.Element => {
		const [inViewRef, inView, target] = useInView({
			/* Optional options */
			threshold: 0,
		});

		const observer = React.useRef(() => {
			if (typeof window === 'undefined') {
				return null;
			}

			// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40909
			// @ts-ignore
			return new ResizeObserver((entries) => {
				if (!Array.isArray(entries) || !entries.length) {
					return;
				}

				const { width } = entries[0].contentRect;

				setWidth(Math.round(width));
			});
		});

		React.useEffect(() => {
			const { current: currentObserver } = observer;
			const resizeObserver = currentObserver();

			if (resizeObserver === null) {
				return;
			}

			if (target) {
				if (inView || offscreen) {
					resizeObserver.observe(target);
				} else {
					resizeObserver.unobserve(target);
				}
			}

			return () => {
				resizeObserver.disconnect();
			};
		}, [target, inView, offscreen]);

		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'block',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '100%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
				}}
				ref={inViewRef}
			/>
		);
	},
);
