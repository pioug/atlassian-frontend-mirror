import React, {
	type ReactNode,
	useEffect,
	useRef,
	forwardRef,
	type MouseEventHandler,
} from 'react';

import { type ListRowProps } from 'react-virtualized';

type Props = {
	children: ReactNode;
	measure: () => void;
	onMouseMove: MouseEventHandler<HTMLDivElement>;
} & Pick<ListRowProps, 'index' | 'style' | 'isScrolling' | 'isVisible'>;

/**
 *
 * @param root0
 * @param root0.children
 * @param root0.registerChild
 * @param root0.measure
 * @param root0.index
 * @param root0.style
 * @param root0.isVisible
 * @param root0.isScrolling
 * @param root0.onMouseMove
 * @example
 */
// The `CellMeasurer` component from react-virtualized expects that his children is a `forwardRef` component.
export const ListRow = forwardRef<HTMLDivElement, Props>(
	({ children, measure, index, style, isVisible, isScrolling, onMouseMove }, ref) => {
		const childElementRef = useRef<HTMLDivElement | null>(null);

		useEffect(() => {
			// Do not measure if the row is not visible or is scrolling for performance reasons.
			if (!childElementRef.current || !isVisible || isScrolling) {
				return;
			}

			const observer = new ResizeObserver(() => measure());
			observer.observe(childElementRef.current);

			return () => observer.disconnect();
		}, [isScrolling, isVisible, measure]);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			<div ref={ref} style={style} data-index={index}>
				<div
					ref={childElementRef}
					data-testid={`list-item-height-observed-${index}`}
					onMouseMove={onMouseMove}
				>
					{children}
				</div>
			</div>
		);
	},
);
