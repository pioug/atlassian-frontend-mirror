import type { Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import type { ColorScheme } from '../../showDiffPluginType';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import { createLeftAnchorWidget } from './createAnchorDecorationWidgets';
import { buildDiffDecorationSpec, buildAnchorDecorationKey } from './decorationKeys';
import { wrapBlockNodeView, injectInnerWrapper } from './utils/wrapBlockNodeView';

/**
 * Creates a single block widget that renders a reference text block content
 * beneath a granular diff set, for reference when deleted content is hidden.
 *
 * Since granular diffing only applies to singular isTextBlock=true nodes, this
 * widget always renders exactly one block node and does not need the slice/fragment
 * complexity of createNodeChangedDecorationWidget.
 *
 * Resolves which doc and positions to render based on isInverted:
 * - !isInverted: renders originalDoc at A-side positions (what was there before)
 * - isInverted: renders newDoc at B-side positions (the current/new content)
 *
 * The widget is always inserted at the B-side block boundary in newDoc since
 * ProseMirror decorations are always anchored against the live (new) document.
 */
export const createGranularBlockReferenceWidget = ({
	change,
	originalDoc,
	newDoc,
	isInverted,
	nodeViewSerializer,
	colorScheme,
	intl,
	activeIndexPos,
	diffId,
	showIndicators = false,
}: {
	activeIndexPos?: { from: number; to: number };
	change: Change;
	colorScheme?: ColorScheme;
	diffId: string;
	intl: IntlShape;
	isInverted: boolean;
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	originalDoc: PMNode;
	showIndicators?: boolean;
}): Decoration[] => {
	// Determine which doc and positions to use for rendering the reference block.
	const renderDoc = isInverted ? newDoc : originalDoc;
	const renderTo = isInverted ? change.toB : change.toA;

	// The insertion point is always in newDoc — ProseMirror decorates against the live document.
	// Walk up from toB to find the enclosing text block boundary for widget placement.
	const insertResolvedPos = newDoc.resolve(change.toB);
	let blockEnd: number = change.toB;
	for (let depth = insertResolvedPos.depth; depth >= 0; depth--) {
		const node = insertResolvedPos.node(depth);
		if (node.isTextblock) {
			blockEnd = insertResolvedPos.start(depth) + node.nodeSize - 1;
			break;
		}
	}

	// Find the block node to render from the render doc at the render positions.
	const renderResolvedPos = renderDoc.resolve(renderTo);
	let renderBlockNode: PMNode | null = null;
	for (let depth = renderResolvedPos.depth; depth >= 0; depth--) {
		const node = renderResolvedPos.node(depth);
		if (node.isTextblock) {
			renderBlockNode = node;
			break;
		}
	}

	if (!renderBlockNode) {
		return [];
	}

	const isActive =
		activeIndexPos && change.fromB === activeIndexPos.from && change.toB === activeIndexPos.to;

	/**
	 * This will always be a block node as it's a textBlock-like node.
	 * We use div instead of span so we can add margins.
	 */
	const dom = document.createElement('div');
	dom.setAttribute('data-testid', 'show-diff-granular-block-reference');
	dom.style.setProperty('margin-top', token('space.200'));

	const nodeView = nodeViewSerializer.tryCreateNodeView(renderBlockNode);
	if (nodeView) {
		wrapBlockNodeView({
			dom,
			nodeView,
			targetNode: renderBlockNode,
			colorScheme,
			intl,
			isActive: !!isActive,
			isInserted: false,
		});
	} else {
		const serialized = nodeViewSerializer.serializeNode(renderBlockNode);
		if (serialized && serialized instanceof HTMLElement) {
			injectInnerWrapper({
				node: serialized,
				colorScheme,
				isActive: !!isActive,
				isInserted: false,
			});
			dom.append(serialized);
		} else if (serialized) {
			dom.append(serialized);
		}
	}

	if (dom.childNodes.length === 0) {
		return [];
	}

	const decorations: Decoration[] = [];

	if (showIndicators) {
		const leftAnchor = createLeftAnchorWidget({
			doc: newDoc,
			from: blockEnd,
			diffId,
		});
		dom.style.setProperty('anchor-name', `--${buildAnchorDecorationKey({ diffId })}`);

		if (leftAnchor) {
			decorations.push(leftAnchor);
		}
	}

	decorations.push(
		Decoration.widget(
			blockEnd,
			dom,
			buildDiffDecorationSpec({
				decorationType: 'widget',
				diffId,
				// We want it to be as close to the granular diff as possible
				side: -999,
			}),
		),
	);

	return decorations;
};
