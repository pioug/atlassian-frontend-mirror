/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	useCallback,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from 'react';

import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import Popup from '@atlaskit/editor-common/Popup';
import {
	buildQuickInsertMenuModel,
	getMatchingQuickInsertComponents,
	getQuickInsertMenuRows,
	selectQuickInsertCategoryItems,
} from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import { useMenuPopupSizing } from '@atlaskit/editor-common/quick-insert/use-menu-popup-sizing';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import {
	TYPE_AHEAD_SURFACE_CONTEXT,
	type TypeAheadSurfaceContext,
} from '@atlaskit/editor-common/type-ahead-surface-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types/type-ahead';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles/constants';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';

import type { CloseSelectionOptions } from '../../pm-plugins/constants';
import type { TypeAheadPlugin } from '../../typeAheadPluginType';
import { InputQuery } from '../InputQuery';
import { getTypeAheadGlobalViewMoreId } from './getTypeAheadGlobalViewMoreId';
import { getTypeAheadItemId } from './getTypeAheadItemId';
import { TypeAheadMenuRenderer } from './TypeAheadMenuRenderer';
import { TypeAheadProvider } from './TypeAheadProvider';
import type { TypeAheadSurface } from './typeAheadSurfaces';

const styles = cssMap({
	menu: {
		backgroundColor: token('elevation.surface.overlay'),
		appearance: 'none',
		border: 'none',
		borderRadius: token('radius.large'),
		boxSizing: 'border-box',
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		// Update MENU_VERTICAL_PADDING when changing these vertical paddings.
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.075'),
		width: '320px',
	},
});
const DEFAULT_MENU_MAX_HEIGHT = 480;
const MENU_VERTICAL_PADDING = 14;
const MENU_WIDTH = 320;
const POPUP_OFFSET = [0, 8];
const EMPTY_COMPONENTS: RegisterComponent[] = [];
const subscribeToNothing = () => () => {};
type Props = {
	anchorElement: HTMLElement;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	cancel: (params: {
		addPrefixTrigger: boolean;
		forceFocusOnEditor: boolean;
		setSelectionAt: CloseSelectionOptions;
		text: string;
	}) => void;
	editorView: EditorView;
	forceFocus: boolean;
	maxHeight?: number;
	onClose: () => void;
	onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	query: string;
	reopenQuery?: string;
	setQuery: (query: string) => void;
	surface: TypeAheadSurface;
	triggerHandler: TypeAheadHandler;
};

export const RegisteredTypeAheadMenu = ({
	anchorElement,
	api,
	cancel,
	editorView,
	forceFocus,
	maxHeight = DEFAULT_MENU_MAX_HEIGHT,
	onClose,
	onUndoRedo,
	popupsBoundariesElement,
	popupsMountPoint,
	popupsScrollableElement,
	query,
	reopenQuery,
	setQuery,
	surface,
	triggerHandler,
}: Props): React.JSX.Element => {
	const menuHeight = useMenuPopupSizing({
		target: anchorElement,
		boundariesElement: popupsBoundariesElement,
		scrollableElement: popupsScrollableElement,
		maxHeight,
		offset: POPUP_OFFSET[1],
	});
	const { formatMessage } = useIntl();
	const generatedId = useId();
	const listId = `${surface.listIdPrefix}-${generatedId}`;
	const menuRef = useRef<HTMLDivElement>(null);
	const [typeAheadSurfaceContext] = useState<TypeAheadSurfaceContext>(() => ({
		menuOpenId: Symbol('type-ahead-menu-open'),
	}));
	const surfaceContext = useMemo(
		() => createSurfaceContext(TYPE_AHEAD_SURFACE_CONTEXT, typeAheadSurfaceContext),
		[typeAheadSurfaceContext],
	);
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const selectedItemIndexRef = useRef(selectedItemIndex);
	const getComponents = useCallback(() => {
		const components = api?.uiControlRegistry?.actions.getComponents(surface.root.key);
		return components?.length ? components : EMPTY_COMPONENTS;
	}, [api, surface.root.key]);
	const components = useSyncExternalStore(
		api?.uiControlRegistry?.actions.subscribe ?? subscribeToNothing,
		getComponents,
		getComponents,
	);
	const isSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');
	const hasSectionOverflowItems = useMemo(
		() => components.some(({ key }) => isSectionOverflowItemKey(key)),
		[components],
	);
	const menuModel = useMemo(
		() =>
			query === ''
				? buildQuickInsertMenuModel(
						components,
						surface.root,
						hasSectionOverflowItems && isSlashCommandEnabled
							? selectQuickInsertCategoryItems
							: undefined,
						surfaceContext,
					)
				: getMatchingQuickInsertComponents({
						components,
						rootComponent: surface.root,
						query,
						formatMessage,
						surfaceContext,
					}),
		[
			components,
			formatMessage,
			hasSectionOverflowItems,
			isSlashCommandEnabled,
			query,
			surfaceContext,
			surface.root,
		],
	);
	const rows = useMemo(() => getQuickInsertMenuRows(menuModel), [menuModel]);
	const [previewActivation, setPreviewActivation] = useState<
		| {
				itemKey: string;
				menuModel: typeof menuModel;
				source: 'keyboard' | 'pointer';
		  }
		| undefined
	>();
	const activePreviewItemKey =
		previewActivation?.menuModel === menuModel ? previewActivation.itemKey : undefined;
	const selectableRowIndexes = useMemo(
		() =>
			rows.flatMap((registration, rowIndex) =>
				registration.type === 'menu-item' ? [rowIndex] : [],
			),
		[rows],
	);
	const selectableRowKeys = selectableRowIndexes.map((index) => rows[index]?.key).join(',');
	const selectableItemCount = selectableRowIndexes.length + (menuModel.footer ? 1 : 0);
	useLayoutEffect(() => {
		const initialItemIndex = selectableItemCount > 0 ? 0 : -1;
		selectedItemIndexRef.current = initialItemIndex;
		setSelectedItemIndex(initialItemIndex);
	}, [query, selectableItemCount, selectableRowKeys]);
	useLayoutEffect(() => {
		setPreviewActivation(undefined);
	}, [menuModel, query]);

	const selectActiveItem = useCallback(
		(_mode: SelectItemMode) => {
			const rowIndex = selectableRowIndexes[selectedItemIndex];
			const selectedId =
				rowIndex !== undefined
					? getTypeAheadItemId(listId, rowIndex)
					: menuModel.footer && selectedItemIndex === selectableRowIndexes.length
						? getTypeAheadGlobalViewMoreId(listId)
						: undefined;

			if (selectedId) {
				menuRef.current?.ownerDocument.getElementById(selectedId)?.click();
			}
		},
		[listId, menuModel.footer, selectableRowIndexes, selectedItemIndex],
	);
	const setKeyboardPreview = useCallback(
		(itemIndex: number) => {
			const rowIndex = selectableRowIndexes[itemIndex];
			const registration = rowIndex === undefined ? undefined : rows[rowIndex];

			setPreviewActivation(
				registration?.type === 'menu-item'
					? { itemKey: registration.key, menuModel, source: 'keyboard' }
					: undefined,
			);
		},
		[menuModel, rows, selectableRowIndexes],
	);
	const selectNextItem = useCallback(() => {
		const currentIndex = selectedItemIndexRef.current;
		const nextIndex =
			selectableItemCount === 0
				? -1
				: currentIndex < 0 || currentIndex === selectableItemCount - 1
					? 0
					: currentIndex + 1;
		selectedItemIndexRef.current = nextIndex;
		setSelectedItemIndex(nextIndex);
		setKeyboardPreview(nextIndex);
	}, [selectableItemCount, setKeyboardPreview]);
	const selectPreviousItem = useCallback(() => {
		const currentIndex = selectedItemIndexRef.current;
		const previousIndex =
			selectableItemCount === 0
				? -1
				: currentIndex <= 0
					? selectableItemCount - 1
					: currentIndex - 1;
		selectedItemIndexRef.current = previousIndex;
		setSelectedItemIndex(previousIndex);
		setKeyboardPreview(previousIndex);
	}, [selectableItemCount, setKeyboardPreview]);
	const onItemHover = useCallback(
		(itemIndex: number, itemKey?: string) => {
			selectedItemIndexRef.current = itemIndex;
			setSelectedItemIndex(itemIndex);
			setPreviewActivation((current) => {
				if (
					current?.itemKey === itemKey &&
					current?.menuModel === menuModel &&
					current?.source === 'pointer'
				) {
					return current;
				}

				return itemKey ? { itemKey, menuModel, source: 'pointer' } : undefined;
			});
		},
		[menuModel],
	);
	const onItemLeave = useCallback((itemKey: string) => {
		setPreviewActivation((current) =>
			current?.source === 'pointer' && current.itemKey === itemKey ? undefined : current,
		);
	}, []);
	const onItemVisibilityChange = useCallback((itemKey: string, isVisible: boolean) => {
		if (!isVisible) {
			setPreviewActivation((current) =>
				current?.source === 'pointer' && current.itemKey === itemKey ? undefined : current,
			);
		}
	}, []);
	const typeAheadContextValue = useMemo(
		() => ({
			activePreviewItemKey,
			api,
			editorView,
			inputMethod: surface.inputMethod,
			menuOpenId: typeAheadSurfaceContext.menuOpenId,
			onClose,
			popupsMountPoint,
			query,
			surfaceContext,
			triggerHandler,
		}),
		[
			activePreviewItemKey,
			api,
			editorView,
			onClose,
			popupsMountPoint,
			query,
			surface.inputMethod,
			surfaceContext,
			triggerHandler,
			typeAheadSurfaceContext,
		],
	);
	const noOp = useCallback(() => {}, []);
	const SurfaceProvider = surface.Provider;

	return (
		<React.Fragment>
			<InputQuery
				activeDescendantId={
					selectableRowIndexes[selectedItemIndex] !== undefined
						? getTypeAheadItemId(listId, selectableRowIndexes[selectedItemIndex])
						: menuModel.footer && selectedItemIndex === selectableRowIndexes.length
							? getTypeAheadGlobalViewMoreId(listId)
							: undefined
				}
				cancel={cancel}
				editorView={editorView}
				forceFocus={forceFocus}
				listId={listId}
				onItemSelect={selectActiveItem}
				onQueryChange={setQuery}
				onQueryFocus={noOp}
				onUndoRedo={onUndoRedo}
				optionCount={selectableItemCount}
				reopenQuery={reopenQuery}
				selectNextItem={selectNextItem}
				selectPreviousItem={selectPreviousItem}
				shouldKeepOpenOnRegisteredMenu={true}
				triggerQueryPrefix={triggerHandler.trigger}
			/>
			<Popup
				ariaLabel={null}
				boundariesElement={popupsBoundariesElement}
				fitHeight={menuHeight}
				fitWidth={MENU_WIDTH}
				mountTo={popupsMountPoint}
				offset={POPUP_OFFSET}
				preventOverflow={true}
				scrollableElement={popupsScrollableElement}
				target={anchorElement}
				zIndex={akEditorFloatingDialogZIndex}
			>
				<div
					ref={menuRef}
					css={styles.menu}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Parent overlays use this class to restore pointer interaction.
					className="fabric-editor-typeahead"
					data-registered-type-ahead-menu=""
					data-testid="registered-type-ahead-menu"
				>
					<TypeAheadProvider value={typeAheadContextValue}>
						<SurfaceProvider>
							<TypeAheadMenuRenderer
								Item={surface.Item}
								listLabel={surface.listLabel}
								listId={listId}
								maxHeight={Math.max(0, menuHeight - MENU_VERTICAL_PADDING)}
								model={menuModel}
								onItemHover={onItemHover}
								onItemLeave={onItemLeave}
								onItemVisibilityChange={onItemVisibilityChange}
								selectedItemIndex={selectedItemIndex}
							/>
						</SurfaceProvider>
					</TypeAheadProvider>
				</div>
			</Popup>
		</React.Fragment>
	);
};
