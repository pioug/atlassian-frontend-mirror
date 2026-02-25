import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { DOMSerializer, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider } from '@atlaskit/mention';
import {
	isResolvingMentionProvider,
	type MentionNameDetails,
	MentionNameStatus,
} from '@atlaskit/mention/resource';
import { isRestricted } from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { MentionsPlugin } from '../mentionsPluginType';
import { type MentionPluginOptions } from '../types';

import { profileCardRenderer } from './profileCardRenderer';

const primitiveClassName = 'editor-mention-primitive';

type HTMLAttributes = Partial<
	Omit<Record<Lowercase<keyof React.AllHTMLAttributes<HTMLElement>>, string>, 'classname'>
> & {
	[key: `data-${string}`]: string;
} & { class: string };

// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
const getAccessibilityLabelFromName = (name: string) => name.replace(/^@/u, '');

const toDOM = (node: PMNode): DOMOutputSpec => {
	// packages/elements/mention/src/components/Mention/index.tsx
	let mentionAttrs: HTMLAttributes = {
		contenteditable: 'false',
		'data-access-level': node.attrs.accessLevel,
		'data-mention-id': node.attrs.id,
		'data-prosemirror-content-type': 'node',
		'data-prosemirror-node-inline': 'true',
		'data-prosemirror-node-name': 'mention',
		'data-prosemirror-node-view-type': 'vanilla',
		class: 'mentionView-content-wrap inlineNodeView',
	};

	if (fg('platform_editor_adf_with_localid')) {
		mentionAttrs = { ...mentionAttrs, 'data-local-id': node.attrs.localId };
	}

	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;

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
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	options?: MentionPluginOptions;
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

export class MentionNodeView implements NodeView {
	private state: MentionState = 'default';
	dom: Node;
	domElement: HTMLElement | undefined;
	contentDOM: HTMLElement | undefined;
	private config: MentionNodeViewProps;
	private node: PMNode;
	private cleanup: (() => void) | undefined;
	private destroyProfileCard: (() => void) | undefined;
	private removeProfileCard: (() => void) | undefined;
	private mentionPrimitiveElement: HTMLElement | undefined;

	constructor(node: PMNode, config: MentionNodeViewProps) {
		const { options, api, portalProviderAPI } = config;
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
		this.dom = dom;
		this.contentDOM = contentDOM;
		this.config = config;
		this.node = node;
		this.domElement = dom instanceof HTMLElement ? dom : undefined;
		this.mentionPrimitiveElement = this.domElement
			? (this.domElement.querySelector<HTMLElement>(`.${primitiveClassName}`) ?? undefined)
			: undefined;

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
		// Accessibility attributes - based on `packages/people-and-teams/profilecard/src/components/User/ProfileCardTrigger.tsx`
		if (this.domElement && options?.profilecardProvider) {
			if (node.attrs.text) {
				this.domElement.setAttribute('aria-label', getAccessibilityLabelFromName(node.attrs.text));
			}
			this.domElement.setAttribute('aria-expanded', 'false');
			this.domElement.setAttribute('role', 'button');
			this.domElement.setAttribute('tabindex', '0');
			this.domElement.setAttribute('aria-haspopup', 'dialog');
		}
		this.destroyProfileCard = destroyProfileCard;
		this.removeProfileCard = removeProfileCard;
	}

	private setClassList(state: MentionState): void {
		this.mentionPrimitiveElement?.classList.toggle('mention-self', state === 'self');
		this.mentionPrimitiveElement?.classList.toggle('mention-restricted', state === 'restricted');
	}

	private setTextContent(name: string | undefined) {
		if (name && !this.node.attrs.text && this.mentionPrimitiveElement) {
			this.mentionPrimitiveElement.textContent = name;
		}
	}

	private shouldHighlightMention(mentionProvider: MentionProvider | undefined): boolean {
		const { currentUserId } = this.config.options ?? {};
		// Check options first (immediate), then provider (async), then default to false
		if (currentUserId && this.node.attrs.id === currentUserId) {
			return true;
		} else {
			return mentionProvider?.shouldHighlightMention({ id: this.node.attrs.id }) ?? false;
		}
	}

	private async updateState(mentionProvider: MentionProvider | undefined) {
		const isHighlighted = expValEquals(
			'platform_editor_vc90_transition_fixes_batch_1',
			'isEnabled',
			true,
		)
			? this.shouldHighlightMention(mentionProvider)
			: (mentionProvider?.shouldHighlightMention({ id: this.node.attrs.id }) ?? false);

		const newState = getNewState(isHighlighted, isRestricted(this.node.attrs.accessLevel));
		if (newState !== this.state) {
			this.setClassList(newState);
			this.state = newState;
		}
		const name = await handleProviderName(mentionProvider, this.node);
		this.setTextContent(name);
		if (name && this.domElement && this.config.options?.profilecardProvider) {
			this.domElement.setAttribute('aria-label', getAccessibilityLabelFromName(name));
		}
	}

	private nodeIsEqual(nextNode: PMNode) {
		if (this.config.options?.sanitizePrivateContent) {
			// Compare nodes but ignore the text parameter as it may be sanitized
			const nextNodeAttrs = { ...nextNode.attrs, text: this.node.attrs.text };
			return this.node.hasMarkup(nextNode.type, nextNodeAttrs, nextNode.marks);
		}
		return this.node.sameMarkup(nextNode);
	}

	update(node: PMNode): boolean {
		if (!this.nodeIsEqual(node)) {
			return false;
		}

		this.node = node;
		return true;
	}

	destroy(): void {
		this.cleanup?.();
		this.destroyProfileCard?.();
	}

	deselectNode(): void {
		this.removeProfileCard?.();
	}
}
