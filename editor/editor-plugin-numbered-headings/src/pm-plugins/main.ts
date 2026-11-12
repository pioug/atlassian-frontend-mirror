import { isSSR } from '@atlaskit/editor-common/is-ssr';
import {
	getHeadingNumbers,
	HEADING_NUMBER_ATTRIBUTE,
} from '@atlaskit/editor-common/numbered-headings';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import {
	AttrStep,
	ReplaceAroundStep,
	ReplaceStep,
	StepMap,
} from '@atlaskit/editor-prosemirror/transform';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { createSSRHeadingNodeView } from './ssr-heading-node-view';

type Step = Transaction['steps'][number];

export type NumberedHeadingsPluginState = {
	decorations: DecorationSet;
	enabled: boolean;
};

export const numberedHeadingsPluginKey: PluginKey<NumberedHeadingsPluginState> =
	new PluginKey<NumberedHeadingsPluginState>('numberedHeadingsPlugin');

type HeadingPosition = {
	level: number;
	node: PMNode;
	pos: number;
};

const isHeading = (node: PMNode): boolean => node.type.name === 'heading';

/**
 * Collects every heading in document order, across all containers. Textblocks and leaves can't
 * contain headings, so their content is skipped.
 */
export const collectHeadings = (doc: PMNode): HeadingPosition[] => {
	const headings: HeadingPosition[] = [];
	doc.descendants((node, pos) => {
		if (isHeading(node)) {
			headings.push({ level: Number(node.attrs.level), node, pos });
			return false;
		}
		return !node.isTextblock && !node.isLeaf;
	});
	return headings;
};

const createDecorations = (doc: PMNode): DecorationSet => {
	const headings = collectHeadings(doc);
	if (headings.length === 0) {
		return DecorationSet.empty;
	}

	const numbers = getHeadingNumbers(headings.map(({ level }) => level));
	return DecorationSet.create(
		doc,
		headings.map(({ node, pos }, index) => {
			const attrs: HeadingDecorationAttrs = { [HEADING_NUMBER_ATTRIBUTE]: numbers[index] };
			// Also passed as the spec: decoration attrs can't be read back, the spec can. SSR copies
			// the spec onto the heading, so any attribute added here reaches SSR HTML too.
			return Decoration.node(pos, pos + node.nodeSize, attrs, attrs);
		}),
	);
};

/** DOM attributes this plugin's decorations add to a heading. Add new attributes here. */
type HeadingDecorationAttrs = { [HEADING_NUMBER_ATTRIBUTE]: string };

/**
 * Heading attributes by heading start position, built once per decoration set. A `find` per heading
 * would be quadratic: decorations covering top-level nodes all sit in the set's root array, which
 * `find` scans linearly on every call.
 */
const headingAttrsByDecorations = new WeakMap<DecorationSet, Map<number, HeadingDecorationAttrs>>();

const getHeadingAttrsByPos = (decorations: DecorationSet): Map<number, HeadingDecorationAttrs> => {
	let attrsByPos = headingAttrsByDecorations.get(decorations);
	if (!attrsByPos) {
		attrsByPos = new Map();
		// Every decoration in this set is a heading decoration whose spec is its attrs.
		for (const decoration of decorations.find()) {
			attrsByPos.set(decoration.from, decoration.spec as HeadingDecorationAttrs);
		}
		headingAttrsByDecorations.set(decorations, attrsByPos);
	}
	return attrsByPos;
};

/** The attributes the decorations give to the heading at `pos`, or undefined when numbering is off. */
const getHeadingAttrsAt = (state: EditorState, pos: number): HeadingDecorationAttrs | undefined => {
	const pluginState = numberedHeadingsPluginKey.getState(state);
	if (!pluginState?.enabled) {
		return undefined;
	}
	return getHeadingAttrsByPos(pluginState.decorations).get(pos);
};

const fragmentContainsHeading = (fragment: Fragment): boolean => {
	let found = false;
	fragment.descendants((node) => {
		if (found) {
			return false;
		}
		if (isHeading(node)) {
			found = true;
			return false;
		}
		return !node.isTextblock && !node.isLeaf;
	});
	return found;
};

/**
 * Whether the range `[from, to)` of `doc` removes or rewraps a heading, i.e. contains a heading's
 * opening or closing boundary. Edits strictly inside a heading's content (typing) return false.
 */
const rangeTouchesHeadingBoundary = (doc: PMNode, from: number, to: number): boolean => {
	if (from >= to) {
		return false;
	}

	let found = false;
	doc.nodesBetween(from, to, (node, pos) => {
		if (found) {
			return false;
		}
		if (isHeading(node)) {
			const end = pos + node.nodeSize;
			found = (pos >= from && pos < to) || (end > from && end <= to);
			return false;
		}
		return !node.isTextblock && !node.isLeaf;
	});
	return found;
};

/** Text replacement wholly inside one textblock cannot add or remove a heading boundary. */
const stepOnlyChangesTextContent = (step: ReplaceStep, docBefore: PMNode): boolean => {
	if (step.slice.openStart !== 0 || step.slice.openEnd !== 0) {
		return false;
	}

	const { content } = step.slice;
	for (let index = 0; index < content.childCount; index++) {
		if (!content.child(index).isText) {
			return false;
		}
	}

	const $from = docBefore.resolve(step.from);
	return $from.parent.isTextblock && step.to <= $from.end();
};

const stepChangesHeadingStructure = (step: Step, docBefore: PMNode): boolean => {
	if (step instanceof ReplaceStep && stepOnlyChangesTextContent(step, docBefore)) {
		return false;
	}

	if (step instanceof ReplaceStep || step instanceof ReplaceAroundStep) {
		return (
			fragmentContainsHeading(step.slice.content) ||
			rangeTouchesHeadingBoundary(docBefore, step.from, step.to)
		);
	}

	if (step instanceof AttrStep && step.attr === 'level') {
		const node = docBefore.nodeAt(step.pos);
		return Boolean(node && isHeading(node));
	}

	return false;
};

/**
 * A transaction is structural when it can change heading order, count or levels. Local and
 * remote (collab) steps are treated the same.
 */
const transactionChangesHeadingStructure = (tr: ReadonlyTransaction): boolean =>
	tr.steps.some((step, index) => stepChangesHeadingStructure(step, tr.docs[index]));

enum NumberedHeadingsAction {
	Keep,
	Disable,
	Rebuild,
	Map,
}

/** Classifies cheaply before inspecting document steps. No action objects are allocated. */
const getAction = (
	tr: ReadonlyTransaction,
	state: NumberedHeadingsPluginState,
	api: ExtractInjectionAPI<InternalNumberedHeadingsPlugin> | undefined,
): NumberedHeadingsAction => {
	const change = api?.externalState.actions.getStateChange(tr, 'numberedHeadings');
	const requestedEnabled = change && Boolean(change.value?.enabled);
	if (change && requestedEnabled !== state.enabled) {
		return requestedEnabled ? NumberedHeadingsAction.Rebuild : NumberedHeadingsAction.Disable;
	}
	if (!state.enabled || !tr.docChanged) {
		return NumberedHeadingsAction.Keep;
	}
	if (transactionChangesHeadingStructure(tr)) {
		return NumberedHeadingsAction.Rebuild;
	}
	// Attribute/mark steps do not move headings, so avoid walking the decoration set.
	return tr.mapping.maps.every((map) => map === StepMap.empty)
		? NumberedHeadingsAction.Keep
		: NumberedHeadingsAction.Map;
};

const reduceNumberedHeadingsState = (
	state: NumberedHeadingsPluginState,
	action: NumberedHeadingsAction,
	tr: ReadonlyTransaction,
): NumberedHeadingsPluginState => {
	switch (action) {
		case NumberedHeadingsAction.Keep:
			return state;
		case NumberedHeadingsAction.Disable:
			return { enabled: false, decorations: DecorationSet.empty };
		case NumberedHeadingsAction.Rebuild:
			return { enabled: true, decorations: createDecorations(tr.doc) };
		case NumberedHeadingsAction.Map: {
			const decorations = state.decorations.map(tr.mapping, tr.doc);
			return decorations === state.decorations ? state : { enabled: true, decorations };
		}
	}
};

/**
 * Mirrors the `numberedHeadings.enabled` external state value and keeps the decorations for one editor
 * instance.
 */
export const createNumberedHeadingsPlugin = (
	api?: ExtractInjectionAPI<InternalNumberedHeadingsPlugin>,
): SafePlugin => {
	// The plugin's state is created right after the plugin, so both read the same initial setting.
	const initiallyEnabled = Boolean(
		api?.externalState.actions.getState('numberedHeadings')?.enabled,
	);

	return new SafePlugin<NumberedHeadingsPluginState>({
		key: numberedHeadingsPluginKey,
		state: {
			init: (_config, editorState) => ({
				enabled: initiallyEnabled,
				decorations: initiallyEnabled ? createDecorations(editorState.doc) : DecorationSet.empty,
			}),
			apply: (tr, pluginState) =>
				reduceNumberedHeadingsState(pluginState, getAction(tr, pluginState, api), tr),
		},
		props: {
			decorations: (state) => numberedHeadingsPluginKey.getState(state)?.decorations,
			// SSR renders once from the initial state, so the initial setting decides whether SSR needs
			// the heading node view. With numbering off, SSR HTML stays exactly as before.
			...(initiallyEnabled &&
				isSSR() && {
					nodeViews: { heading: createSSRHeadingNodeView(getHeadingAttrsAt) },
				}),
		},
	});
};
