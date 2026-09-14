import { bind } from 'bind-event-listener';
import type { IntlShape } from 'react-intl';

import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import { unsupportedContentMessages } from '@atlaskit/editor-common/messages';
import { UnsupportedSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import { trackUnsupportedContentTooltipDisplayedFor } from '@atlaskit/editor-common/utils/track-unsupported-content';
import {
	VANILLA_TOOLTIP_DEFAULT_CLASS,
	VanillaTooltip,
} from '@atlaskit/editor-common/vanilla-tooltip';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { getUnsupportedContent } from './get-unsupported-content';
import { getUnsupportedContentIconSpec } from './get-unsupported-content-icon-spec';

/**
 * CSS class names for the vanilla unsupported block node view elements.
 * Corresponding styles are defined in EditorContentContainer (gated behind
 * the platform_editor_vanilla_node_views_phase1 experiment).
 *
 * ⚠️ Renaming any of these requires the same change in BOTH copies of the styles:
 *  - `editor-core/src/ui/EditorContentContainer/styles/unsupportedStyles.ts` (emotion)
 *  - `editor-core/src/ui/EditorContentContainer/EditorContentContainer-compiled.tsx` (cssMap)
 *
 * These cannot be imported by either stylesheet: `cssMap` keys must be statically defined, so
 * the compiled copy hardcodes the strings — as it already does for `UnsupportedSharedCssClassName`.
 * A rename that misses a stylesheet fails loudly in the unsupported-content VR tests, which
 * assert the styled output rather than the class names.
 */
const VanillaUnsupportedCssClassName = {
	BLOCK_INNER: 'unsupported-block-vanilla-inner',
	ICON: 'unsupported-vanilla-icon',
};

const TOOLTIP_CLASS_NAME = 'unsupported-content-tooltip';
/** Distinct from the inline node view's prefix, so the counter fallback below cannot collide. */
const TOOLTIP_ID_PREFIX = 'unsupported-block-content-tooltip';

/** Classes applied to the tooltip element: the shared default look, plus our own hook. */
const TOOLTIP_CLASS_NAMES = `${VANILLA_TOOLTIP_DEFAULT_CLASS} ${TOOLTIP_CLASS_NAME}`;

/**
 * `crypto.randomUUID()` is undefined outside a secure context. The counter is not the best
 * fallback, but given how widely available the crypto API is, it should be fine.
 *
 * Ideally `VanillaTooltip` would take an optional id and generate its own when one is not
 * supplied, rather than leaving this to every caller.
 */
const nextTooltipId = (() => {
	let count = 0;
	return () =>
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? `${TOOLTIP_ID_PREFIX}-${crypto.randomUUID()}`
			: `${TOOLTIP_ID_PREFIX}-${(count += 1)}`;
})();

/**
 * Spec for an unsupported block node.
 *
 * The outer wrapper carries the shared CSS class so selection and cursor styles apply.
 * The inner element's `unsupported` class is retained for parity with the React
 * implementation, which products and tests may still select on.
 */
function getBlockSpec(label: string): DOMOutputSpec {
	return [
		'div',
		{ class: UnsupportedSharedCssClassName.BLOCK_CONTAINER },
		[
			'div',
			{ class: `unsupported ${VanillaUnsupportedCssClassName.BLOCK_INNER}` },
			['span', {}, label],
			getUnsupportedContentIconSpec(VanillaUnsupportedCssClassName.ICON),
		],
	];
}

/**
 * Creates the DOM structure for an unsupported content node view.
 *
 * Matches the React version's two-level structure:
 *   outer wrapper (gets the shared CSS class — unsupportedBlockView-content-wrap)
 *     └── inner div (gets visual styles from EditorContentContainer CSS)
 *           ├── text label (span)
 *           └── icon (span, tooltip trigger)
 *
 * Visual styles (background, border, flex) are applied via EditorContentContainer CSS on
 * `.unsupportedBlockView-content-wrap > div`, matching how the existing selection/cursor
 * styles already work.
 */
function createUnsupportedDOM(
	node: PMNode,
	intl: IntlShape,
): { dom: Node; icon: HTMLElement | null } {
	const label = getUnsupportedContent(
		unsupportedContentMessages.unsupportedBlockContent,
		`${unsupportedContentMessages.unsupportedBlockContent.defaultMessage}:`,
		node,
		intl,
	);

	const { dom } = DOMSerializer.renderSpec(document, getBlockSpec(label));
	const domElement = dom instanceof HTMLElement ? dom : undefined;
	const icon =
		domElement?.querySelector<HTMLElement>(`.${VanillaUnsupportedCssClassName.ICON}`) ?? null;

	return { dom, icon };
}

export class UnsupportedBlockNodeView implements NodeView {
	dom: Node;

	private node: PMNode;
	private tooltip: VanillaTooltip | null = null;
	private unbindMouseenter: (() => void) | null = null;

	constructor(
		node: PMNode,
		intl: IntlShape,
		dispatchAnalyticsEvent: ((payload: UnsupportedContentTooltipPayload) => void) | undefined,
	) {
		this.node = node;

		const { dom, icon } = createUnsupportedDOM(node, intl);
		this.dom = dom;

		if (!icon) {
			return;
		}

		// Lazy-init: create the VanillaTooltip on first mouseenter.
		// Inline styles are required because the Popover API promotes the tooltip to the
		// browser's top layer, where ancestor CSS selectors cannot reach it.
		const initTooltip = (event: Event) => {
			// Unbind before re-dispatching below, so this listener is not re-entered by the
			// synthetic event. Matches `EmojiNodeView`.
			this.unbindMouseenter?.();
			this.unbindMouseenter = null;

			const tooltipText = intl.formatMessage(unsupportedContentMessages.unsupportedContentTooltip);
			this.tooltip = new VanillaTooltip(
				icon,
				tooltipText,
				nextTooltipId(),
				TOOLTIP_CLASS_NAMES,
				300,
				// Styling comes from the classes above, defined in the EditorContentContainer stylesheets.
				undefined,
				// Fired once the tooltip is actually visible, rather than on hover intent, so the
				// analytics match the React implementation's `<Tooltip onShow>`.
				dispatchAnalyticsEvent
					? () =>
							trackUnsupportedContentTooltipDisplayedFor(
								dispatchAnalyticsEvent,
								ACTION_SUBJECT_ID.ON_UNSUPPORTED_BLOCK,
								this.node?.attrs?.originalValue?.type,
							)
					: undefined,
			);

			// VanillaTooltip binds its own `mouseenter` listener inside its constructor.
			// Listeners added while an event is being dispatched are not invoked for that
			// same event, so without re-dispatching, the tooltip would stay hidden until
			// the user hovered away and back. Matches `EmojiNodeView`, which lazy-inits
			// the same way.
			icon.dispatchEvent(new Event(event.type));
		};

		this.unbindMouseenter = bind(icon, {
			type: 'mouseenter',
			listener: initTooltip,
			options: { once: true },
		});
	}

	update(node: PMNode): boolean {
		if (node.type !== this.node.type) {
			return false;
		}
		// originalValue attrs are immutable — label never changes.
		// Track node reference so analytics can read the latest attrs.
		this.node = node;
		return true;
	}

	destroy(): void {
		this.tooltip?.destroy();
		this.tooltip = null;
		this.unbindMouseenter?.();
		this.unbindMouseenter = null;
	}
}
