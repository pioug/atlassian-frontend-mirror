import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type {
	MentionNodeDataIdentifier,
	MentionNodeDataProvider,
} from '@atlaskit/editor-common/mention';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	VANILLA_TOOLTIP_DEFAULT_CLASS,
	VanillaTooltip,
} from '@atlaskit/editor-common/vanilla-tooltip';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
// oxlint-disable-next-line import/no-duplicates
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { UNKNOWN_USER_ID } from '@atlaskit/mention/constants';
import { isResolvingMentionProvider } from '@atlaskit/mention/is-resolving-mention-provider';
import { isRestricted } from '@atlaskit/mention/is-restricted';
import {
	type MentionDisabledState,
	type MentionDisabledStateInput,
	type MentionProvider,
	MentionNameStatus,
	type MentionNameDetails,
} from '@atlaskit/mention/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { MentionsPlugin } from '../mentionsPluginType';
import type { MentionPluginOptions } from '../types';

import { disabledTooltipRenderer } from './disabledTooltipRenderer';
import { type MentionAvatarController, mentionAvatarRenderer } from './mentionAvatarRenderer';
import { profileCardRenderer } from './profileCardRenderer';

const primitiveClassName = 'editor-mention-primitive';
const primitiveWithAvatarClassName = 'editor-mention-primitive-with-avatar';
const avatarContainerClassName = 'editor-mention-avatar';
const mentionTextClassName = 'editor-mention-text';
/** Classes applied to the disabled-reason tooltip: the shared default look, plus our own hook. */
const disabledTooltipClassNames = `${VANILLA_TOOLTIP_DEFAULT_CLASS} mention-disabled-tooltip`;
const genericMentionIds = ['HipChat', 'all', 'here'];
const unknownMentionText = `@${UNKNOWN_USER_ID}`;

type HTMLAttributes = Partial<
	Omit<Record<Lowercase<keyof React.AllHTMLAttributes<HTMLElement>>, string>, 'classname'>
> & {
	[key: `data-${string}`]: string;
} & { class: string };

// eslint-disable-next-line require-unicode-regexp
const AT_PREFIX_REGEX = /^@/;

const getAccessibilityLabelFromName = (name: string) => name.replace(AT_PREFIX_REGEX, '');

// Workaround: AI-rewritten pages may store the raw AAID (e.g. '@712020:uuid') in attrs.text for
// APP/AGENT mentions instead of the display name. Detect this so we can fall through to provider
// resolution. Pattern: '@digits:uuid' — distinct from plain-UUID human AAIDs (no numeric prefix).
const AAID_MENTION_TEXT_PATTERN =
	// eslint-disable-next-line require-unicode-regexp
	/^@\d+:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true if `text` looks like a raw AAID rather than a display name. */
const isMentionTextAnAaid = (text: string): boolean => AAID_MENTION_TEXT_PATTERN.test(text);

const isAgentMentionsExperimentEnabled = (): boolean =>
	expVal('platform_editor_agent_mentions', 'isEnabled', false);

/**
 * Returns true if the node is an APP/AGENT mention whose stored text is a raw
 * AAID (e.g. '@712020:uuid') rather than a resolved display name.
 * All AAID-workaround guards should go through this helper so the checks stay
 * consistent and can't drift apart.
 */
const isAgentAaidText = (node: PMNode, isAgentMentionsEnabled: boolean): boolean =>
	isAgentMentionsEnabled &&
	(node.attrs.userType === 'APP' || node.attrs.userType === 'AGENT') &&
	!!node.attrs.text &&
	isMentionTextAnAaid(node.attrs.text);

const toDOM = (node: PMNode, hasAvatarSlot: boolean): DOMOutputSpec => {
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

	const isAgentMentionsEnabled = isAgentMentionsExperimentEnabled();

	if (isAgentMentionsEnabled && node.attrs.userType) {
		mentionAttrs = { ...mentionAttrs, 'data-user-type': node.attrs.userType };
	}

	const browser = getBrowserInfo();
	const hasAgentAaidText = isAgentAaidText(node, isAgentMentionsEnabled);
	const mentionText = node.attrs.text && !hasAgentAaidText ? node.attrs.text : '@…';
	const visibleMentionText =
		hasAvatarSlot && mentionText.startsWith('@') ? mentionText.slice(1) : mentionText;
	const mentionContentSpec: DOMOutputSpec = hasAvatarSlot
		? [
				'span',
				{
					spellcheck: 'false',
					class: `${primitiveClassName} ${primitiveWithAvatarClassName}`,
				},
				[
					'span',
					{
						class: avatarContainerClassName,
						'aria-hidden': 'true',
					},
				],
				['span', { class: mentionTextClassName }, visibleMentionText],
			]
		: [
				'span',
				{
					spellcheck: 'false',
					class: primitiveClassName,
				},
				mentionText,
			];

	return [
		'span',
		mentionAttrs,
		[
			'span',
			{ class: 'zeroWidthSpaceContainer' },
			['span', { class: 'inlineNodeViewAddZeroWidthSpace' }, ZERO_WIDTH_SPACE],
		],
		mentionContentSpec,
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
	editorView?: EditorView;
	options?: MentionPluginOptions;
	portalProviderAPI: PortalProviderAPI;
}
const processName = (name: MentionNameDetails): string => {
	return name.status === MentionNameStatus.OK ? `@${name.name || ''}` : unknownMentionText;
};

const handleProviderName = async (
	mentionProvider: MentionProvider | undefined,
	node: PMNode,
	isAgentMentionsEnabled: boolean,
): Promise<string | undefined> => {
	// Also resolve when text is a raw AAID — provider will return the real display name.
	const textIsAaid = isAgentAaidText(node, isAgentMentionsEnabled);
	if (
		isResolvingMentionProvider(mentionProvider) &&
		node.attrs.id &&
		(!node.attrs.text || textIsAaid)
	) {
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
	private updateProfileCardNode: ((nextNode: PMNode) => void) | undefined;
	private mentionPrimitiveElement: HTMLElement | undefined;
	private mentionTextElement: HTMLElement | undefined;
	private mentionAvatar: MentionAvatarController | undefined;
	private hasAvatarSlot = false;
	private isDestroyed = false;
	private disabledTooltip:
		| {
				destroy: () => void;
				setTooltip: (text: string | undefined) => void;
		  }
		| undefined;
	private vanillaDisabledTooltip: VanillaTooltip | undefined;
	private vanillaDisabledTooltipText: string | undefined;
	private unsubscribeFromDisabledStateChanges: (() => void) | undefined;
	private subscribedProvider: MentionProvider | undefined;

	constructor(node: PMNode, config: MentionNodeViewProps) {
		const { options, api, portalProviderAPI, editorView } = config;
		this.hasAvatarSlot =
			Boolean(options?.mentionNodeDataProvider) &&
			node.attrs.userType !== 'SPECIAL' &&
			!genericMentionIds.includes(node.attrs.id) &&
			isExperimentEnabled('platform_editor_mention_node_avatar');
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node, this.hasAvatarSlot));
		this.dom = dom;
		this.contentDOM = contentDOM;
		this.config = config;
		this.node = node;
		this.domElement = dom instanceof HTMLElement ? dom : undefined;
		this.mentionPrimitiveElement = this.domElement
			? (this.domElement.querySelector<HTMLElement>(`.${primitiveClassName}`) ?? undefined)
			: undefined;
		this.mentionTextElement = this.mentionPrimitiveElement;

		if (this.hasAvatarSlot) {
			this.mentionTextElement =
				this.domElement?.querySelector<HTMLElement>(`.${mentionTextClassName}`) ??
				this.mentionPrimitiveElement;
			const avatarContainer = this.domElement?.querySelector<HTMLElement>(
				`.${avatarContainerClassName}`,
			);
			if (avatarContainer) {
				this.mentionAvatar = mentionAvatarRenderer({ container: avatarContainer });
				this.resolveMentionAvatar(options?.mentionNodeDataProvider);
			}
		}

		const { mentionProvider } = api?.mention.sharedState.currentState() ?? {};
		this.updateState(mentionProvider);
		this.subscribeToProviderDisabledStateChanges(mentionProvider);

		this.cleanup = api?.mention.sharedState.onChange(({ nextSharedState }) => {
			this.updateState(nextSharedState?.mentionProvider);
			this.subscribeToProviderDisabledStateChanges(nextSharedState?.mentionProvider);
		});

		const { destroyProfileCard, removeProfileCard, updateNode } = profileCardRenderer({
			dom,
			options,
			portalProviderAPI,
			node,
			api,
			editorView,
		});
		// Accessibility attributes - based on `packages/people-and-teams/profilecard/src/components/User/ProfileCardTrigger.tsx`
		if (this.domElement && options?.profilecardProvider) {
			const isAgentMentionsEnabled = isAgentMentionsExperimentEnabled();
			if (node.attrs.text && !isAgentAaidText(node, isAgentMentionsEnabled)) {
				this.domElement.setAttribute('aria-label', getAccessibilityLabelFromName(node.attrs.text));
			}
			this.domElement.setAttribute('aria-expanded', 'false');
			this.domElement.setAttribute('role', 'button');
			this.domElement.setAttribute('tabindex', '0');
			this.domElement.setAttribute('aria-haspopup', 'dialog');
		}
		this.destroyProfileCard = destroyProfileCard;
		this.removeProfileCard = removeProfileCard;
		this.updateProfileCardNode = updateNode;
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

	/**
	 * Bind to `this.domElement`, the node-view wrapper. `VanillaTooltip` appends the popover to
	 * its trigger and listens for hover/focus there. This wrapper is also where `role`,
	 * `tabindex`, and aria are set, so `aria-describedby` belongs on it — not on the inner
	 * `.editor-mention-primitive` that the React tooltip still wraps.
	 */
	private syncVanillaDisabledTooltip(tooltipText: string | undefined): void {
		const trigger = this.domElement;
		if (!trigger || tooltipText === this.vanillaDisabledTooltipText) {
			return;
		}

		// A changed reason rebuilds rather than re-texting, so nothing out here has to reach into
		// the element `VanillaTooltip` owns. `destroy()` takes that element with it.
		this.vanillaDisabledTooltip?.destroy();
		this.vanillaDisabledTooltip = undefined;
		this.vanillaDisabledTooltipText = tooltipText;

		if (isSSR() || !tooltipText) {
			return;
		}

		this.vanillaDisabledTooltip = new VanillaTooltip(
			trigger,
			tooltipText,
			undefined,
			disabledTooltipClassNames,
		);
	}

	private syncDisabledTooltip(disabledState: MentionDisabledState | undefined): void {
		// Capture the tooltip text into a local so the rest of the method can
		// branch on a truthy string instead of re-asserting non-null fields
		// off of `disabledState`.
		const tooltipText: string | undefined = disabledState?.disabled
			? disabledState.tooltip
			: undefined;

		if (isExperimentEnabled('platform_editor_use_vanilla_components')) {
			this.syncVanillaDisabledTooltip(tooltipText);
			return;
		}

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

	private setTextContent(name: string | undefined, isAgentMentionsEnabled: boolean) {
		// Also overwrite when text is a raw AAID so the resolved name takes precedence.
		const textIsAaid = isAgentAaidText(this.node, isAgentMentionsEnabled);
		if (name && (!this.node.attrs.text || textIsAaid) && this.mentionTextElement) {
			this.setVisibleText(name);
		}
	}

	private setVisibleText(text: string): void {
		if (!this.mentionTextElement) {
			return;
		}

		this.mentionTextElement.textContent =
			this.hasAvatarSlot && text.startsWith('@') && text !== unknownMentionText
				? text.slice(1)
				: text;
	}

	private resolveMentionAvatar(mentionNodeDataProvider: MentionNodeDataProvider | undefined): void {
		if (!this.hasAvatarSlot || !mentionNodeDataProvider || this.node.attrs.userType === 'SPECIAL') {
			return;
		}

		const mention: MentionNodeDataIdentifier = {
			id: this.node.attrs.id,
			userType: this.node.attrs.userType,
		};
		const applyData = (data: ReturnType<MentionNodeDataProvider['getMentionDataFromCache']>) => {
			if (this.isDestroyed || !data?.avatarUrl) {
				return;
			}

			this.mentionAvatar?.render(data);
		};

		mentionNodeDataProvider.getMentionData(mention, (payload) => {
			if (payload.data) {
				applyData(payload.data);
			}
		});
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
		const isAgentMentionsEnabled = isAgentMentionsExperimentEnabled();
		const isHighlighted = this.shouldHighlightMention(mentionProvider);

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

		const name = await handleProviderName(mentionProvider, this.node, isAgentMentionsEnabled);
		this.setTextContent(name, isAgentMentionsEnabled);
		// Only overwrite the disabled-state aria-label with the name-based one
		// when the chip is NOT disabled; otherwise the disabled reason set in
		// `setClassList` would be silently clobbered, regressing a11y.
		if (this.domElement && this.config.options?.profilecardProvider && newState !== 'disabled') {
			const text = name ?? this.node.attrs.text;
			if (text && !isAgentAaidText(this.node, isAgentMentionsEnabled)) {
				this.domElement.setAttribute('aria-label', getAccessibilityLabelFromName(text));
			}
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
		// Keep the profile card renderer's node reference in sync so that the
		// click handler always reads up-to-date attrs.
		this.updateProfileCardNode?.(node);
		return true;
	}

	destroy(): void {
		this.isDestroyed = true;
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
		this.mentionAvatar?.destroy();
		this.mentionAvatar = undefined;
		this.disabledTooltip?.destroy();
		this.disabledTooltip = undefined;
		if (isExperimentEnabled('platform_editor_use_vanilla_components')) {
			this.vanillaDisabledTooltip?.destroy();
			this.vanillaDisabledTooltip = undefined;
			this.vanillaDisabledTooltipText = undefined;
		}
		this.unsubscribeFromDisabledStateChanges?.();
		this.unsubscribeFromDisabledStateChanges = undefined;
		this.subscribedProvider = undefined;
	}

	deselectNode(): void {
		this.removeProfileCard?.();
	}
}
