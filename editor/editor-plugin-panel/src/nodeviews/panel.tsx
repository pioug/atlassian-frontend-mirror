import React from 'react';

import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';

import type { PanelAttributes } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';
import { Emoji } from '@atlaskit/editor-common/emoji';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
	PanelErrorIcon,
	PanelInfoIcon,
	PanelNoteIcon,
	PanelSuccessIcon,
	PanelWarningIcon,
} from '@atlaskit/editor-common/icons';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	ExtractInjectionAPI,
	getPosHandler,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { fg } from '@atlaskit/platform-feature-flags';

import type { PanelPlugin, PanelPluginOptions } from '../types';
import { panelAttrsToDom } from '../utils';

export const panelIcons: {
	[key in PanelType]: React.ComponentType<{ label: string }>;
} = {
	info: PanelInfoIcon,
	success: PanelSuccessIcon,
	note: PanelNoteIcon,
	tip: TipIcon,
	warning: PanelWarningIcon,
	error: PanelErrorIcon,
	custom: PanelInfoIcon,
};

interface PanelIconAttributes {
	panelAttributes: PanelAttributes;
	providerFactory?: ProviderFactory;
	allowCustomPanel?: boolean;
	pluginInjectionApi: ExtractInjectionAPI<PanelPlugin> | undefined;
}

const useEmojiProvider = (pluginInjectionApi: ExtractInjectionAPI<PanelPlugin> | undefined) => {
	const { emojiState } = useSharedPluginState(pluginInjectionApi, ['emoji']);
	return emojiState?.emojiProvider;
};

export const PanelIcon = (props: PanelIconAttributes) => {
	const {
		allowCustomPanel,
		providerFactory,
		pluginInjectionApi,
		panelAttributes: { panelType, panelIcon, panelIconId, panelIconText },
	} = props;
	const emojiProvider = useEmojiProvider(pluginInjectionApi);

	if (allowCustomPanel && panelIcon && panelType === PanelType.CUSTOM) {
		return (
			<Emoji
				emojiProvider={emojiProvider}
				providers={providerFactory}
				shortName={panelIcon}
				id={panelIconId}
				fallback={panelIconText}
				showTooltip={false}
				allowTextFallback={false}
				fitToHeight={akEditorCustomIconSize}
			/>
		);
	}

	const Icon = panelIcons[panelType];
	return <Icon label={`Panel ${panelType}`} />;
};

class PanelNodeView {
	node: Node;
	dom: HTMLElement;
	contentDOM: HTMLElement;
	icon: HTMLElement;
	getPos: getPosHandlerNode;
	view: EditorView;
	providerFactory?: ProviderFactory;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	pluginOptions: PanelPluginOptions;
	key: string;

	constructor(
		node: Node,
		view: EditorView,
		getPos: getPosHandlerNode,
		pluginOptions: PanelPluginOptions,
		api: ExtractInjectionAPI<PanelPlugin> | undefined,
		nodeViewPortalProviderAPI: PortalProviderAPI,
		providerFactory?: ProviderFactory,
	) {
		this.nodeViewPortalProviderAPI = nodeViewPortalProviderAPI;
		this.providerFactory = providerFactory;
		this.pluginOptions = pluginOptions;
		this.view = view;
		this.node = node;
		this.key = uuid();

		const { dom, contentDOM } = DOMSerializer.renderSpec(
			document,
			panelAttrsToDom(node.attrs as PanelAttributes, pluginOptions.allowCustomPanel || false),
		);
		this.getPos = getPos;
		this.dom = dom as HTMLElement;
		this.contentDOM = contentDOM as HTMLElement;
		this.icon = this.dom.querySelector(`.${PanelSharedCssClassName.icon}`) as HTMLElement;

		if (!this.icon) {
			return;
		}
		// set contentEditable as false to be able to select the custom panels with keyboard
		this.icon.contentEditable = 'false';
		if (fg('platform_editor_react18_plugin_portalprovider')) {
			this.nodeViewPortalProviderAPI.render(
				() => (
					<PanelIcon
						pluginInjectionApi={api}
						allowCustomPanel={pluginOptions.allowCustomPanel}
						panelAttributes={node.attrs as PanelAttributes}
						providerFactory={this.providerFactory}
					/>
				),
				this.icon,
				this.key,
			);
		} else {
			ReactDOM.render(
				<PanelIcon
					pluginInjectionApi={api}
					allowCustomPanel={pluginOptions.allowCustomPanel}
					panelAttributes={node.attrs as PanelAttributes}
					providerFactory={this.providerFactory}
				/>,
				this.icon,
			);
		}
	}

	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
		// ignore mutation if it caused by the icon.
		if (!this.icon) {
			return false;
		}
		const isIcon = mutation.target === this.icon || mutation.target.parentNode === this.icon;
		// ignore mutation if it caused by the lazy load emoji inside icon.
		const isInsideIcon = this.icon.contains(mutation.target);
		return isIcon || isInsideIcon;
	}

	destroy() {
		if (fg('platform_editor_react18_plugin_portalprovider')) {
			this.nodeViewPortalProviderAPI.remove(this.key);
		}
	}
}

export const getPanelNodeView =
	(
		pluginOptions: PanelPluginOptions,
		api: ExtractInjectionAPI<PanelPlugin> | undefined,
		portalProviderAPI: PortalProviderAPI,
		providerFactory?: ProviderFactory,
	) =>
	(node: Node, view: EditorView, getPos: getPosHandler): PanelNodeView => {
		return new PanelNodeView(
			node,
			view,
			getPos as getPosHandlerNode,
			pluginOptions,
			api,
			portalProviderAPI,
			providerFactory,
		);
	};
