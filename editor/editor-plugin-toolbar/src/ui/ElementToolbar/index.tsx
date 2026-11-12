import React, { memo, useMemo, useRef } from 'react';

import { useIntl } from 'react-intl';

import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import messages from '@atlaskit/editor-common/floating-toolbar/messages';
import { isSSR } from '@atlaskit/editor-common/is-ssr';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { UserIntent } from '@atlaskit/editor-plugin-user-intent/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { ToolbarButtonGroup } from '@atlaskit/editor-toolbar/toolbar-button-group';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';
import { ToolbarSection } from '@atlaskit/editor-toolbar/toolbar-section';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { SurfaceFallbacks } from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import type { ToolbarPlugin } from '../../toolbarPluginType';
import { getKeyboardNavigationConfig } from '../SelectionToolbar/keyboard-config';
import { ToolbarProviders } from '../ToolbarProviders';
import { ElementToolbarContext } from './element-toolbar-context';
import { ELEMENT_TOOLBAR_TEST_ID } from './ElementToolbarPopup';
import { getActiveElementToolbar } from './get-active-element-toolbar';
import type { ElementToolbarRegistry } from './get-active-element-toolbar';

const ELEMENT_TOOLBAR_SELECTOR = `[data-testid='${ELEMENT_TOOLBAR_TEST_ID}']`;

const FALLBACKS: SurfaceFallbacks = {
	section: ToolbarSection,
	'menu-section': ToolbarDropdownItemSection,
	group: ToolbarButtonGroup,
};

/**
 * User intents that keep element toolbars visible. Any other intent, including a new one, hides them.
 */
const VISIBLE_USER_INTENTS: UserIntent[] = [
	'default',
	'dragHandleSelected',
	'popupOpen',
	'layoutColumnMenuPopupOpen',
	'aiStreaming',
	'viewingDiff',
];

type ElementToolbarProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	boundariesElement?: HTMLElement;
	editorView: EditorView;
	mountPoint?: HTMLElement;
	scrollableElement?: HTMLElement;
};

type ContentProps = {
	components: RegisterComponent[];
	surfaceKey: string;
};

// Re-renders only when the toolbar or its components change. The root component (usually
// ElementToolbarPopup) reads the node from ElementToolbarContext, so edits inside the node
// reposition the popup without re-rendering items. Each item subscribes to the state it needs.
const ElementToolbarContent = memo(({ components, surfaceKey }: ContentProps) => {
	const surface = useMemo(() => ({ type: 'toolbar' as const, key: surfaceKey }), [surfaceKey]);
	return <SurfaceRenderer surface={surface} components={components} fallbacks={FALLBACKS} />;
});

/**
 * Renders the element toolbar for the selected node or its deepest ancestor. Element toolbars are
 * `uiControlRegistry` toolbar surfaces keyed by node type name, e.g. `{ type: 'toolbar', key: 'table' }`.
 */
export const ElementToolbar = ({
	api,
	editorView,
	mountPoint,
	boundariesElement,
	scrollableElement,
}: ElementToolbarProps): React.JSX.Element | null => {
	const intl = useIntl();
	const editorViewRef = useRef(editorView);
	editorViewRef.current = editorView;

	const registry = useMemo<ElementToolbarRegistry>(
		() => ({
			getComponent: (component) => api?.uiControlRegistry?.actions.getComponent(component),
			getComponents: (key) =>
				api?.uiControlRegistry?.actions.getComponents({ type: 'toolbar', key }) ?? [],
		}),
		[api],
	);

	// The selector returns primitives and cached surface arrays only, so the host re-renders when
	// the active toolbar, its node or the document changes - not on every plugin state update. The
	// document is included so the popup repositions when the element changes size. The selector is
	// read once by the hook, so it must only use refs and stable values.
	const { surfaceKey, components, nodePos, doc, isOffline } = useSharedPluginStateWithSelector(
		api,
		['toolbar', 'selection', 'userIntent', 'editorViewMode', 'editorDisabled', 'connectivity'],
		(states) => {
			const view = editorViewRef.current;
			const userIntent = states.userIntentState?.currentUserIntent;
			const isHidden =
				isSSR() ||
				states.editorViewModeState?.mode === 'view' ||
				Boolean(states.editorDisabledState?.editorDisabled) ||
				Boolean(userIntent && !VISIBLE_USER_INTENTS.includes(userIntent));
			const active = isHidden ? undefined : getActiveElementToolbar(view.state, registry);

			return {
				surfaceKey: active?.key,
				components: active?.components,
				nodePos: active?.pos,
				doc: active ? view.state.doc : undefined,
				isOffline: isOfflineMode(states.connectivityState?.mode),
			};
		},
	);

	const keyboardNavigation = useMemo(
		() =>
			getKeyboardNavigationConfig(editorView, intl, api, {
				toolbarSelector: ELEMENT_TOOLBAR_SELECTOR,
				ariaLabel: intl.formatMessage(messages.floatingToolbarAriaLabel),
			}),
		[editorView, intl, api],
	);

	const node = nodePos !== undefined && doc ? doc.nodeAt(nodePos) : undefined;
	const elementToolbar = useMemo(
		() => (node && nodePos !== undefined ? { node, nodePos } : undefined),
		[node, nodePos],
	);

	if (!surfaceKey || !components || !elementToolbar) {
		return null;
	}

	return (
		<ToolbarProviders
			api={api}
			editorView={editorView}
			editorViewMode="edit"
			isOffline={isOffline}
			keyboardNavigation={keyboardNavigation}
			popupsMountPoint={mountPoint}
			popupsBoundariesElement={boundariesElement}
			popupsScrollableElement={scrollableElement}
		>
			<ElementToolbarContext.Provider value={elementToolbar}>
				<ElementToolbarContent surfaceKey={surfaceKey} components={components} />
			</ElementToolbarContext.Provider>
		</ToolbarProviders>
	);
};
