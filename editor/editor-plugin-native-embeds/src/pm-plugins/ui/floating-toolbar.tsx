import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarHandler,
} from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AlignTextCenterIcon from '@atlaskit/icon/core/align-text-center';
import BorderIcon from '@atlaskit/icon/core/border';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PageIcon from '@atlaskit/icon/core/page';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import type {
	EditorPluginNativeEmbedsPlugin,
	EditorPluginNativeEmbedsToolbarHandlers,
} from '../../nativeEmbedsPluginType';
import { getSelectedNativeEmbedExtension } from '../utils/getSelectedNativeEmbedExtension';

const createHandlerCommand =
	(handler?: () => void): Command =>
	() => {
		handler?.();
		return true;
	};

interface GetToolbarConfigProps {
	api?: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin>;
	handlers?: EditorPluginNativeEmbedsToolbarHandlers;
}

export const getToolbarConfig =
	({ api: _api, handlers }: GetToolbarConfigProps): FloatingToolbarHandler =>
	(state, _intl, _providerFactory, _activeConfigs) => {
		const selectedNativeEmbed = getSelectedNativeEmbedExtension(state);
		if (!selectedNativeEmbed) {
			return undefined;
		}

		const getDomRef = (view: EditorView) => {
			try {
				const node = findDomRefAtPos(selectedNativeEmbed.pos, view.domAtPos.bind(view));
				return node instanceof HTMLElement ? node : undefined;
			} catch {
				return undefined;
			}
		};

		return {
			title: 'Native Embed floating toolbar',
			getDomRef,
			nodeType: state.schema.nodes.extension,
			items: [
				{
					id: 'native-embed-refresh-button',
					type: 'button',
					title: 'Refresh',
					showTitle: true,
					icon: RefreshIcon,
					onClick: createHandlerCommand(handlers?.onRefreshClick),
					focusEditoronEnter: true,
					tabIndex: null,
				},
				{
					type: 'separator',
				},
				{
					id: 'native-embed-embed-dropdown',
					type: 'dropdown',
					title: 'Embed',
					iconBefore: PageIcon,
					options: [],
					onClick: handlers?.onEmbedClick,
				},
				{
					id: 'native-embed-change-border-dropdown',
					type: 'dropdown',
					title: '',
					iconBefore: BorderIcon,
					options: [],
					onClick: handlers?.onChangeBorderClick,
				},
				{
					id: 'native-embed-alignment-dropdown',
					type: 'dropdown',
					title: '',
					iconBefore: AlignTextCenterIcon,
					options: [],
					onClick: handlers?.onAlignmentClick,
				},
				{
					type: 'separator',
				},
				{
					id: 'native-embed-open-new-window-button',
					type: 'button',
					title: 'Open in new window',
					icon: LinkExternalIcon,
					iconFallback: LinkExternalIcon,
					onClick: createHandlerCommand(handlers?.onOpenInNewWindowClick),
					focusEditoronEnter: true,
					tabIndex: null,
				},
				{
					type: 'separator',
				},
				{
					id: 'native-embed-more-options-button',
					type: 'dropdown',
					title: 'More options',
					icon: ShowMoreHorizontalIcon,
					hideExpandIcon: true,
					options: [],
					onClick: handlers?.onMoreOptionsClick,
				},
			],
		};
	};
