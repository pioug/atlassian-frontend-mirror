/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl, useIntl } from 'react-intl';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { ListRowRenderer } from 'react-virtualized/dist/commonjs/List';
import { List } from 'react-virtualized/dist/commonjs/List';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SelectItemMode, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import type { ExtractInjectionAPI, TypeAheadItem } from '@atlaskit/editor-common/types';
import { AssistiveText } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { MenuGroup } from '@atlaskit/menu';
import { Text, Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
import { token } from '@atlaskit/tokens';

import type { InputMethodType } from '../pm-plugins/analytics';
import { closeTypeAhead } from '../pm-plugins/commands/close-type-ahead';
import { updateSelectedIndex } from '../pm-plugins/commands/update-selected-index';
import { TYPE_AHEAD_DECORATION_ELEMENT_ID } from '../pm-plugins/constants';
import { getTypeAheadListAriaLabels, moveSelectedIndex } from '../pm-plugins/utils';
import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { TypeAheadHandler, TypeAheadResolvedSection } from '../types';

import { ListRow } from './ListRow';
import { MoreOptions } from './MoreOptions';
import { TypeAheadListItem } from './TypeAheadListItem';

const LIST_ITEM_ESTIMATED_HEIGHT = 64;
const LIST_WIDTH = 320;

const list = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: { padding: `${token('space.100')} ${token('space.150')}` },
});

type TypeAheadListProps = {
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	decorationElement: HTMLElement;
	editorView: EditorView;
	emptyItem?: TypeAheadItem;
	fitHeight: number;
	isEmptyQuery?: boolean;
	items: Array<TypeAheadItem>;
	moreElementsInQuickInsertViewEnabled?: boolean;
	onItemClick: (mode: SelectItemMode, index: number, inputMethod?: InputMethodType) => void;
	onMoreOptionsClicked?: () => void;
	sections?: Array<TypeAheadResolvedSection>;
	selectedIndex: number;
	showMoreOptionsButton?: boolean;
	triggerHandler?: TypeAheadHandler;
} & WrappedComponentProps;

type TypeAheadRowEntry =
	| { section: TypeAheadResolvedSection; type: 'section' }
	| { itemIndex: number; type: 'item' };

/**
 * Resolves section title visibility before rows are built so hidden titles do not
 * occupy virtualized list rows. A single populated section keeps the existing
 * no-title behaviour unless it opts in with `showWhenOnlySection`; multiple
 * populated sections show titles by default. `showWhenQueryPresent: false`
 * takes precedence once the query is non-empty.
 */
const shouldRenderSectionTitle = ({
	isEmptyQuery,
	populatedSectionCount,
	section,
}: {
	isEmptyQuery: boolean;
	populatedSectionCount: number;
	section: TypeAheadResolvedSection;
}): boolean => {
	if (!expVal('platform_editor_agent_mentions', 'isEnabled', false)) {
		return populatedSectionCount > 1;
	}

	if (!isEmptyQuery && section.sectionTitleDisplay?.showWhenQueryPresent === false) {
		return false;
	}

	if (populatedSectionCount === 1) {
		return section.sectionTitleDisplay?.showWhenOnlySection === true;
	}

	return true;
};

export const buildTypeAheadRows = ({
	isEmptyQuery,
	itemsLength,
	sections,
}: {
	isEmptyQuery: boolean;
	itemsLength: number;
	sections: Array<TypeAheadResolvedSection>;
}): Array<TypeAheadRowEntry> => {
	if (sections.length === 0) {
		return Array.from({ length: itemsLength }, (_, itemIndex) => ({ type: 'item', itemIndex }));
	}

	const sortedSections = [...sections].sort((left, right) => left.startIndex - right.startIndex);
	const sectionsByStartIndex = new Map<number, TypeAheadResolvedSection>(
		sortedSections.map((section) => [section.startIndex, section]),
	);
	const rows: Array<TypeAheadRowEntry> = [];
	const populatedSectionCount = sortedSections.length;

	for (let itemIndex = 0; itemIndex < itemsLength; itemIndex++) {
		const section = sectionsByStartIndex.get(itemIndex);
		if (section) {
			const shouldRenderTitle = shouldRenderSectionTitle({
				isEmptyQuery,
				populatedSectionCount,
				section,
			});
			if (shouldRenderTitle) {
				rows.push({ type: 'section', section });
			}
		}
		rows.push({ type: 'item', itemIndex });
	}

	return rows;
};

const TypeaheadAssistiveTextPureComponent = React.memo(
	({ numberOfResults }: { numberOfResults: string }) => {
		const intl = useIntl();
		return (
			<AssistiveText
				assistiveText={intl.formatMessage(typeAheadListMessages.searchResultsLabel, {
					itemsLength: numberOfResults,
				})}
				// when the popup is open its always in focus
				isInFocus={true}
				id={TYPE_AHEAD_DECORATION_ELEMENT_ID + '__popup'}
			/>
		);
	},
);

const TypeAheadListComponent = React.memo(
	({
		items,
		sections,
		emptyItem,
		selectedIndex,
		isEmptyQuery = true,
		editorView,
		onItemClick,
		intl,
		fitHeight,
		decorationElement,
		triggerHandler,
		moreElementsInQuickInsertViewEnabled,
		api,
		showMoreOptionsButton,
		onMoreOptionsClicked,
	}: TypeAheadListProps) => {
		const listRef = useRef<List>() as React.MutableRefObject<List>;
		const listContainerRef = useRef<HTMLDivElement>(null);
		const lastInputMethodRef = useRef<'mouse' | 'keyboard'>('keyboard');
		const mouseMovedRef = useRef(false);
		const lastVisibleIndexes = useRef({
			overscanStartIndex: 0,
			overscanStopIndex: 0,
			startIndex: 0,
			stopIndex: 0,
		});

		// Exclude view more item from the count
		const itemsLength = showMoreOptionsButton ? Math.max(items.length - 1, 0) : items.length;

		const isEmptyStateActive =
			expValEquals('platform_editor_insert_menu_ai', 'isEnabled', true) &&
			!!emptyItem &&
			itemsLength === 1 &&
			items[0] === emptyItem;

		const estimatedHeight = itemsLength * LIST_ITEM_ESTIMATED_HEIGHT;

		const [height, setHeight] = useState(Math.min(estimatedHeight, fitHeight));

		const [cache, setCache] = useState(
			new CellMeasurerCache({
				fixedWidth: true,
				defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT,
			}),
		);

		const listRows = useMemo(
			() =>
				buildTypeAheadRows({
					isEmptyQuery,
					itemsLength,
					sections: sections || [],
				}),
			[isEmptyQuery, itemsLength, sections],
		);

		const itemRowIndexByItemIndex = useMemo(() => {
			const rowIndexByItemIndex = new Map<number, number>();
			listRows.forEach((row, rowIndex) => {
				if (row.type === 'item') {
					rowIndexByItemIndex.set(row.itemIndex, rowIndex);
				}
			});
			return rowIndexByItemIndex;
		}, [listRows]);

		const selectedItemRowIndex =
			selectedIndex >= 0 ? (itemRowIndexByItemIndex.get(selectedIndex) ?? -1) : -1;

		const onItemsRendered = useCallback(
			(props: {
				overscanStartIndex: number;
				overscanStopIndex: number;
				startIndex: number;
				stopIndex: number;
			}) => {
				lastVisibleIndexes.current = props;
			},
			[],
		);

		const actions = useMemo(() => ({ onItemClick }), [onItemClick]);

		const isNavigationKey = (event: KeyboardEvent): boolean => {
			return ['ArrowDown', 'ArrowUp', 'Tab', 'Enter', 'Shift'].includes(event.key);
		};

		const focusTargetElement = useCallback(() => {
			//To reset the selected index
			updateSelectedIndex(-1, api)(editorView.state, editorView.dispatch);
			listRef.current.scrollToRow(0);
			decorationElement?.querySelector<HTMLSpanElement>(`[role='combobox']`)?.focus();
		}, [editorView, listRef, decorationElement, api]);

		const selectNextItem = useMemo(
			() =>
				moveSelectedIndex({
					editorView,
					direction: 'next',
					api,
				}),
			[editorView, api],
		);

		const selectPreviousItem = useMemo(
			() =>
				moveSelectedIndex({
					editorView,
					direction: 'previous',
					api,
				}),
			[editorView, api],
		);

		const lastVisibleStartIndex = lastVisibleIndexes.current.startIndex;
		const lastVisibleStopIndex = lastVisibleIndexes.current.stopIndex;
		const onScroll = useCallback(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			({ scrollUpdateWasRequested }: any) => {
				if (!scrollUpdateWasRequested) {
					return;
				}

				// In case the user scroll to a non-visible item like press ArrowUp from the first index
				// We will force the scroll calling the scrollToItem in the useEffect hook
				// When the scroll happens and we render the elements,
				// we still need calculate the items height and re-draw the List.
				// It is possible the item selected became invisible again (because the items height changed)
				// So, we need to wait for height to be calculated. Then we need to check
				// if the selected item is visible or not. If it isn't visible we call the scrollToItem again.
				//
				// We can't do this check in the first frame because that frame is being used by the resetScreenThrottled
				// to calculate each height. THen, we can schedule a new frame when this one finishs.
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						const isViewMoreSelected = showMoreOptionsButton && selectedIndex === itemsLength;
						const isSelectedItemVisible =
							(selectedItemRowIndex >= lastVisibleStartIndex &&
								selectedItemRowIndex <= lastVisibleStopIndex) ||
							// view more is always visible, hence no scrolling
							isViewMoreSelected;

						//Should scroll to the list item only when the selectedIndex >= 0 and item is not visible
						if (!isSelectedItemVisible && selectedIndex !== -1) {
							listRef.current.scrollToRow(selectedItemRowIndex);
						} else if (selectedIndex === -1) {
							listRef.current.scrollToRow(0);
						}
					});
				});
			},
			[
				selectedIndex,
				lastVisibleStartIndex,
				lastVisibleStopIndex,
				itemsLength,
				showMoreOptionsButton,
				selectedItemRowIndex,
			],
		);

		const onMouseMove = (event: React.MouseEvent, row: TypeAheadRowEntry) => {
			if (row.type !== 'item') {
				return;
			}

			const itemIndex = row.itemIndex;
			event.preventDefault();
			event.stopPropagation();
			if (selectedIndex === itemIndex) {
				return;
			}
			mouseMovedRef.current = true;
			lastInputMethodRef.current = 'mouse';
			updateSelectedIndex(itemIndex, api)(editorView.state, editorView.dispatch);
		};

		useLayoutEffect(() => {
			if (mouseMovedRef.current) {
				mouseMovedRef.current = false;
			} else {
				lastInputMethodRef.current = 'keyboard';
			}
		}, [selectedIndex]);

		useLayoutEffect(() => {
			if (!listRef.current) {
				return;
			}
			const isViewMoreSelected = showMoreOptionsButton && selectedIndex === itemsLength;
			const isSelectedItemVisible =
				(selectedItemRowIndex >= lastVisibleStartIndex &&
					selectedItemRowIndex <= lastVisibleStopIndex) ||
				// view more is always visible, hence no scrolling
				isViewMoreSelected;

			//Should scroll to the list item only when the selectedIndex >= 0 and item is not visible
			if (!isSelectedItemVisible && selectedIndex !== -1) {
				listRef.current.scrollToRow(selectedItemRowIndex);
			} else if (selectedIndex === -1) {
				listRef.current.scrollToRow(0);
			}
		}, [
			selectedIndex,
			lastVisibleStartIndex,
			lastVisibleStopIndex,
			itemsLength,
			showMoreOptionsButton,
			selectedItemRowIndex,
		]);

		useLayoutEffect(() => {
			setCache(
				new CellMeasurerCache({
					fixedWidth: true,
					defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT,
				}),
			);
			// When query is updated, sometimes the scroll position of the menu is not at the top
			// Scrolling back to top for consistency
			requestAnimationFrame(() => {
				if (listContainerRef.current?.firstChild) {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					(listContainerRef.current.firstChild as HTMLElement).scrollTo(0, 0);
				}
			});
		}, [items, sections]);

		useLayoutEffect(() => {
			// Exclude view more item from the count
			const itemsToRender = expVal('platform_editor_agent_mentions', 'isEnabled', false)
				? listRows
				: showMoreOptionsButton
					? items.slice(0, -1)
					: items;
			const height = Math.min(
				// eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed)
				itemsToRender.reduce((prevValue, currentValue, index) => {
					return prevValue + cache.rowHeight({ index: index });
				}, 0),
				fitHeight,
			);
			setHeight(height);
		}, [listRows, items, cache, fitHeight, showMoreOptionsButton]);

		useLayoutEffect(() => {
			if (!listContainerRef.current) {
				return;
			}
			const { current: element } = listContainerRef;
			/**
			 * To handle the key events on the list
			 * @param event
			 * @example
			 */
			const handleKeyDown = (event: KeyboardEvent): void => {
				if (isNavigationKey(event)) {
					lastInputMethodRef.current = 'keyboard';
					switch (event.key) {
						case 'ArrowDown':
							selectNextItem();
							event.preventDefault();
							event.stopPropagation();
							break;

						case 'ArrowUp':
							selectPreviousItem();
							event.preventDefault();
							event.stopPropagation();
							break;

						case 'Tab':
							event.shiftKey ? selectPreviousItem() : selectNextItem();
							event.preventDefault();
							break;

						case 'Enter':
							//Enter key quick inserts the selected item.
							if (!event.isComposing || (event.which !== 229 && event.keyCode !== 229)) {
								onItemClick(
									event.shiftKey ? SelectItemMode.SHIFT_ENTER : SelectItemMode.ENTER,
									selectedIndex,
									INPUT_METHOD.KEYBOARD,
								);
								event.preventDefault();
							}
							break;

						default:
							event.preventDefault();
					}
				} else {
					//All the remaining keys sets focus on the typeahead query(inputQuery.tsx))
					focusTargetElement();
				}
			};
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element?.addEventListener('keydown', handleKeyDown);
			return () => {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				element?.removeEventListener('keydown', handleKeyDown);
			};
		}, [
			editorView.state,
			focusTargetElement,
			selectNextItem,
			selectPreviousItem,
			selectedIndex,
			onItemClick,
			itemsLength,
		]);

		const firstOnlineSupportedRow = useMemo(() => {
			return items.findIndex((item) => item.isDisabledOffline !== true);
		}, [items]);

		const config = triggerHandler?.getMoreOptionsButtonConfig?.(intl);
		const handleClick = () => {
			if (onMoreOptionsClicked) {
				onMoreOptionsClicked();
			}

			api?.core.actions.execute(({ tr }) => {
				closeTypeAhead(tr);
				config?.onClick({ tr });

				return tr;
			});
		};

		const renderRow: ListRowRenderer = ({ index, key, style, parent, isScrolling, isVisible }) => {
			const currentRow = listRows[index];

			if (!currentRow) {
				return null;
			}

			return (
				<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
					{({ measure }) => (
						<ListRow
							measure={measure}
							index={index}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							style={style}
							isVisible={isVisible}
							isScrolling={isScrolling}
							// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
							onMouseMove={(e) => onMouseMove(e, currentRow)}
						>
							{currentRow.type === 'section' ? (
								<Box paddingInline="space.150" paddingBlock="space.050">
									<Text as="span" size="small" color="color.text.subtle" weight="medium">
										{currentRow.section.title}
									</Text>
								</Box>
							) : (
								<TypeAheadListItem
									key={items[currentRow.itemIndex].title}
									item={items[currentRow.itemIndex]}
									firstOnlineSupportedIndex={firstOnlineSupportedRow}
									itemsLength={itemsLength}
									itemIndex={currentRow.itemIndex}
									selectedIndex={selectedIndex}
									// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
									onItemClick={(mode: SelectItemMode, itemIndex: number) => {
										actions.onItemClick(mode, itemIndex, INPUT_METHOD.MOUSE);
									}}
									ariaLabel={
										getTypeAheadListAriaLabels(
											triggerHandler?.trigger,
											intl,
											items[currentRow.itemIndex],
										).listItemAriaLabel
									}
									moreElementsInQuickInsertViewEnabled={moreElementsInQuickInsertViewEnabled}
									api={api}
									lastInputMethodRef={lastInputMethodRef}
								/>
							)}
						</ListRow>
					)}
				</CellMeasurer>
			);
		};

		const popupAriaLabel = getTypeAheadListAriaLabels(triggerHandler?.trigger, intl).popupAriaLabel;

		if (!Array.isArray(items)) {
			return null;
		}

		const menuGroupId =
			decorationElement
				.querySelector<HTMLInputElement>(`[role='combobox']`)
				?.getAttribute('aria-controls') || TYPE_AHEAD_DECORATION_ELEMENT_ID;

		const EmptyResultView = (
			<Box paddingBlock="space.150" paddingInline="space.250">
				<Text align="center" as="p">
					{intl.formatMessage(typeAheadListMessages.emptySearchResults)}
				</Text>
				<Text align="center" as="p">
					{intl.formatMessage(
						expValEquals('platform_editor_insert_menu_ai', 'isEnabled', true)
							? showMoreOptionsButton
								? typeAheadListMessages.emptySearchResultsSuggestionNew
								: typeAheadListMessages.emptySearchResultsSuggestionAskRovoOnly
							: typeAheadListMessages.emptySearchResultsSuggestion,
						{
							askRovoName: <Text weight="medium">{intl.formatMessage(messages.askRovo)}</Text>,
							buttonName: <Text weight="medium">{intl.formatMessage(messages.viewMore)}</Text>,
						},
					)}
				</Text>
			</Box>
		);

		const ListContent = (
			<List
				rowRenderer={renderRow}
				ref={listRef}
				// Skip rendering the view more button in the list
				rowCount={listRows.length}
				rowHeight={cache.rowHeight}
				onRowsRendered={onItemsRendered}
				width={LIST_WIDTH}
				onScroll={onScroll}
				height={height}
				overscanRowCount={3}
				aria-label={getTypeAheadListAriaLabels(undefined, intl).popupAriaLabel}
				containerRole="presentation"
				role="listbox"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
						button: {
							padding: `${token('space.150')} ${token('space.150')} 11px`,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
							'span:last-child span:last-child': {
								whiteSpace: 'normal',
							},
						},
					}),
					moreElementsInQuickInsertViewEnabled && list,
				]}
			/>
		);

		return (
			<MenuGroup aria-label={popupAriaLabel} aria-relevant="additions removals">
				<div id={menuGroupId} ref={listContainerRef}>
					{isEmptyStateActive && EmptyResultView}
					{isEmptyStateActive
						? ListContent
						: !showMoreOptionsButton || itemsLength
							? ListContent
							: EmptyResultView}
					{showMoreOptionsButton && config && (
						<MoreOptions
							title={config.title}
							ariaLabel={config.ariaLabel}
							onClick={handleClick}
							isFocused={selectedIndex === itemsLength}
							iconBefore={config.iconBefore}
							lastInputMethodRef={lastInputMethodRef}
						/>
					)}
					<TypeaheadAssistiveTextPureComponent numberOfResults={itemsLength.toString()} />
				</div>
			</MenuGroup>
		);
	},
);

// eslint-disable-next-line @typescript-eslint/ban-types
export const TypeAheadList: React.FC<
	WithIntlProps<
		{
			api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
			decorationElement: HTMLElement;
			editorView: EditorView;
			emptyItem?: TypeAheadItem;
			fitHeight: number;
			isEmptyQuery?: boolean;
			items: Array<TypeAheadItem>;
			moreElementsInQuickInsertViewEnabled?: boolean;
			onItemClick: (mode: SelectItemMode, index: number, inputMethod?: InputMethodType) => void;
			onMoreOptionsClicked?: () => void;
			sections?: Array<TypeAheadResolvedSection>;
			selectedIndex: number;
			showMoreOptionsButton?: boolean;
			triggerHandler?: TypeAheadHandler;
		} & WrappedComponentProps
	>
> & {
	WrappedComponent: React.ComponentType<
		{
			api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
			decorationElement: HTMLElement;
			editorView: EditorView;
			emptyItem?: TypeAheadItem;
			fitHeight: number;
			isEmptyQuery?: boolean;
			items: Array<TypeAheadItem>;
			moreElementsInQuickInsertViewEnabled?: boolean;
			onItemClick: (mode: SelectItemMode, index: number, inputMethod?: InputMethodType) => void;
			onMoreOptionsClicked?: () => void;
			sections?: Array<TypeAheadResolvedSection>;
			selectedIndex: number;
			showMoreOptionsButton?: boolean;
			triggerHandler?: TypeAheadHandler;
		} & WrappedComponentProps
	>;
} = injectIntl(TypeAheadListComponent);

TypeAheadList.displayName = 'TypeAheadList';
