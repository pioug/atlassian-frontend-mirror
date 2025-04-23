/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl, useIntl } from 'react-intl-next';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { ListRowRenderer } from 'react-virtualized/dist/commonjs/List';
import { List } from 'react-virtualized/dist/commonjs/List';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SelectItemMode, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import { type ExtractInjectionAPI, type TypeAheadItem } from '@atlaskit/editor-common/types';
import { AssistiveText } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { MenuGroup } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text, Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { InputMethodType } from '../pm-plugins/analytics';
import { updateSelectedIndex } from '../pm-plugins/commands/update-selected-index';
import { TYPE_AHEAD_DECORATION_ELEMENT_ID } from '../pm-plugins/constants';
import { getTypeAheadListAriaLabels, moveSelectedIndex } from '../pm-plugins/utils';
import { type TypeAheadPlugin } from '../typeAheadPluginType';
import type { TypeAheadHandler } from '../types';

import { ListRow } from './ListRow';
import { TypeAheadListItem } from './TypeAheadListItem';
import { ViewMore } from './ViewMore';

const LIST_ITEM_ESTIMATED_HEIGHT = 64;
const LIST_WIDTH = 320;

const list = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: { padding: `${token('space.100', '8px')} ${token('space.150', '12px')}` },
});

type TypeAheadListProps = {
	items: Array<TypeAheadItem>;
	selectedIndex: number;
	editorView: EditorView;
	onItemClick: (mode: SelectItemMode, index: number, inputMethod?: InputMethodType) => void;
	fitHeight: number;
	decorationElement: HTMLElement;
	triggerHandler?: TypeAheadHandler;
	moreElementsInQuickInsertViewEnabled?: boolean;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	showViewMore?: boolean;
	onViewMoreClick?: () => void;
} & WrappedComponentProps;

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
		selectedIndex,
		editorView,
		onItemClick,
		intl,
		fitHeight,
		decorationElement,
		triggerHandler,
		moreElementsInQuickInsertViewEnabled,
		api,
		showViewMore,
		onViewMoreClick,
	}: TypeAheadListProps) => {
		const listRef = useRef<List>() as React.MutableRefObject<List>;
		const listContainerRef = useRef<HTMLDivElement>(null);
		const lastVisibleIndexes = useRef({
			overscanStartIndex: 0,
			overscanStopIndex: 0,
			startIndex: 0,
			stopIndex: 0,
		});

		// Exclude view more item from the count
		const itemsLength = showViewMore ? items.length - 1 : items.length;

		const estimatedHeight = itemsLength * LIST_ITEM_ESTIMATED_HEIGHT;

		const [height, setHeight] = useState(Math.min(estimatedHeight, fitHeight));

		const [cache, setCache] = useState(
			new CellMeasurerCache({
				fixedWidth: true,
				defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT,
			}),
		);

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
			return ['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key);
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
						const isViewMoreSelected = showViewMore && selectedIndex === itemsLength;
						const isSelectedItemVisible =
							(selectedIndex >= lastVisibleStartIndex && selectedIndex <= lastVisibleStopIndex) ||
							// view more is always visible, hence no scrolling
							isViewMoreSelected;

						//Should scroll to the list item only when the selectedIndex >= 0 and item is not visible
						if (!isSelectedItemVisible && selectedIndex !== -1) {
							listRef.current.scrollToRow(selectedIndex);
						} else if (selectedIndex === -1) {
							listRef.current.scrollToRow(0);
						}
					});
				});
			},
			[selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex, itemsLength, showViewMore],
		);

		const onMouseMove = (event: React.MouseEvent, index: number) => {
			event.preventDefault();
			event.stopPropagation();
			if (selectedIndex === index) {
				return;
			}
			updateSelectedIndex(index, api)(editorView.state, editorView.dispatch);
		};

		useLayoutEffect(() => {
			if (!listRef.current) {
				return;
			}
			const isViewMoreSelected = showViewMore && selectedIndex === itemsLength;
			const isSelectedItemVisible =
				(selectedIndex >= lastVisibleStartIndex && selectedIndex <= lastVisibleStopIndex) ||
				// view more is always visible, hence no scrolling
				isViewMoreSelected;

			//Should scroll to the list item only when the selectedIndex >= 0 and item is not visible
			if (!isSelectedItemVisible && selectedIndex !== -1) {
				listRef.current.scrollToRow(selectedIndex);
			} else if (selectedIndex === -1) {
				listRef.current.scrollToRow(0);
			}
		}, [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex, itemsLength, showViewMore]);

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
		}, [items]);

		useLayoutEffect(() => {
			// Exclude view more item from the count
			const itemsToRender = showViewMore ? items.slice(0, -1) : items;
			const height = Math.min(
				itemsToRender.reduce((prevValue, currentValue, index) => {
					return prevValue + cache.rowHeight({ index: index });
				}, 0),
				fitHeight,
			);
			setHeight(height);
		}, [items, cache, fitHeight, showViewMore]);

		useLayoutEffect(() => {
			if (!listContainerRef.current) {
				return;
			}
			const { current: element } = listContainerRef;
			/**
			 * To handle the key events on the list
			 * @param event
			 */
			const handleKeyDown = (event: KeyboardEvent): void => {
				if (isNavigationKey(event)) {
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

						// TODO: DTR-1401 - why is this calling item click when hitting tab? fix this in DTR-1401
						case 'Tab':
							//Tab key quick inserts the selected item.
							onItemClick(SelectItemMode.TAB, selectedIndex, INPUT_METHOD.KEYBOARD);
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

		const renderRow: ListRowRenderer = ({ index, key, style, parent, isScrolling, isVisible }) => {
			const currentItem = items[index];
			return (
				<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
					{fg('platform_editor_typeahead_dynamic_height_fix') ? (
						({ measure, registerChild }) => (
							<ListRow
								registerChild={registerChild}
								measure={measure}
								index={index}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={style}
								isVisible={isVisible}
								isScrolling={isScrolling}
								onMouseMove={(e) => onMouseMove(e, index)}
							>
								<TypeAheadListItem
									key={items[index].title}
									item={currentItem}
									firstOnlineSupportedIndex={firstOnlineSupportedRow}
									itemsLength={itemsLength}
									itemIndex={index}
									selectedIndex={selectedIndex}
									onItemClick={(mode: SelectItemMode, index: number) => {
										actions.onItemClick(mode, index, INPUT_METHOD.MOUSE);
									}}
									ariaLabel={
										getTypeAheadListAriaLabels(triggerHandler?.trigger, intl, currentItem)
											.listItemAriaLabel
									}
									moreElementsInQuickInsertViewEnabled={moreElementsInQuickInsertViewEnabled}
									api={api}
								/>
							</ListRow>
						)
					) : (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={style}
							data-index={index}
						>
							{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
							<div
								data-testid={`list-item-height-observed-${index}`}
								onMouseMove={(e) => onMouseMove(e, index)}
							>
								<TypeAheadListItem
									key={items[index].title}
									item={currentItem}
									firstOnlineSupportedIndex={firstOnlineSupportedRow}
									itemsLength={itemsLength}
									itemIndex={index}
									selectedIndex={selectedIndex}
									onItemClick={(mode: SelectItemMode, index: number) => {
										actions.onItemClick(mode, index, INPUT_METHOD.MOUSE);
									}}
									ariaLabel={
										getTypeAheadListAriaLabels(triggerHandler?.trigger, intl, currentItem)
											.listItemAriaLabel
									}
									moreElementsInQuickInsertViewEnabled={moreElementsInQuickInsertViewEnabled}
									api={api}
								/>
							</div>
						</div>
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
					{intl.formatMessage(typeAheadListMessages.emptySearchResultsSuggestion, {
						buttonName: <Text weight="medium">{intl.formatMessage(messages.viewMore)}</Text>,
					})}
				</Text>
			</Box>
		);

		const ListContent = (
			<List
				rowRenderer={renderRow}
				ref={listRef}
				// Skip rendering the view more button in the list
				rowCount={itemsLength}
				rowHeight={cache.rowHeight}
				onRowsRendered={onItemsRendered}
				width={LIST_WIDTH}
				onScroll={onScroll}
				height={height}
				overscanRowCount={3}
				// We need to make this walkaround to make TS happy, cannot pass undefined otherwise ReactVirualized will make it equal to "grid" which we want to avoid
				// https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.js#L260
				aria-label={null as unknown as string}
				containerRole="presentation"
				role="listbox"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
						button: {
							padding: `${token('space.150', '12px')} ${token('space.150', '12px')} 11px`,
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
					{!showViewMore || itemsLength ? ListContent : EmptyResultView}
					{showViewMore && onViewMoreClick && (
						<ViewMore onClick={onViewMoreClick} isFocused={selectedIndex === itemsLength} />
					)}
					<TypeaheadAssistiveTextPureComponent numberOfResults={itemsLength.toString()} />
				</div>
			</MenuGroup>
		);
	},
);

export const TypeAheadList = injectIntl(TypeAheadListComponent);

TypeAheadList.displayName = 'TypeAheadList';
