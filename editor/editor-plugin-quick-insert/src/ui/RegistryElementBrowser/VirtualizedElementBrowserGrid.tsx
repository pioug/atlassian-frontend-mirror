/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { defaultRangeExtractor, type Range, useVirtualizer } from '@tanstack/react-virtual';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type { RegistryElementBrowserItem } from './model';

const ESTIMATED_ROW_HEIGHT = 150;
const OVERSCAN_ROWS = 3;
const ROW_INDEX_ATTRIBUTE = 'data-virtual-row';

const styles = cssMap({
	frame: {
		position: 'relative',
	},
	row: {
		display: 'grid',
		gap: token('space.200'),
		insetBlockStart: 0,
		insetInlineStart: 0,
		position: 'absolute',
		width: '100%',
	},
	rowGap: {
		paddingBlockEnd: token('space.200'),
	},
	tile: {
		minWidth: 0,
	},
	oneColumn: {
		gridTemplateColumns: 'minmax(0, 1fr)',
	},
	twoColumns: {
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	},
	threeColumns: {
		gridTemplateColumns: 'repeat(3, minmax(0, 264px))',
	},
});

type Props = {
	columnCount: number;
	focusedRow?: number;
	items: RegistryElementBrowserItem[];
	renderItem: (item: RegistryElementBrowserItem, index: number, count: number) => React.ReactNode;
	requestedRow?: number;
	scrollElement: HTMLElement | null;
	selectedRow?: number;
};

const estimateRowHeight = () => ESTIMATED_ROW_HEIGHT;

export const VirtualizedElementBrowserGrid = ({
	columnCount,
	focusedRow,
	items,
	renderItem,
	requestedRow,
	scrollElement,
	selectedRow,
}: Props): React.JSX.Element => {
	const frameRef = useRef<HTMLDivElement>(null);
	const [scrollMargin, setScrollMargin] = useState(0);
	const rows = useMemo(
		() =>
			Array.from({ length: Math.ceil(items.length / columnCount) }, (_, index) => {
				const start = index * columnCount;
				const entries = items.slice(start, start + columnCount);
				return {
					entries,
					key: entries.map(({ registration }) => registration.key).join('\0'),
					start,
				};
			}),
		[columnCount, items],
	);
	const rowCount = rows.length;
	const getItemKey = useCallback(
		(index: number) => `${rows[index].key}:${index === rowCount - 1}`,
		[rows, rowCount],
	);
	const rangeExtractor = useCallback(
		(range: Range) => {
			const indexes = new Set(defaultRangeExtractor(range));
			// Keep DOM focus and the listbox tab stop when a user scrolls them out of view.
			for (const index of [focusedRow, requestedRow, selectedRow]) {
				if (index !== undefined && index >= 0 && index < range.count) {
					indexes.add(index);
				}
			}
			return [...indexes].sort((first, second) => first - second);
		},
		[focusedRow, requestedRow, selectedRow],
	);
	const virtualizer = useVirtualizer<HTMLElement, HTMLDivElement>({
		count: rowCount,
		estimateSize: estimateRowHeight,
		getItemKey,
		getScrollElement: () => scrollElement,
		indexAttribute: ROW_INDEX_ATTRIBUTE,
		overscan: OVERSCAN_ROWS,
		rangeExtractor,
		scrollMargin,
	});

	useLayoutEffect(() => {
		const frame = frameRef.current;
		if (!frame || !scrollElement) {
			return;
		}

		let previousWidth = frame.clientWidth;
		const updateLayout = () => {
			const frameRect = frame.getBoundingClientRect();
			const scrollRect = scrollElement.getBoundingClientRect();
			setScrollMargin(
				frameRect.top - scrollRect.top + scrollElement.scrollTop - scrollElement.clientTop,
			);

			const width = frame.clientWidth;
			if (width !== previousWidth) {
				previousWidth = width;
				// Measurements for unmounted rows can be stale after their content reflows.
				virtualizer.measure();
				// Rebuild row measurements before measureElement reads the cache.
				virtualizer.getTotalSize();
				frame
					.querySelectorAll<HTMLDivElement>(`[${ROW_INDEX_ATTRIBUTE}]`)
					.forEach(virtualizer.measureElement);
			}
		};

		updateLayout();
		const observer = new ResizeObserver(updateLayout);
		observer.observe(frame);
		observer.observe(scrollElement);
		// Content before the grid can move its start within the shared modal scroll area.
		if (scrollElement.firstElementChild) {
			observer.observe(scrollElement.firstElementChild);
		}
		return () => observer.disconnect();
	}, [scrollElement, virtualizer]);

	return (
		<div
			css={styles.frame}
			ref={frameRef}
			role="presentation"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- The virtualizer measures the height at runtime.
			style={{ height: virtualizer.getTotalSize() }}
		>
			{virtualizer.getVirtualItems().map(({ index, start }) => {
				const row = rows[index];
				return (
					<div
						css={[
							styles.row,
							columnCount === 1 && styles.oneColumn,
							columnCount === 2 && styles.twoColumns,
							columnCount === 3 && styles.threeColumns,
							index < rowCount - 1 && styles.rowGap,
						]}
						data-virtual-row={index}
						key={row.key}
						ref={virtualizer.measureElement}
						role="presentation"
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- The virtualizer measures row positions at runtime.
						style={{ transform: `translateY(${start - scrollMargin}px)` }}
					>
						{row.entries.map((item, indexInRow) => (
							<div
								css={styles.tile}
								data-virtual-option={item.registration.key}
								key={item.registration.key}
								role="presentation"
							>
								{renderItem(item, row.start + indexInRow, items.length)}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
};
