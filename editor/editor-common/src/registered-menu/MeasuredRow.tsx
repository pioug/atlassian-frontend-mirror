import React, { useEffect, useRef } from 'react';

import { Box } from '@atlaskit/primitives/compiled/box';

export const MeasuredRow = ({
	children,
	isScrolling,
	isVisible,
	measure,
	onMeasured,
	paddingBlockStart,
	paddingBlockEnd,
}: {
	children: React.ReactNode;
	isScrolling?: boolean;
	isVisible: boolean;
	measure: () => void;
	onMeasured: () => void;
	paddingBlockEnd?: 'space.100';
	paddingBlockStart?: 'space.100';
}): React.JSX.Element => {
	const rowRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const row = rowRef.current;
		if (!row || isScrolling || !isVisible || typeof ResizeObserver === 'undefined') {
			return;
		}
		const observer = new ResizeObserver(() => {
			measure();
			onMeasured();
		});
		observer.observe(row, { box: 'border-box' });
		return () => observer.disconnect();
	}, [isScrolling, isVisible, measure, onMeasured]);

	return (
		<Box ref={rowRef} paddingBlockStart={paddingBlockStart} paddingBlockEnd={paddingBlockEnd}>
			{children}
		</Box>
	);
};
