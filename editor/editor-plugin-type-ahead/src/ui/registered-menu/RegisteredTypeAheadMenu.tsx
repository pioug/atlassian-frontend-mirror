/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import Popup from '@atlaskit/editor-common/Popup';
import type {
	RegisteredMenuInteraction,
	RegisteredMenuContextValue,
	RegisteredMenuSelection,
} from '@atlaskit/editor-common/registered-menu';
import { RegisteredMenuContext } from '@atlaskit/editor-common/registered-menu/context';
import { useMenuPopupSizing } from '@atlaskit/editor-common/registered-menu/popup-sizing';
import { createRegisteredMenuSurfaceContext } from '@atlaskit/editor-common/registered-menu/surface-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types/type-ahead';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles/constants';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
import { token } from '@atlaskit/tokens';

import { performTypeAheadSelection } from '../../pm-plugins/commands/insert-type-ahead-item';
import type { CloseSelectionOptions } from '../../pm-plugins/constants';
import type { TypeAheadPlugin } from '../../typeAheadPluginType';
import { InputQuery } from '../InputQuery';

const DEFAULT_MENU_MAX_HEIGHT = 480;
const POPUP_OFFSET: [number, number] = [0, 8];
const styles = cssMap({
	popup: {
		backgroundColor: token('elevation.surface.overlay'),
		appearance: 'none',
		border: 'none',
		boxSizing: 'border-box',
		paddingBlockStart: 0,
		paddingBlockEnd: 0,
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		width: '320px',
	},
});

const EMPTY_COMPONENTS: RegisterComponent[] = [];
const subscribeToNothing = () => () => {};
const noOp = () => {};
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
	registeredMenuKey: string;
	reopenQuery?: string;
	setQuery: (query: string) => void;
	triggerHandler: TypeAheadHandler;
};

export const RegisteredTypeAheadMenu = (props: Props): React.JSX.Element => {
	const { api, registeredMenuKey, query, editorView, onClose, triggerHandler, popupsMountPoint } =
		props;
	const rootComponent = useMemo(
		() => ({ key: registeredMenuKey, type: 'menu' as const }),
		[registeredMenuKey],
	);
	const [menuInteraction, setMenuInteraction] = useState<RegisteredMenuInteraction>();
	const registerInteraction = useCallback((interaction: RegisteredMenuInteraction) => {
		setMenuInteraction(interaction);
		return () => setMenuInteraction((current) => (current === interaction ? undefined : current));
	}, []);
	const maxHeight = useMenuPopupSizing({
		target: props.anchorElement,
		boundariesElement: props.popupsBoundariesElement,
		scrollableElement: props.popupsScrollableElement,
		maxHeight: props.maxHeight ?? DEFAULT_MENU_MAX_HEIGHT,
		offset: POPUP_OFFSET[1],
	});
	const cancelMenu = useCallback(
		(params: Parameters<Props['cancel']>[0]) => {
			menuInteraction?.onClose?.();
			props.cancel(params);
		},
		[menuInteraction, props.cancel],
	);
	const [menuOpenId] = useState(() => Symbol('type-ahead-menu-open'));
	const surfaceContext = useMemo(
		() => createRegisteredMenuSurfaceContext({ menuOpenId, surface: 'typeahead' }),
		[menuOpenId],
	);
	const getComponents = useCallback(() => {
		const components = api?.uiControlRegistry?.actions.getComponents(rootComponent.key);
		return components?.length ? components : EMPTY_COMPONENTS;
	}, [api, rootComponent.key]);
	const components = useSyncExternalStore(
		api?.uiControlRegistry?.actions.subscribe ?? subscribeToNothing,
		getComponents,
		getComponents,
	);
	const root = useMemo(
		() =>
			components.find(
				({ key, type, parents }) =>
					key === rootComponent.key && type === rootComponent.type && !parents?.length,
			),
		[components, rootComponent],
	);
	const Root = root?.isHidden?.({ surfaceContext }) ? undefined : root?.component;
	// Interaction updates should not recreate the registered component's own props.
	const menu = useMemo(() => Root && <Root>{null}</Root>, [Root]);
	const { isOffline } = useSharedPluginStateWithSelector(
		api,
		['connectivity'],
		({ connectivityState }) => ({
			isOffline: isOfflineMode(connectivityState?.mode),
		}),
	);
	const select = useCallback(
		(selectItem: RegisteredMenuSelection) => {
			onClose();
			queueMicrotask(() =>
				performTypeAheadSelection(editorView)({ handler: triggerHandler, query, selectItem }),
			);
		},
		[editorView, onClose, query, triggerHandler],
	);
	const registeredMenu = useMemo<RegisteredMenuContextValue>(
		() => ({
			components,
			onClose,
			maxHeight,
			registerInteraction,
			editorView,
			getItemRank: triggerHandler.getRegisteredItemRank,
			isOffline,
			menuOpenId,
			portalMountPoint: popupsMountPoint,
			rootComponent,
			query,
			select,
			surfaceContext,
		}),
		[
			onClose,
			maxHeight,
			registerInteraction,
			components,
			editorView,
			triggerHandler.getRegisteredItemRank,
			isOffline,
			menuOpenId,
			popupsMountPoint,
			rootComponent,
			query,
			select,
			surfaceContext,
		],
	);
	return (
		<RegisteredMenuContext.Provider value={registeredMenu}>
			<InputQuery
				menuInteraction={menuInteraction}
				cancel={cancelMenu}
				editorView={editorView}
				forceFocus={props.forceFocus}
				onItemSelect={noOp}
				onQueryChange={props.setQuery}
				onQueryFocus={noOp}
				onUndoRedo={props.onUndoRedo}
				optionCount={0}
				reopenQuery={props.reopenQuery}
				selectNextItem={noOp}
				selectPreviousItem={noOp}
				shouldKeepOpenOnRegisteredMenu={true}
				triggerQueryPrefix={triggerHandler.trigger}
			/>
			{Root && (
				<Popup
					zIndex={akEditorFloatingDialogZIndex}
					target={props.anchorElement}
					mountTo={popupsMountPoint}
					boundariesElement={props.popupsBoundariesElement}
					scrollableElement={props.popupsScrollableElement}
					fitHeight={maxHeight}
					fitWidth={320}
					offset={POPUP_OFFSET}
					ariaLabel={null}
					preventOverflow
				>
					<div
						// Legacy host integrations also use this popup selector.
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Preserve the typeahead popup selector.
						className="fabric-editor-typeahead"
						data-registered-type-ahead-menu=""
						data-testid="registered-type-ahead-menu"
						hidden={!menuInteraction}
						css={styles.popup}
					>
						{menu}
					</div>
				</Popup>
			)}
		</RegisteredMenuContext.Provider>
	);
};
