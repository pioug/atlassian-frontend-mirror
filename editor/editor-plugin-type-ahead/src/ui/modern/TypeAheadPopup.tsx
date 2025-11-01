/* eslint-disable @atlaskit/ui-styling-standard/use-compiled */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';
import { useIntl } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { elementInsertSidePanel } from '@atlaskit/editor-common/messages';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
	ExtractInjectionAPI,
	TypeAheadItem,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import { findOverflowScrollParent, Popup } from '@atlaskit/editor-common/ui';
import { SideInsertPanel, QuickInsertPanel } from '@atlaskit/editor-element-browser';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import AddIcon from '@atlaskit/icon/core/add';
import { fg } from '@atlaskit/platform-feature-flags';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
	CloseSelectionOptions,
	TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE,
	TYPE_AHEAD_POPUP_CONTENT_CLASS,
} from '../../pm-plugins/constants';
import type { TypeAheadPlugin } from '../../typeAheadPluginType';
import type { TypeAheadErrorInfo } from '../../types';
import { TypeAheadErrorFallback } from '../TypeAheadErrorFallback';

const DEFAULT_TYPEAHEAD_MENU_HEIGHT = 520;
// const DEFAULT_TYPEAHEAD_MENU_HEIGHT_NEW = 480;

const ITEM_PADDING = 12;
const INSERT_PANEL_WIDTH = 320;

const typeAheadContent = css({
	background: token('elevation.surface.overlay', N0),
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 0 1px ${N60A}, 0 4px 8px -2px ${N50A}`),
	padding: `${token('space.050', '4px')} 0`,
	width: '280px',
	maxHeight: '520px' /* ~5.5 visibile items */,
	overflowY: 'auto',
	MsOverflowStyle: '-ms-autohiding-scrollbar',
	position: 'relative',
});
// const typeAheadContentOverride = css({
// 	maxHeight: `${DEFAULT_TYPEAHEAD_MENU_HEIGHT_NEW}px`,
// });

type TypeAheadPopupProps = {
	anchorElement: HTMLElement;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	cancel: (params: {
		addPrefixTrigger: boolean;
		forceFocusOnEditor: boolean;
		setSelectionAt: CloseSelectionOptions;
	}) => void;
	decorationSet: DecorationSet;
	editorView: EditorView;
	errorInfo: TypeAheadErrorInfo; // TODO: ED-26959 - shared type
	isEmptyQuery: boolean;
	items: Array<TypeAheadItem>;
	onItemInsert: (mode: SelectItemMode, index: number) => void;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	query: string;
	setSelectedItem?: (props: { index: number }) => void;
	triggerHandler: TypeAheadHandler;
};

const OFFSET = [0, 8];
export const TypeAheadPopup = React.memo((props: TypeAheadPopupProps) => {
	const {
		triggerHandler,
		anchorElement,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		items,
		errorInfo,
		onItemInsert,
		isEmptyQuery,
		cancel,
		api,
		query,
		setSelectedItem,
	} = props;

	const ref = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;

	const { formatMessage } = useIntl();

	const defaultMenuHeight = DEFAULT_TYPEAHEAD_MENU_HEIGHT;

	const startTime = useMemo(
		() => performance.now(),
		// In case those props changes
		// we need to recreate the startTime
		[items, isEmptyQuery, triggerHandler], // eslint-disable-line react-hooks/exhaustive-deps
	);
	useEffect(() => {
		if (!api?.analytics?.actions?.fireAnalyticsEvent) {
			return;
		}
		const stopTime = performance.now();
		const time = stopTime - startTime;

		api?.analytics?.actions?.fireAnalyticsEvent({
			action: ACTION.RENDERED,
			actionSubject: ACTION_SUBJECT.TYPEAHEAD,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				time,
				items: items.length,
				initial: isEmptyQuery,
			},
		});
	}, [
		startTime,
		items,
		isEmptyQuery,
		// In case the current triggerHandler changes
		// e.g: Inserting a mention using the quick insert
		// we need to send the event again
		// eslint-disable-next-line react-hooks/exhaustive-deps
		triggerHandler,
		api,
	]);

	// useEffect(() => {
	// 	if (!api?.analytics?.actions?.fireAnalyticsEvent) {
	// 		return;
	// 	}

	// 	api?.analytics?.actions?.fireAnalyticsEvent({
	// 		action: ACTION.VIEWED,
	// 		actionSubject: ACTION_SUBJECT.TYPEAHEAD_ITEM,
	// 		eventType: EVENT_TYPE.OPERATIONAL,
	// 		attributes: {
	// 			index: selectedIndex,
	// 			items: items.length,
	// 		},
	// 	});
	// }, [
	// 	items,
	// 	api,
	// 	selectedIndex,
	// 	// In case the current triggerHandler changes
	// 	// e.g: Inserting a mention using the quick insert
	// 	// we need to send the event again
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// 	triggerHandler,
	// ]);

	const [fitHeight, setFitHeight] = useState(defaultMenuHeight);

	const getFitHeight = useCallback(() => {
		if (!anchorElement || !popupsMountPoint) {
			return;
		}
		const target: HTMLElement = anchorElement;
		const { top: targetTop, height: targetHeight } = target.getBoundingClientRect();

		const boundariesElement: HTMLElement = popupsBoundariesElement || document.body;
		const { height: boundariesHeight, top: boundariesTop } =
			boundariesElement.getBoundingClientRect();

		// Calculating the space above and space below our decoration
		const spaceAbove = targetTop - (boundariesTop - boundariesElement.scrollTop);
		const spaceBelow = boundariesTop + boundariesHeight - (targetTop + targetHeight);

		// Keep default height if more than enough space
		if (spaceBelow >= defaultMenuHeight) {
			return setFitHeight(defaultMenuHeight);
		}

		// Determines whether typeahead will fit above or below decoration
		// and return the space available.
		const newFitHeight = spaceBelow >= spaceAbove ? spaceBelow : spaceAbove;

		// Each typeahead item has some padding
		// We want to leave some space at the top so first item
		// is not partially cropped
		const fitHeightWithSpace = newFitHeight - ITEM_PADDING * 2;

		// Ensure typeahead height is max its default height
		const minFitHeight = Math.min(defaultMenuHeight, fitHeightWithSpace);

		return setFitHeight(minFitHeight);
	}, [anchorElement, defaultMenuHeight, popupsBoundariesElement, popupsMountPoint]);

	const getFitHeightDebounced = rafSchedule(getFitHeight);

	useLayoutEffect(() => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const scrollableElement = popupsScrollableElement || findOverflowScrollParent(anchorElement!);
		getFitHeight();
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('resize', getFitHeightDebounced);
		if (scrollableElement) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			scrollableElement.addEventListener('scroll', getFitHeightDebounced);
		}

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.removeEventListener('resize', getFitHeightDebounced);
			if (scrollableElement) {
				// Ignored via go/ees005
				// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
				scrollableElement.removeEventListener('scroll', getFitHeightDebounced);
			}
		};
	}, [anchorElement, popupsScrollableElement, getFitHeightDebounced, getFitHeight]);

	useLayoutEffect(() => {
		const focusOut = (event: FocusEvent) => {
			const { relatedTarget } = event;

			// Given the user is changing the focus
			// When the target is inside the TypeAhead Popup
			// Then the popup should stay open
			if (
				relatedTarget instanceof HTMLElement &&
				relatedTarget.closest &&
				(relatedTarget.closest(`.${TYPE_AHEAD_POPUP_CONTENT_CLASS}`) ||
					relatedTarget.closest(`[data-type-ahead="${TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE}"]`))
			) {
				return;
			}

			// Handles cases like emoji and @ typeaheads that open new typeaheads
			const isTextSelected = window.getSelection()?.type === 'Range';

			if (fg('platform_editor_legacy_content_macro_typeahead_fix')) {
				const innerEditor = anchorElement.closest('.extension-editable-area');

				if (innerEditor) {
					// When there is no related target, we default to not closing the popup
					let newFocusInsideCurrentEditor = !relatedTarget;
					if (relatedTarget instanceof HTMLElement) {
						// check if the new focus is inside inner editor, keep popup opens
						newFocusInsideCurrentEditor = innerEditor.contains(relatedTarget);
					}
					if (!isTextSelected && newFocusInsideCurrentEditor) {
						return;
					}
				} else {
					// if the current focus in outer editor, keep the existing behaviour, do not close the pop up if text is not selected
					if (!isTextSelected) {
						return;
					}
				}
			} else {
				if (!isTextSelected) {
					return;
				}
			}

			cancel({
				addPrefixTrigger: true,
				setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
				forceFocusOnEditor: false,
			});
		};
		const { current: element } = ref;
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element?.addEventListener('focusout', focusOut);
		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element?.removeEventListener('focusout', focusOut);
		};
	}, [ref, cancel, anchorElement]);

	// TODO: ED-17443 - When you press escape on typeahead panel, it should remove focus and close the panel
	// This is the expected keyboard behaviour advised by the Accessibility team
	useLayoutEffect(() => {
		const escape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				cancel({
					addPrefixTrigger: true,
					setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
					forceFocusOnEditor: true,
				});
			}
		};

		const { current: element } = ref;
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element?.addEventListener('keydown', escape);

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element?.removeEventListener('keydown', escape);
		};
	}, [ref, cancel]);

	const handleViewAllItemsClick = useCallback(() => {
		const showContextPanel = api?.contextPanel?.actions?.showPanel;
		if (!showContextPanel || !items) {
			return;
		}

		// Opens main editor controls side panel
		showContextPanel(
			{
				id: 'editor-element-insert-sidebar-panel',
				headerComponentElements: {
					headerLabel: elementInsertSidePanel.title,
					HeaderIcon: () => <AddIcon label={formatMessage(elementInsertSidePanel.title)} />,
				},
				BodyComponent: () => {
					return <SideInsertPanel items={items} onItemInsert={onItemInsert} />;
				},
			},
			'push',
			INSERT_PANEL_WIDTH,
		);

		// Closes typeahead
		cancel({
			addPrefixTrigger: true,
			setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
			forceFocusOnEditor: true,
		});
	}, [api, cancel, formatMessage, items, onItemInsert]);

	return (
		<Popup
			zIndex={akEditorFloatingDialogZIndex}
			target={anchorElement}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			fitHeight={fitHeight}
			fitWidth={280}
			offset={OFFSET}
			ariaLabel={null}
			preventOverflow={true}
		>
			<div
				css={[typeAheadContent]}
				tabIndex={fg('platform_editor_a11y_fix_typeahead_tabindex') ? undefined : 0}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={TYPE_AHEAD_POPUP_CONTENT_CLASS}
				ref={ref}
			>
				{errorInfo ? (
					<TypeAheadErrorFallback />
				) : (
					<React.Fragment>
						<QuickInsertPanel
							items={items}
							onItemInsert={onItemInsert}
							query={query}
							setSelectedItem={setSelectedItem}
							onViewAllItemsClick={Boolean(api?.contextPanel) ? handleViewAllItemsClick : undefined}
						/>
					</React.Fragment>
				)}
			</div>
		</Popup>
	);
});

TypeAheadPopup.displayName = 'TypeAheadPopup';
