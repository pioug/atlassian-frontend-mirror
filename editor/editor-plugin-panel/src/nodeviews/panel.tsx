import React from 'react';

import ReactDOM from 'react-dom';

import type { PanelAttributes } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';
import { Emoji } from '@atlaskit/editor-common/emoji';
import {
	PanelErrorIcon,
	PanelInfoIcon,
	PanelNoteIcon,
	PanelSuccessIcon,
	PanelWarningIcon,
} from '@atlaskit/editor-common/icons';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { getPosHandler, getPosHandlerNode } from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';

import type { PanelPluginOptions } from '../types';
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
}

export const PanelIcon = (props: PanelIconAttributes) => {
	const {
		allowCustomPanel,
		providerFactory,
		panelAttributes: { panelType, panelIcon, panelIconId, panelIconText },
	} = props;

	if (allowCustomPanel && panelIcon && panelType === PanelType.CUSTOM) {
		return (
			<Emoji
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
	pluginOptions: PanelPluginOptions;

	constructor(
		node: Node,
		view: EditorView,
		getPos: getPosHandlerNode,
		pluginOptions: PanelPluginOptions,
		providerFactory?: ProviderFactory,
	) {
		this.providerFactory = providerFactory;
		this.pluginOptions = pluginOptions;
		this.view = view;
		this.node = node;

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
		ReactDOM.render(
			<PanelIcon
				allowCustomPanel={pluginOptions.allowCustomPanel}
				panelAttributes={node.attrs as PanelAttributes}
				providerFactory={this.providerFactory}
			/>,
			this.icon,
		);
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
}

export const getPanelNodeView =
	(pluginOptions: PanelPluginOptions, providerFactory?: ProviderFactory) =>
	(node: Node, view: EditorView, getPos: getPosHandler): PanelNodeView => {
		return new PanelNodeView(
			node,
			view,
			getPos as getPosHandlerNode,
			pluginOptions,
			providerFactory,
		);
	};
