import React, { type ReactNode, useEffect, useRef, MouseEventHandler } from 'react';

import { ListRowProps } from 'react-virtualized';

type Props = {
	measure: () => void;
	registerChild?: (element?: Element) => void;
	onMouseMove: MouseEventHandler<HTMLDivElement>;
	children: ReactNode;
} & Pick<ListRowProps, 'index' | 'style' | 'isScrolling' | 'isVisible'>;

export function ListRow({
	children,
	registerChild,
	measure,
	index,
	style,
	isVisible,
	isScrolling,
	onMouseMove,
}: Props) {
	const childElementRef = useRef<HTMLDivElement | null>(null);

	const setListElementRef = (element: HTMLDivElement | null) => {
		registerChild?.(element ?? undefined);
	};

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
		<div ref={setListElementRef} style={style} data-index={index}>
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				ref={childElementRef}
				data-testid={`list-item-height-observed-${index}`}
				onMouseMove={onMouseMove}
			>
				{children}
			</div>
		</div>
	);
}
