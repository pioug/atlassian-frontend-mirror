import { bind, bindAll } from 'bind-event-listener';
import type { IntlShape } from 'react-intl';

import { getThirdPartyAgentColor } from '@atlaskit/agent-color/get-third-party-agent-color';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { VanillaTooltip } from '@atlaskit/editor-common/vanilla-tooltip';
import { token } from '@atlaskit/tokens';

import {
	DELETED_HIGHLIGHT_BG_VAR,
	DELETED_HIGHLIGHT_BORDER_VAR,
	getAccentTokens,
	getDeletedHighlightHoverBorderColor,
	getDeletedHighlightHoverColor,
} from '../../pm-plugins/decorations/colorSchemes/factory';
import { colorSchemeRegistry } from '../../pm-plugins/decorations/colorSchemes/schemes';
import type { ColorScheme } from '../../pm-plugins/decorations/colorSchemes/types';
import type {
	ContributorTagModel,
	DiffAgentBrand,
	ShowDiffPlugin,
	TagContributor,
} from '../../showDiffPluginType';
import {
	buildContributorTagDom,
	CONTRIBUTOR_TAG_REVEALED_ATTRIBUTE,
	CONTRIBUTOR_TAG_TOOLTIP_STYLES,
	type ContributorTagDom,
	TAG_EXIT_FALLBACK_MS,
} from './buildContributorTagDom';
import { contributorAvatarRenderer, type ContributorAvatar } from './contributorAvatarRenderer';
import { formatContributorLabel } from './contributorLabel';

export type ContributorTagControllerOptions = {
	/** The `anchor-name` of the block this tag captions, when it has one. */
	anchorName?: string;
	api?: ExtractInjectionAPI<ShowDiffPlugin>;
	diffId: string;
	/**
	 * This editor's own content root (`editorView.dom`), read through the plugin's captured view.
	 *
	 * Every DOM lookup the tag makes is scoped to it, rather than resolved by class name from a
	 * highlight element: `.ProseMirror` is not this package's to rename, and with nested editors the
	 * nearest one is not necessarily the editor whose plugin rendered this tag.
	 */
	getEditorRoot: () => HTMLElement | null;
	/**
	 * Read when a model is applied rather than subscribed to, so a locale swap mid-diff would not
	 * re-label a tag already on screen. Locales do not hot-swap while a diff is open.
	 */
	getIntl: () => IntlShape;
};

/**
 * Resolves the tag's accent from the same scheme value the highlight was drawn from, so the colour
 * the two carry can never drift — only the tone does, which is `getAccentTokens`'s to pick.
 */
const getTagAccent = ({
	colorScheme,
	isActive,
	isInserted,
}: {
	colorScheme: ColorScheme | undefined;
	isActive: boolean;
	isInserted: boolean;
}): { background: string; text: string } => {
	const colors = colorSchemeRegistry[colorScheme ?? 'standard'];
	const accent = isInserted
		? isActive
			? colors.insertActiveColor
			: colors.insertColor
		: isActive
			? colors.deleteActiveColor
			: colors.deleteColor;

	return getAccentTokens(accent);
};

/** ChatGPT's own brand colour, resolved from the shared `@atlaskit/agent-color` registry. */
const chatgptBrandColor = getThirdPartyAgentColor({ agentName: 'chatgpt' });
const figmaBrandColor = getThirdPartyAgentColor({ agentName: 'figma' });
const lovableBrandColor = getThirdPartyAgentColor({ agentName: 'lovable' });
const replitBrandColor = getThirdPartyAgentColor({ agentName: 'replit' });

/** Brand accents for agent kinds with no ADS token match. New agents opt in by adding an entry. */
const AGENT_KIND_ACCENT_OVERRIDES: Readonly<Record<string, { background: string; text: string }>> =
	{
		rovo: {
			background: token('color.background.neutral.bold'),
			text: token('color.text.inverse'),
		},
		...(chatgptBrandColor
			? {
					chatgpt: { background: chatgptBrandColor.bold, text: chatgptBrandColor.boldText },
				}
			: {}),
		...(figmaBrandColor
			? { figma: { background: figmaBrandColor.bold, text: figmaBrandColor.boldText } }
			: {}),
		...(lovableBrandColor
			? { lovable: { background: lovableBrandColor.bold, text: lovableBrandColor.boldText } }
			: {}),
		...(replitBrandColor
			? { replit: { background: replitBrandColor.bold, text: replitBrandColor.boldText } }
			: {}),
	} satisfies Partial<Record<DiffAgentBrand, { background: string; text: string }>>;

/**
 * Keyboard focus, as a member of `revealSources` alongside the elements the pointer can be over. It
 * has no element of its own to key on — the tag is already in the set under its own hover.
 */
const FOCUS_SOURCE = Symbol('contributor-tag-focus');

/** Moves the tag between the two ends of the fade `contributorTagStyles` declares. */
const setRevealed = (tag: HTMLElement, isVisible: boolean): void => {
	tag.toggleAttribute(CONTRIBUTOR_TAG_REVEALED_ATTRIBUTE, isVisible);
};

/**
 * Whether the browser is showing this focus, which is the same question its focus ring answers — see
 * the `:focus-visible` rule in `contributorTagStyles`.
 *
 * Clicking the tag focuses it, so a tag held up by focus alone stayed on screen after the pointer had
 * left, until something else took focus (EDITOR-9046). Measured in Chromium: a click leaves this
 * `false` and `Tab` leaves it `true`, so the keyboard focus stop is unaffected.
 */
const isFocusVisible = (tag: HTMLElement): boolean => tag.matches(':focus-visible');

/**
 * Whether flipping the tag's state will actually run a transition on it.
 *
 * Asked of the element rather than of `matchMedia`, because reduced motion and a missing stylesheet
 * both compute to a zero duration — and a transition that never starts fires no `transitionend`, so
 * a tag waiting for one would sit on screen until the backstop timeout.
 *
 * Read only when a tag is being taken down: it resolves style.
 */
const willTransition = (tag: HTMLElement): boolean =>
	window
		.getComputedStyle(tag)
		.transitionDuration.split(',')
		.some((duration) => parseFloat(duration) > 0);

/**
 * Fades a tag that is still on screen out, and releases it once the fade has finished.
 *
 * No controller owns the element by the time this runs — it is released up front so a republished
 * model's tag can fade in over the top — so everything the removal needs is captured here.
 */
const fadeTagOut = (tag: HTMLElement, release: () => void): void => {
	setRevealed(tag, false);

	// Nothing to wait for: reduced motion, or no stylesheet to fade it with.
	if (!willTransition(tag)) {
		release();
		return;
	}

	let unbind: (() => void) | undefined;
	let isFinished = false;

	const finish = () => {
		// Whichever of the two signals arrives first wins; the other must not release twice.
		if (isFinished) {
			return;
		}
		isFinished = true;
		unbind?.();
		unbind = undefined;
		clearTimeout(fallbackId);
		release();
	};

	unbind = bind(tag, {
		type: 'transitionend',
		// `transitionend` bubbles, and opacity is not the only property that could ever carry one.
		listener: (event) => {
			if (event.target === tag && event.propertyName === 'opacity') {
				finish();
			}
		},
	});
	const fallbackId = setTimeout(finish, TAG_EXIT_FALLBACK_MS);
};

/** The contributors a tag draws, keyed so a republished model can be recognised as the same pair. */
const identityOf = (model: ContributorTagModel | undefined): string =>
	[model?.contributor, model?.connectedContributor]
		.map((contributor) =>
			contributor
				? `${contributor.kind}:${contributor.agentKind ?? ''}:${contributor.name}:${contributor.avatarUrl ?? ''}`
				: '',
		)
		.join('|');

/**
 * A small tag naming who made one diff, drawn into the host element its decoration places on the
 * change's first character and positioned above it.
 *
 * The model is resolved from plugin state here rather than passed in, because ProseMirror skips
 * `toDOM` for a widget it reuses: stepping to the next change republishes the tags without redrawing
 * their hosts, so anything the tag reacts to — `isActive` above all — has to arrive through a
 * subscription of its own (EDITOR-8702). Draws nothing when this diff has no tag, which is the case
 * for the folded half of a replacement: its two decorations share the one tag.
 */
export class ContributorTagController {
	private avatars: ContributorAvatar[] = [];
	/** Guards a deferred bind that a later model change has already superseded. */
	private bindToken = 0;
	private boundSelector: string | undefined;
	private dom: ContributorTagDom | undefined;
	private fullLabel = '';
	/** The bound highlights themselves, so hover can write the deleted highlight onto them. */
	private highlightElements: HTMLElement[] = [];
	private host: HTMLElement | undefined;
	private isDestroyed = false;
	/** Last visibility written, so a teardown knows whether there is anything on screen to fade. */
	private isVisible = false;
	private model: ContributorTagModel | undefined;
	/**
	 * Everything currently asking for the tag to be up, other than the model: each hovered highlight,
	 * the tag itself while the pointer is on it, and `FOCUS_SOURCE` while it holds focus.
	 *
	 * One set rather than independent booleans, which is what let the exit's trailing delay go: a
	 * pointer crossing from the highlight onto the tag removes one member and adds another in the same
	 * dispatch, so no style is resolved in between and the browser never starts the exit. Booleans
	 * could not see each other, so the crossing wrote the tag out and straight back in.
	 */
	private revealSources = new Set<EventTarget | symbol>();
	private tooltip: VanillaTooltip | undefined;
	private tooltipContent: string | undefined;
	private unbindHighlights: Array<() => void> = [];
	private unbindTag: (() => void) | undefined;
	private unsubscribe: (() => void) | undefined;

	constructor(private options: ContributorTagControllerOptions) {}

	mount(host: HTMLElement): void {
		this.host = host;
		const { sharedState } = this.options.api?.showDiff ?? {};

		this.unsubscribe = sharedState?.onChange(({ nextSharedState }) => {
			this.applyModel(this.findModel(nextSharedState?.contributorTags));
		});
		this.applyModel(this.findModel(sharedState?.currentState()?.contributorTags));
	}

	destroy(): void {
		this.isDestroyed = true;
		this.unsubscribe?.();
		this.unsubscribe = undefined;
		this.teardownTag();
		this.host = undefined;
	}

	private findModel(tags: ContributorTagModel[] | undefined): ContributorTagModel | undefined {
		return tags?.find((tag) => tag.diffId === this.options.diffId);
	}

	private applyModel(next: ContributorTagModel | undefined): void {
		if (this.isDestroyed || next === this.model) {
			return;
		}

		const previous = this.model;
		this.model = next;

		const { host } = this;
		if (!next || !host) {
			this.teardownTag();
			return;
		}

		if (!this.dom) {
			this.dom = buildContributorTagDom(host.ownerDocument, this.options.anchorName);
			this.bindTag(this.dom);
			host.appendChild(this.dom.root);
		}

		if (!previous || identityOf(previous) !== identityOf(next)) {
			this.renderAvatars(next);
		}
		this.renderLabels(next);
		this.applyAccent(next);
		this.syncHighlightBindings(next);
		this.applyVisibility();
		this.syncTooltip();
	}

	/**
	 * Takes the tag's DOM down, keeping the subscription so a republished model redraws it.
	 *
	 * A tag that is still on screen is released here and fades out on its own, so a republished
	 * model's tag fades in over the top of the outgoing one — see `fadeTagOut`.
	 */
	private teardownTag(): void {
		// Unbound synchronously, ahead of any fade: a tag on its way out must not be revealed again by
		// the pointer, and these listeners are what hold this controller.
		this.unbindHighlightState();
		this.boundSelector = undefined;
		this.unbindTag?.();
		this.unbindTag = undefined;
		// Destroyed rather than carried through the fade: it is a popover in the top layer.
		this.tooltip?.destroy();
		this.tooltip = undefined;
		this.tooltipContent = undefined;

		const { dom, isVisible } = this;
		// Destroying an avatar removes its element, so the avatars go with whoever removes the tag —
		// destroyed here and it would fade out empty.
		const { avatars } = this;
		this.avatars = [];
		this.dom = undefined;
		this.isVisible = false;
		// The set belongs to the listeners just unbound: a stale member would draw the tag as visible
		// with the pointer nowhere near it.
		this.revealSources.clear();

		if (!dom) {
			return;
		}

		const release = () => {
			avatars.forEach((avatar) => avatar.destroy());
			dom.root.remove();
		};

		// Nothing on screen to fade. `isConnected` covers ProseMirror destroying the widget: a fade on
		// a detached element never starts.
		if (!isVisible || !dom.tag.isConnected) {
			release();
			return;
		}

		fadeTagOut(dom.tag, release);
	}

	private bindTag({ tag }: ContributorTagDom): void {
		// `mouseover`/`mouseout` rather than the enter/leave pair, because they are what fire as the
		// pointer moves between the tag's own children. Both are keyed on the tag, so those moves add
		// and remove the same member and the set never empties.
		this.unbindTag = bindAll(tag, [
			{ type: 'mouseover', listener: this.trackRevealSource(tag, true) },
			{ type: 'mouseout', listener: this.trackRevealSource(tag, false) },
			// Only a focus the browser is showing holds the tag up — see `isFocusVisible`.
			{ type: 'focus', listener: () => this.setRevealSource(FOCUS_SOURCE, isFocusVisible(tag)) },
			{ type: 'blur', listener: this.trackRevealSource(FOCUS_SOURCE, false) },
		]);
	}

	/** One listener shape for every reveal source, so all of them land in the same set. */
	private trackRevealSource(source: EventTarget | symbol, isRevealing: boolean) {
		return () => this.setRevealSource(source, isRevealing);
	}

	private setRevealSource(source: EventTarget | symbol, isRevealing: boolean): void {
		if (isRevealing) {
			this.revealSources.add(source);
		} else {
			this.revealSources.delete(source);
		}
		this.applyVisibility();
	}

	private renderAvatars(model: ContributorTagModel): void {
		const { avatars: container } = this.dom ?? {};
		if (!container) {
			return;
		}

		this.avatars.forEach((avatar) => avatar.destroy());
		this.avatars = [];

		const doc = container.ownerDocument;
		const { background } = this.accentOf(model);
		const isPrimaryAgent = model.contributor.kind === 'agent';
		// Resolved by `kind` so a reverse `connectedTo` (an attributed user pointing at its agent)
		// renders identically.
		const user = isPrimaryAgent ? model.connectedContributor : model.contributor;
		const agent = isPrimaryAgent ? model.contributor : model.connectedContributor;

		// Hand-rolled avatar stack: `@atlaskit/avatar-group` cannot render below 24px and the tag uses
		// 16px avatars.
		const stack: Array<{ contributor: TagContributor; stackIndex?: number }> =
			model.connectedContributor
				? [
						...(agent ? [{ contributor: agent, stackIndex: 1 }] : []),
						...(user ? [{ contributor: user, stackIndex: 0 }] : []),
					]
				: [{ contributor: model.contributor }];

		stack.forEach(({ contributor, stackIndex }, index) => {
			const avatar = contributorAvatarRenderer({
				contributor,
				doc,
				ringColor: background,
				stackIndex,
			});
			if (index < stack.length - 1) {
				// Sits the leading avatar of a connected pair flush against the one behind it, with
				// no overlap and no extra gap.
				avatar.element.style.setProperty('margin-inline-end', '0');
			}
			container.appendChild(avatar.element);
			this.avatars.push(avatar);
		});
	}

	private renderLabels(model: ContributorTagModel): void {
		if (!this.dom) {
			return;
		}

		const { fullLabel, visibleName } = formatContributorLabel(
			model,
			this.options.getIntl().formatMessage,
		);

		this.dom.name.textContent = visibleName;
		this.fullLabel = fullLabel;
		this.dom.srLabel.textContent = fullLabel;
	}

	private accentOf(model: ContributorTagModel): {
		background: string;
		text: string;
	} {
		const accent = getTagAccent({
			colorScheme: model.colorScheme,
			isActive: Boolean(model.isActive),
			isInserted: model.isInserted ?? true,
		});

		const agentKind = model.contributor.agentKind ?? model.connectedContributor?.agentKind;
		const override = agentKind && AGENT_KIND_ACCENT_OVERRIDES[agentKind];

		return override ? { ...accent, ...override } : accent;
	}

	private applyAccent(model: ContributorTagModel): void {
		if (!this.dom) {
			return;
		}

		const accent = this.accentOf(model);
		this.dom.tag.style.setProperty('background-color', accent.background);
		this.dom.name.style.setProperty('color', accent.text);
		this.avatars.forEach((avatar) => avatar.setRingColor(accent.background));
	}

	/**
	 * Visibility — the one thing the model does not carry on its own, because hover is not in it.
	 *
	 * One idempotent attribute write, with nothing to guard: whether the flip is a real one, whether
	 * the tag is attached yet, and whether motion is wanted at all are all the stylesheet's to answer.
	 */
	private applyVisibility(): void {
		if (!this.dom) {
			return;
		}

		const isVisible = Boolean(this.model?.isActive) || this.revealSources.size > 0;
		this.isVisible = isVisible;

		setRevealed(this.dom.tag, isVisible);
		this.applyHighlightHover();
	}

	/**
	 * Brings the deleted highlight up alongside the tag, for the schemes that paint none at rest —
	 * see `DELETED_HIGHLIGHT_BG_VAR`. Keyed on `revealSources` rather than on the tag's own
	 * visibility: an active change paints its highlight from its decoration style, which this must
	 * not be able to override.
	 */
	private applyHighlightHover(): void {
		const isHovered = this.revealSources.size > 0;
		const colors = colorSchemeRegistry[this.model?.colorScheme ?? 'standard'];

		this.highlightElements.forEach((highlight) => {
			if (isHovered) {
				highlight.style.setProperty(
					DELETED_HIGHLIGHT_BG_VAR,
					getDeletedHighlightHoverColor(colors),
				);
				highlight.style.setProperty(
					DELETED_HIGHLIGHT_BORDER_VAR,
					getDeletedHighlightHoverBorderColor(colors),
				);
			} else {
				highlight.style.removeProperty(DELETED_HIGHLIGHT_BG_VAR);
				highlight.style.removeProperty(DELETED_HIGHLIGHT_BORDER_VAR);
			}
		});
	}

	/**
	 * The full label is always the tooltip, whether or not the name it draws is clipped: a name longer
	 * than `MAX_TAG_WIDTH` is ellipsised, and a connected pair spells out a contributor the tag does
	 * not show at any width.
	 *
	 * `VanillaTooltip` has no "set new content" call, so it is rebuilt when the label changes — the
	 * shape of `syncVanillaDisabledTooltip` in `mentionNodeView`.
	 */
	private syncTooltip(): void {
		const content = this.dom ? this.fullLabel : undefined;

		if (content === this.tooltipContent) {
			return;
		}

		this.tooltip?.destroy();
		this.tooltip = undefined;
		this.tooltipContent = content;

		if (!content || !this.dom) {
			return;
		}

		this.tooltip = new VanillaTooltip(
			this.dom.tag,
			content,
			// Generated id.
			undefined,
			// No class: the look is inline, because a hoisted tooltip is outside the `.ProseMirror`
			// scope `VANILLA_TOOLTIP_DEFAULT_CLASS` is keyed on — see `CONTRIBUTOR_TAG_TOOLTIP_STYLES`.
			'',
			// Default delay, no `onShow`, and the default `top` placement.
			undefined,
			CONTRIBUTOR_TAG_TOOLTIP_STYLES,
			undefined,
			undefined,
			this.resolveTooltipContainer(),
		);
		// `VanillaTooltip` sets `aria-describedby` on its trigger, which would announce the label a
		// second time — the hidden child already announces it, and names the tag with it.
		this.dom.tag.removeAttribute('aria-describedby');
		// Out of the tag but still in the document, so its text would otherwise be a third copy of the
		// same sentence. It stays visible for sighted users, who need the part of the name the tag
		// clipped.
		this.tooltip.element.setAttribute('aria-hidden', 'true');
	}

	/**
	 * Where the tooltip is appended, rather than inside the tag.
	 *
	 * Popper and the browser only agree on a top-layer popover's origin when nothing above it is
	 * transformed, and the tag hangs under the editor's own transformed nodes — inside a wide image
	 * that is `.rich-media-item`, whose `translateX(-50%)` threw the tooltip off screen
	 * (EDITOR-8971). The content area is the nearest ancestor with none of that above it, and keeps
	 * the tooltip inside the editor it belongs to; the document body covers an appearance that has
	 * no content area.
	 */
	private resolveTooltipContainer(): HTMLElement | undefined {
		const editorRoot = this.options.getEditorRoot();

		return (
			editorRoot?.closest<HTMLElement>('.ak-editor-content-area') ?? editorRoot?.ownerDocument.body
		);
	}

	/**
	 * Observes the highlight this tag describes, for what CSS here cannot see: its hover state. The
	 * highlight is a ProseMirror decoration in a different DOM subtree, so listeners are bound
	 * imperatively via `data-diff-id`.
	 *
	 * Deliberately not routed through plugin state: a transaction per pointer move would re-run the
	 * memoised decoration calculation.
	 */
	private syncHighlightBindings(model: ContributorTagModel): void {
		const { diffId } = this.options;
		const selector = [diffId, ...(model.linkedDiffIds ?? [])]
			.map((id) => `[data-diff-id="${id}"]`)
			.join(', ');

		if (selector === this.boundSelector) {
			return;
		}

		this.boundSelector = selector;
		this.unbindHighlightState();

		// ProseMirror draws the tag's host in the same pass as the highlights it binds to, so those may
		// not be in the document yet. A microtask lands once that pass has finished.
		const pendingBind = ++this.bindToken;
		queueMicrotask(() => {
			if (!this.isDestroyed && pendingBind === this.bindToken) {
				this.bindHighlightState(selector);
			}
		});
	}

	private bindHighlightState(selector: string): void {
		// Scoped to this editor's content root, so a tag can only ever bind to the decorations its own
		// plugin instance rendered — another editor on the page, or one nested inside this one, cannot
		// reveal this tag.
		const highlights = this.options.getEditorRoot()?.querySelectorAll<HTMLElement>(selector);
		if (!highlights?.length) {
			return;
		}

		// `bindAll` takes a single target, and a change can render more than one highlight. Each is its
		// own member of `revealSources`, so the pointer can cross between them without the set
		// emptying.
		this.highlightElements = Array.from(highlights);
		this.unbindHighlights = this.highlightElements.map((highlight) =>
			bindAll(highlight, [
				{ type: 'mouseenter', listener: this.trackRevealSource(highlight, true) },
				{ type: 'mouseleave', listener: this.trackRevealSource(highlight, false) },
			]),
		);
		// The pointer may already be over a highlight by the time this binds, a draw pass after it
		// entered.
		this.applyHighlightHover();
	}

	private unbindHighlightState(): void {
		this.unbindHighlights.forEach((unbind) => unbind());
		this.unbindHighlights = [];
		// Cleared before the elements are released: ProseMirror reuses decoration DOM, so a hover left
		// written on one would paint a highlight nothing is holding up.
		this.highlightElements.forEach((highlight) => {
			highlight.style.removeProperty(DELETED_HIGHLIGHT_BG_VAR);
			highlight.style.removeProperty(DELETED_HIGHLIGHT_BORDER_VAR);
		});
		this.highlightElements = [];
	}
}
