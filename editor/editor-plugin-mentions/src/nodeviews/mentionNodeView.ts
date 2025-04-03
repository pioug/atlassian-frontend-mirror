import { browser } from '@atlaskit/editor-common/browser';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { DOMSerializer, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider } from '@atlaskit/mention';
import {
	isResolvingMentionProvider,
	type MentionNameDetails,
	MentionNameStatus,
} from '@atlaskit/mention/resource';
import { isRestricted } from '@atlaskit/mention/types';

import type { MentionsPlugin } from '../mentionsPluginType';
import { type MentionPluginOptions } from '../types';

import { profileCardRenderer } from './profileCardRenderer';

const primitiveClassName = 'editor-mention-primitive';

const toDOM = (node: PMNode): DOMOutputSpec => {
	// packages/elements/mention/src/components/Mention/index.tsx
	const mentionAttrs = {
		contenteditable: 'false',
		'data-access-level': node.attrs.accessLevel,
		'data-mention-id': node.attrs.id,
		'data-prosemirror-content-type': 'node',
		'data-prosemirror-node-inline': 'true',
		'data-prosemirror-node-name': 'mention',
		'data-prosemirror-node-view-type': 'vanilla',
		class: 'mentionView-content-wrap inlineNodeView',
	};

	return [
		'span',
		mentionAttrs,
		[
			'span',
			{ class: 'zeroWidthSpaceContainer' },
			['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
		],
		[
			'span',
			{
				spellcheck: 'false',
				class: primitiveClassName,
			},
			node.attrs.text || '@…',
		],
		browser.android
			? [
					'span',
					{ class: 'zeroWidthSpaceContainer', contenteditable: 'false' },
					['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
				]
			: ['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
	];
};

interface MentionNodeViewProps {
	options?: MentionPluginOptions;
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	portalProviderAPI: PortalProviderAPI;
}
const processName = (name: MentionNameDetails): string => {
	return name.status === MentionNameStatus.OK ? `@${name.name || ''}` : `@_|unknown|_`;
};

const handleProviderName = async (
	mentionProvider: MentionProvider | undefined,
	node: PMNode,
): Promise<string | undefined> => {
	if (isResolvingMentionProvider(mentionProvider) && node.attrs.id && !node.attrs.text) {
		const nameDetail = mentionProvider?.resolveMentionName(node.attrs.id);
		const resolvedNameDetail = await nameDetail;
		return processName(resolvedNameDetail);
	}
};

type MentionState = 'self' | 'default' | 'restricted';

const getNewState = (isHighlighted: boolean, isRestricted: boolean): MentionState => {
	if (isHighlighted) {
		return 'self';
	}
	if (isRestricted) {
		return 'restricted';
	}
	return 'default';
};

class MentionNodeView implements NodeView {
	private state: MentionState = 'default';
	dom: Node;
	contentDOM: HTMLElement | undefined;
	private config: MentionNodeViewProps;
	private node: PMNode;
	private cleanup: (() => void) | undefined;
	private destroyProfileCard: (() => void) | undefined;
	private removeProfileCard: (() => void) | undefined;

	constructor(node: PMNode, config: MentionNodeViewProps) {
		const { options, api, portalProviderAPI } = config;
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
		this.dom = dom;
		this.contentDOM = contentDOM;
		this.config = config;
		this.node = node;

		const { mentionProvider } = api?.mention.sharedState.currentState() ?? {};
		this.updateState(mentionProvider);

		this.cleanup = api?.mention.sharedState.onChange(({ nextSharedState }) => {
			this.updateState(nextSharedState?.mentionProvider);
		});

		const { destroyProfileCard, removeProfileCard } = profileCardRenderer({
			dom,
			options,
			portalProviderAPI,
			node,
			api,
		});
		this.destroyProfileCard = destroyProfileCard;
		this.removeProfileCard = removeProfileCard;
	}

	private setClassList(state: MentionState): void {
		const mentionElement = this.getMentionPrimitive();
		mentionElement?.classList.toggle('mention-self', state === 'self');
		mentionElement?.classList.toggle('mention-restricted', state === 'restricted');
	}

	private getMentionPrimitive() {
		return this.dom instanceof HTMLElement
			? this.dom.querySelector(`.${primitiveClassName}`) ?? undefined
			: undefined;
	}

	private setTextContent(name: string | undefined) {
		if (!(this.dom instanceof HTMLElement)) {
			return;
		}
		const mentionPrimitive = this.getMentionPrimitive();
		if (
			mentionPrimitive &&
			name &&
			!this.node.attrs.text &&
			this.config.options?.sanitizePrivateContent
		) {
			mentionPrimitive.textContent = name;
		}
	}

	private async updateState(mentionProvider: MentionProvider | undefined) {
		const isHighlighted =
			mentionProvider?.shouldHighlightMention({ id: this.node.attrs.id }) ?? false;
		const newState = getNewState(isHighlighted, isRestricted(this.node.attrs.accessLevel));
		if (newState !== this.state) {
			this.setClassList(newState);
			this.state = newState;
		}
		const name = await handleProviderName(mentionProvider, this.node);
		this.setTextContent(name);
	}

	destroy() {
		this.cleanup?.();
		this.destroyProfileCard?.();
	}

	deselectNode() {
		this.removeProfileCard?.();
	}
}

export const mentionNodeView =
	(config: MentionNodeViewProps): NodeViewConstructor =>
	(node) => {
		return new MentionNodeView(node, config);
	};
