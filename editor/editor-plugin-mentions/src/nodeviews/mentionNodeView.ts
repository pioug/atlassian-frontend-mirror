import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';
import type { MentionProvider } from '@atlaskit/mention';
import { isResolvingMentionProvider, MentionNameStatus } from '@atlaskit/mention/resource';
import type { MentionNameDetails } from '@atlaskit/mention/resource';
import type { MentionDisabledState, MentionDisabledStateInput } from '@atlaskit/mention/types';
import { isRestricted } from '@atlaskit/mention/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { MentionsPlugin } from '../mentionsPluginType';
import type { MentionPluginOptions } from '../types';

import { disabledTooltipRenderer } from './disabledTooltipRenderer';
import { profileCardRenderer } from './profileCardRenderer';

const primitiveClassName = 'editor-mention-primitive';

type HTMLAttributes = Partial<
	Omit<Record<Lowercase<keyof React.AllHTMLAttributes<HTMLElement>>, string>, 'classname'>
> & {
	[key: `data-${string}`]: string;
} & { class: string };

// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
const AT_PREFIX_REGEX = /^@/u;

const getAccessibilityLabelFromName = (name: string) => name.replace(AT_PREFIX_REGEX, '');

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

	if (expVal('platform_editor_agent_mentions', 'isEnabled', false) && node.attrs.userType) {
		mentionAttrs = { ...mentionAttrs, 'data-user-type': node.attrs.userType };
	}

	const browser = getBrowserInfo();

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

type MentionState = 'self' | 'default' | 'restricted' | 'disabled';

const getNewState = (
	isHighlighted: boolean,
	isRestricted: boolean,
	isDisabled: boolean,
): MentionState => {
	if (isDisabled) {
		return 'disabled';
	}
	if (isHighlighted) {
		return 'self';
	}
	if (isRestricted) {
		return 'restricted';
	}
	return 'default';
};

export class MentionNodeView implements NodeView {
	dom: Node;
	domElement: HTMLElement | undefined;
	contentDOM: HTMLElement | undefined;
	private config: MentionNodeViewProps;
	private node: PMNode;
	private cleanup: (() => void) | undefined;
	private destroyProfileCard: (() => void) | undefined;
	private removeProfileCard: (() => void) | undefined;
	private mentionPrimitiveElement: HTMLElement | undefined;
	private disabledTooltip:
		| {
				destroy: () => void;
				setTooltip: (text: string | undefined) => void;
		  }
		| undefined;
	private unsubscribeFromDisabledStateChanges: (() => void) | undefined;
	private subscribedProvider: MentionProvider | undefined;

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
		this.subscribeToProviderDisabledStateChanges(mentionProvider);

		this.cleanup = api?.mention.sharedState.onChange(({ nextSharedState }) => {
			this.updateState(nextSharedState?.mentionProvider);
			this.subscribeToProviderDisabledStateChanges(nextSharedState?.mentionProvider);
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

	private setClassList(state: MentionState, disabledTooltip: string | undefined): void {
		this.mentionPrimitiveElement?.classList.toggle('mention-self', state === 'self');
		this.mentionPrimitiveElement?.classList.toggle('mention-restricted', state === 'restricted');
		this.mentionPrimitiveElement?.classList.toggle('mention-disabled', state === 'disabled');
		// Mirror the React `<Mention>` a11y behaviour: when the chip is
		// disabled, expose `aria-disabled` so assistive tech announces it as
		// such. Also surface the tooltip text via `aria-label` so screen-reader
		// users hear *why* the chip is disabled, matching the React `<Mention>`
		// behaviour at `Mention/index.tsx` line 152.
		if (this.domElement) {
			if (state === 'disabled') {
				this.domElement.setAttribute('aria-disabled', 'true');
				if (disabledTooltip) {
					const text = this.node.attrs.text || '@...';
					this.domElement.setAttribute('aria-label', `${text} — ${disabledTooltip}`);
				}
			} else {
				this.domElement.removeAttribute('aria-disabled');
				this.domElement.removeAttribute('aria-label');
			}
		}
	}

	private getDisabledState(
		mentionProvider: MentionProvider | undefined,
	): MentionDisabledState | undefined {
		const input: MentionDisabledStateInput = {
			id: this.node.attrs.id,
			userType: this.node.attrs.userType,
		};
		return mentionProvider?.getMentionDisabledState?.(input);
	}

	/**
	 * Subscribes this NodeView to disabled-state-change notifications on the
	 * supplied provider so already-rendered chips can re-evaluate themselves
	 * when the consumer's predicate inputs change (e.g. the active agent
	 * selection toggling in Rovo Chat). No-op for providers that don't
	 * implement `subscribeToDisabledStateChanges`.
	 *
	 * Idempotent: re-calling with the same provider keeps the existing
	 * subscription; passing a different provider tears the old subscription
	 * down before attaching the new one. Safe to call from the sharedState
	 * `onChange` handler when the editor swaps providers.
	 */
	private subscribeToProviderDisabledStateChanges(
		mentionProvider: MentionProvider | undefined,
	): void {
		if (this.subscribedProvider === mentionProvider) {
			return;
		}
		this.unsubscribeFromDisabledStateChanges?.();
		this.unsubscribeFromDisabledStateChanges = undefined;
		this.subscribedProvider = mentionProvider;
		if (!mentionProvider?.subscribeToDisabledStateChanges) {
			return;
		}
		this.unsubscribeFromDisabledStateChanges = mentionProvider.subscribeToDisabledStateChanges(
			() => {
				this.updateState(this.subscribedProvider);
			},
		);
	}

	private syncDisabledTooltip(disabledState: MentionDisabledState | undefined): void {
		// Capture the tooltip text into a local so the rest of the method can
		// branch on a truthy string instead of re-asserting non-null fields
		// off of `disabledState`.
		const tooltipText: string | undefined = disabledState?.disabled
			? disabledState.tooltip
			: undefined;
		const chip = this.mentionPrimitiveElement;
		const { portalProviderAPI } = this.config;
		if (!chip || !portalProviderAPI) {
			return;
		}
		if (tooltipText) {
			if (!this.disabledTooltip) {
				this.disabledTooltip = disabledTooltipRenderer({
					chipElement: chip,
					portalProviderAPI,
				});
			}
			this.disabledTooltip.setTooltip(tooltipText);
		} else if (this.disabledTooltip) {
			this.disabledTooltip.destroy();
			this.disabledTooltip = undefined;
		}
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
			'platform_editor_vc90_transition_mentions',
			'isEnabled',
			true,
		)
			? this.shouldHighlightMention(mentionProvider)
			: (mentionProvider?.shouldHighlightMention({ id: this.node.attrs.id }) ?? false);

		const disabledState = this.getDisabledState(mentionProvider);
		const isDisabled = !!disabledState?.disabled;

		const newState = getNewState(
			isHighlighted,
			isRestricted(this.node.attrs.accessLevel),
			isDisabled,
		);
		const disabledTooltip = disabledState?.disabled ? disabledState.tooltip : undefined;
		// `setClassList` always runs so the aria-label (which depends on the
		// tooltip text) stays in sync when the tooltip reason changes while
		// the chip remains disabled. State-change-only writes would leave a
		// stale aria-label after a tooltip-text-only update.
		this.setClassList(newState, disabledTooltip);
		// Tooltip wiring runs every update (not just on state change) so that
		// the tooltip text stays in sync if the disabled reason changes while
		// the chip is already disabled.
		this.syncDisabledTooltip(disabledState);

		const name = await handleProviderName(mentionProvider, this.node);
		this.setTextContent(name);
		// Only overwrite the disabled-state aria-label with the name-based one
		// when the chip is NOT disabled; otherwise the disabled reason set in
		// `setClassList` would be silently clobbered, regressing a11y.
		if (
			name &&
			this.domElement &&
			this.config.options?.profilecardProvider &&
			newState !== 'disabled'
		) {
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
		// Surface the destruction to the provider before tearing down so the
		// chat layer can react (e.g. drop the agent id from `selectedAgentIds`).
		// This is the lowest-level deletion signal — fires for backspace,
		// select-and-delete, programmatic doc replaces, and editor unmount.
		try {
			this.subscribedProvider?.notifyMentionDestroyed?.({ id: this.node.attrs.id });
		} catch (_error) {
			// Defensive: never let consumer-side notification errors prevent
			// the NodeView from cleaning up its own resources below.
		}
		this.cleanup?.();
		this.destroyProfileCard?.();
		this.disabledTooltip?.destroy();
		this.disabledTooltip = undefined;
		this.unsubscribeFromDisabledStateChanges?.();
		this.unsubscribeFromDisabledStateChanges = undefined;
		this.subscribedProvider = undefined;
	}

	deselectNode(): void {
		this.removeProfileCard?.();
	}
}
