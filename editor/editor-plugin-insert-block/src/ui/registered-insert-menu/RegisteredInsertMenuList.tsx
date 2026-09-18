import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';
import type { ListRowRenderer, ListProps } from 'react-virtualized/dist/commonjs/List';

import { cssMap } from '@atlaskit/css';
import type { QuickInsertMenuModel } from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
	RegisterMenuItem,
	RegisterMenuSection,
	SurfaceContext,
} from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { RegisteredInsertMenuItem } from './RegisteredInsertMenuItem';

const ESTIMATED_ROW_HEIGHT = 56;
const MENU_FOOTER_HEIGHT = 52;
const MENU_SEARCH_HEIGHT = 64;
const LIST_WIDTH = 350;
const listAriaProps: Pick<ListProps, 'aria-readonly'> = {
	// @ts-expect-error react-virtualized forwards null to omit its grid-only default; its types exclude null.
	'aria-readonly': null,
};

const styles = cssMap({
	footer: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		flexShrink: 0,
		paddingBlock: token('space.050'),
	},
});

type Props = {
	editorView: EditorView;
	isOffline: boolean;
	listId: string;
	listLabel: string;
	maxHeight: number;
	menuOpenId: symbol;
	model: QuickInsertMenuModel;
	onClose: () => void;
	onItemHover: (index: number) => void;
	onRenderedItemsChange: (range: { startIndex: number; stopIndex: number }) => void;
	selectedItemIndex: number;
	surfaceContext: SurfaceContext;
};

export const RegisteredInsertMenuList = ({
	editorView,
	isOffline,
	listId,
	listLabel,
	maxHeight,
	menuOpenId,
	model,
	onClose,
	onItemHover,
	onRenderedItemsChange,
	selectedItemIndex,
	surfaceContext,
}: Props): React.JSX.Element | null => {
	const Root = model.root?.component ?? React.Fragment;
	const listRef = useRef<List | null>(null);
	const rows = useMemo<Array<RegisterMenuItem | RegisterMenuSection>>(
		() => model.sections.flat(),
		[model.sections],
	);
	const cache = useMemo(
		() => new CellMeasurerCache({ defaultHeight: ESTIMATED_ROW_HEIGHT, fixedWidth: true }),
		[],
	);
	const itemIndexByRowIndex = useMemo(() => {
		const indexes = new Map<number, number>();
		let itemIndex = 0;

		rows.forEach((registration, rowIndex) => {
			if (registration.type === 'menu-item') {
				indexes.set(rowIndex, itemIndex++);
			}
		});

		return indexes;
	}, [rows]);
	const selectedRowIndex = useMemo(() => {
		for (const [rowIndex, itemIndex] of itemIndexByRowIndex) {
			if (itemIndex === selectedItemIndex) {
				return rowIndex;
			}
		}

		return -1;
	}, [itemIndexByRowIndex, selectedItemIndex]);
	const rowKeySignature = useMemo(
		() => rows.map(({ key, type }) => `${type}:${key}`).join('\0'),
		[rows],
	);

	useLayoutEffect(() => {
		cache.clearAll();
		listRef.current?.recomputeRowHeights();
		listRef.current?.scrollToPosition(0);
	}, [cache, rowKeySignature]);

	const onRowsRendered = useCallback<NonNullable<ListProps['onRowsRendered']>>(
		({ overscanStartIndex, overscanStopIndex }) => {
			const indexes = [...itemIndexByRowIndex]
				.filter(([rowIndex]) => rowIndex >= overscanStartIndex && rowIndex <= overscanStopIndex)
				.map(([, itemIndex]) => itemIndex);
			onRenderedItemsChange({
				startIndex: indexes[0] ?? -1,
				stopIndex: indexes[indexes.length - 1] ?? -1,
			});
		},
		[itemIndexByRowIndex, onRenderedItemsChange],
	);

	const renderRow: ListRowRenderer = useCallback(
		({ index, key, parent, style }) => {
			const registration = rows[index];
			if (!registration) {
				return null;
			}

			const itemIndex = itemIndexByRowIndex.get(index);
			const rowContent =
				registration.type === 'menu-section' ? (
					React.createElement(registration.component ?? React.Fragment, null, null)
				) : (
					<div onMouseMove={() => onItemHover(itemIndex ?? 0)}>
						<RegisteredInsertMenuItem
							editorView={editorView}
							id={`${listId}-${itemIndex}`}
							isOffline={isOffline}
							isSelected={itemIndex === selectedItemIndex}
							menuOpenId={menuOpenId}
							onClose={onClose}
							registration={registration}
							surfaceContext={surfaceContext}
						/>
					</div>
				);

			return (
				<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
					{({ registerChild }) => (
						<div
							ref={(element) => registerChild?.(element ?? undefined)}
							data-index={index}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							style={style}
						>
							{rowContent}
						</div>
					)}
				</CellMeasurer>
			);
		},
		[
			cache,
			editorView,
			isOffline,
			itemIndexByRowIndex,
			listId,
			menuOpenId,
			onClose,
			onItemHover,
			rows,
			selectedItemIndex,
			surfaceContext,
		],
	);
	const footerItemIndex = itemIndexByRowIndex.size;
	const listMaxHeight = Math.max(
		0,
		maxHeight - MENU_SEARCH_HEIGHT - (model.footer ? MENU_FOOTER_HEIGHT : 0),
	);
	const onFooterItemHover = useCallback(
		() => onItemHover(footerItemIndex),
		[footerItemIndex, onItemHover],
	);

	if (!model.root) {
		return null;
	}

	return (
		<Root>
			<Box aria-label={listLabel} id={listId} role="listbox">
				{rows.length > 0 && (
					<List
						// eslint-disable-next-line react/jsx-props-no-spreading -- Omits the library's grid-only ARIA default without declaring it on the group role.
						{...listAriaProps}
						tabIndex={null}
						containerRole="presentation"
						height={Math.min(rows.length * ESTIMATED_ROW_HEIGHT, listMaxHeight)}
						overscanRowCount={3}
						onRowsRendered={onRowsRendered}
						ref={listRef}
						role="group"
						rowCount={rows.length}
						rowHeight={cache.rowHeight}
						rowRenderer={renderRow}
						scrollToAlignment="auto"
						scrollToIndex={selectedRowIndex}
						width={LIST_WIDTH}
					/>
				)}
				{model.footer && (
					<Box xcss={styles.footer} onMouseMove={onFooterItemHover}>
						<RegisteredInsertMenuItem
							editorView={editorView}
							id={`${listId}-${footerItemIndex}`}
							isOffline={isOffline}
							isSelected={footerItemIndex === selectedItemIndex}
							menuOpenId={menuOpenId}
							onClose={onClose}
							registration={model.footer}
							surfaceContext={surfaceContext}
						/>
					</Box>
				)}
			</Box>
		</Root>
	);
};
