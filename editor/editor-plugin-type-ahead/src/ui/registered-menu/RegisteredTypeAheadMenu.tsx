import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import {
	buildQuickInsertMenuModel,
	getMatchingQuickInsertComponents,
	selectQuickInsertCategoryItems,
} from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import {
	TYPE_AHEAD_SURFACE_CONTEXT,
	type TypeAheadSurfaceContext,
} from '@atlaskit/editor-common/type-ahead-surface-context';
import type { ExtractInjectionAPI, TypeAheadHandler } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles/constants';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { Box } from '@atlaskit/primitives/compiled';
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
		borderRadius: token('radius.small'),
		boxSizing: 'border-box',
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		paddingBlock: token('space.050'),
		width: '320px',
	},
});
const DEFAULT_MENU_MAX_HEIGHT = 480;
const MENU_VERTICAL_PADDING = 8;
const MENU_WIDTH = 320;
const POPUP_OFFSET = [0, 8];
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
	const components = useMemo(
		() => api?.uiControlRegistry?.actions.getComponents(surface.root.key) ?? [],
		[api, surface.root.key],
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
	const rows = useMemo(() => menuModel.sections.flat(), [menuModel.sections]);
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
		setSelectedItemIndex(selectableItemCount > 0 ? 0 : -1);
	}, [query, selectableItemCount, selectableRowKeys]);

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
	const selectNextItem = useCallback(() => {
		setSelectedItemIndex((currentIndex) => {
			if (selectableItemCount === 0) {
				return -1;
			}

			return currentIndex < 0 || currentIndex === selectableItemCount - 1 ? 0 : currentIndex + 1;
		});
	}, [selectableItemCount]);
	const selectPreviousItem = useCallback(() => {
		setSelectedItemIndex((currentIndex) => {
			if (selectableItemCount === 0) {
				return -1;
			}

			return currentIndex <= 0 ? selectableItemCount - 1 : currentIndex - 1;
		});
	}, [selectableItemCount]);
	const typeAheadContextValue = useMemo(
		() => ({
			api,
			editorView,
			inputMethod: surface.inputMethod,
			menuOpenId: typeAheadSurfaceContext.menuOpenId,
			onClose,
			query,
			surfaceContext,
			triggerHandler,
		}),
		[
			api,
			editorView,
			onClose,
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
		<>
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
				fitHeight={maxHeight}
				fitWidth={MENU_WIDTH}
				mountTo={popupsMountPoint}
				offset={POPUP_OFFSET}
				preventOverflow={true}
				scrollableElement={popupsScrollableElement}
				target={anchorElement}
				zIndex={akEditorFloatingDialogZIndex}
			>
				<Box
					ref={menuRef}
					data-registered-type-ahead-menu=""
					testId="registered-type-ahead-menu"
					xcss={styles.menu}
				>
					<TypeAheadProvider value={typeAheadContextValue}>
						<SurfaceProvider>
							<TypeAheadMenuRenderer
								Item={surface.Item}
								listLabel={surface.listLabel}
								listId={listId}
								maxHeight={Math.max(0, maxHeight - MENU_VERTICAL_PADDING)}
								model={menuModel}
								onItemHover={setSelectedItemIndex}
								selectedItemIndex={selectedItemIndex}
							/>
						</SurfaceProvider>
					</TypeAheadProvider>
				</Box>
			</Popup>
		</>
	);
};
