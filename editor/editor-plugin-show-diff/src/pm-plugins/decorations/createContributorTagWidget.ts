import type { IntlShape } from 'react-intl';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { ShowDiffPlugin } from '../../showDiffPluginType';
import { ContributorTagController } from '../../ui/ContributorTag/contributorTagController';
import { buildCharsByOffset, isWhitespaceChar } from '../utils/charsByOffset';

import { clampAnchorPosIntoCell } from './createAnchorDecorationWidgets';
import { buildContributorTagDecorationSpec } from './decorationKeys';

/** Marks the host element of one tag, so a tag can be found in the document by its own diff. */
export const CONTRIBUTOR_TAG_HOST_ATTRIBUTE = 'data-contributor-tag-host';

// Contributor tags only render behind this gate — see `areAttributionColorGatesEnabled`.
export const isContributorTagWidgetEnabled = (): boolean =>
	fg('confluence_ncs_step_diffing_version_history');

/**
 * Everything a tag needs to draw itself into the document, plumbed down from the plugin. Absent in
 * unit tests that build decorations directly: the hosts are still emitted, they just stay empty.
 */
export type ContributorTagMountContext = {
	api?: ExtractInjectionAPI<ShowDiffPlugin>;
	/** This editor's own content root — see `ContributorTagControllerOptions.getEditorRoot`. */
	getEditorRoot: () => HTMLElement | null;
	getIntl: () => IntlShape;
};

/** A mounted tag, so whoever emitted the host can take it down again. */
export type ContributorTagMount = {
	destroy: () => void;
};

/**
 * Draws the tag into `host`. The tag resolves its own model from plugin state, so a redraw of the
 * host re-parents the tag instead of stranding it, and `isActive` changes arrive as an update.
 *
 * Each mount owns its own controller and DOM, so when ProseMirror draws a replacement widget before
 * destroying the one it replaces, the outgoing `destroy` cannot take the incoming tag down with it
 * (EDITOR-8702).
 */
export const mountContributorTag = ({
	diffId,
	host,
	mountContext,
}: {
	diffId: string;
	host: HTMLElement;
	mountContext: ContributorTagMountContext | undefined;
}): ContributorTagMount | undefined => {
	if (!mountContext) {
		return undefined;
	}

	const controller = new ContributorTagController({ ...mountContext, diffId });
	controller.mount(host);

	/**
	 * Kept alive when ProseMirror only rebuilt the widget desc around this same host: a document
	 * change remaps the decoration and fires `destroy`, but an element `toDOM` is reused verbatim
	 * and runs no mount callback, so tearing down here left an active change with no tag
	 * (EDITOR-8971).
	 *
	 * Deferred, because the host is still attached while that update is in flight. A host outside a
	 * live editor root is a real removal — including the view being destroyed, which drops the root.
	 */
	return {
		destroy: () =>
			queueMicrotask(() => {
				if (!host.isConnected || !mountContext.getEditorRoot()?.contains(host)) {
					controller.destroy();
				}
			}),
	};
};

export const unmountContributorTag = (mount: ContributorTagMount | undefined): void => {
	mount?.destroy();
};

/**
 * A zero-size inline host for one contributor tag. `position: relative` makes it the containing
 * block of the absolutely positioned tag, so the tag sits on the change with no measurement.
 */
const buildContributorTagHost = (diffId: string): HTMLSpanElement => {
	const host = document.createElement('span');
	host.setAttribute(CONTRIBUTOR_TAG_HOST_ATTRIBUTE, diffId);
	host.style.setProperty('position', 'relative');
	return host;
};

/**
 * The host for a tag on deleted content, which renders inside its own widget decoration rather than
 * needing one of its own. Unmount with `unmountContributorTag` from that widget's `destroy`.
 */
export const createContributorTagHost = (
	diffId: string,
	mountContext?: ContributorTagMountContext,
): { host: HTMLSpanElement; mount: ContributorTagMount | undefined } | undefined => {
	if (!isContributorTagWidgetEnabled()) {
		return undefined;
	}

	const host = buildContributorTagHost(diffId);

	return { host, mount: mountContributorTag({ diffId, host, mountContext }) };
};

/**
 * The first *visible* character of the content that `[from, to)` highlights.
 *
 * `from` is not sufficient, for two reasons. A range can begin at the tail of one paragraph and only
 * cover text in a later block, and ProseMirror clips `Decoration.inline` to the content it can paint
 * — so a host left at `from` would sit lines away from the highlight. And a range routinely starts on
 * whitespace, because the changeset joins neighbouring edits across the space between them: a tag
 * hosted there captions the gap in front of the change rather than the change (EDITOR-8855).
 *
 * Whitespace is skipped across blocks, so a range whose first block contributes nothing but spaces
 * anchors on the next block that has something to show. The fallback to the first paintable position
 * covers a range holding no text at all — an atomic block such as media or a rule; a range of
 * nothing but whitespace never reaches here, because a change with no visible content carries no tag
 * (see `hasVisibleContent`).
 */
const resolveTagAnchorPos = (doc: PMNode, from: number, to: number): number => {
	let edge: number | undefined;
	let visibleEdge: number | undefined;

	doc.nodesBetween(from, to, (node, nodePos) => {
		if (visibleEdge !== undefined) {
			return false;
		}

		if (!node.isTextblock) {
			return true;
		}

		// The slice of this block the range actually covers; empty means nothing paintable.
		const blockStart = nodePos + 1;
		const contentFrom = Math.max(blockStart, from);
		const contentTo = Math.min(blockStart + node.content.size, to);
		if (contentTo > contentFrom && edge === undefined) {
			edge = contentFrom;
		}

		// A `null` is a non-text inline node (mention, emoji, date, …). Those are visible, so they
		// anchor the tag exactly as a letter does.
		const chars = buildCharsByOffset(node);
		for (let offset = contentFrom - blockStart; offset < contentTo - blockStart; offset++) {
			const char = chars[offset];
			if (char === null || !isWhitespaceChar(char)) {
				visibleEdge = blockStart + offset;
				break;
			}
		}

		// Textblocks have no block children to descend into.
		return false;
	});

	return visibleEdge ?? edge ?? from;
};

/**
 * The position just before the code block enclosing `pos`, or `undefined` when nothing does.
 *
 * `.code-block-content-wrapper` hides its block-axis overflow, so a host left inside the code has
 * its tag clipped away. Hosting it before the block puts the tag on the block's top-left corner,
 * where a whole-code-block change is tagged too (EDITOR-8766).
 */
const resolveCodeBlockStart = (doc: PMNode, pos: number): number | undefined => {
	const $pos = doc.resolve(pos);

	for (let depth = $pos.depth; depth > 0; depth--) {
		if ($pos.node(depth).type.name === 'codeBlock') {
			return $pos.before(depth);
		}
	}

	return undefined;
};

/**
 * A widget hosting the contributor tag of one diff range, placed on the first visible character the
 * range highlights — or, with `anchorAtRangeStart`, at `from` itself. Either way a host that would
 * land inside a code block is hoisted out in front of it; see `resolveCodeBlockStart`.
 *
 * The tag is mounted in `toDOM` and taken down in `destroy`, so it lives exactly as long as the host
 * element ProseMirror drew it into — see `mountContributorTag`.
 */
export const createContributorTagWidget = ({
	anchorAtRangeStart = false,
	doc,
	from,
	to,
	diffId,
	mountContext,
}: {
	/**
	 * Anchor the host at `from` instead of the range's first inline content, so a block range hosts
	 * its tag outside the node rather than inside its content DOM.
	 */
	anchorAtRangeStart?: boolean;
	diffId: string;
	doc: PMNode;
	from: number;
	mountContext?: ContributorTagMountContext;
	to: number;
}): Decoration | undefined => {
	if (!isContributorTagWidgetEnabled()) {
		return undefined;
	}

	// Reassigned when ProseMirror redraws this decoration, which it may do more than once for the
	// same `Decoration` instance.
	let mount: ContributorTagMount | undefined;

	const anchorPos = anchorAtRangeStart ? from : resolveTagAnchorPos(doc, from, to);
	// A change inside a code block is hoisted out of it; anything else keeps its own anchor.
	const codeBlockPos = resolveCodeBlockStart(doc, anchorPos);

	return Decoration.widget(
		// Keep the host out of the table row's grid (EDITOR-8442).
		clampAnchorPosIntoCell(doc, codeBlockPos ?? anchorPos, 1),
		() => {
			const host = buildContributorTagHost(diffId);
			mount = mountContributorTag({ diffId, host, mountContext });
			return host;
		},
		{
			...buildContributorTagDecorationSpec(diffId),
			side: 1,
			// The tag is chrome: it inherits no surrounding mark, and its own events are not the
			// document's to handle.
			marks: [],
			ignoreSelection: true,
			stopEvent: () => true,
			destroy: () => {
				unmountContributorTag(mount);
				mount = undefined;
			},
		},
	);
};
