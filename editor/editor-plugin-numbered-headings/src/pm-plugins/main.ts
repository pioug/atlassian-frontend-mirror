import {
	getHeadingNumbers,
	HEADING_NUMBER_ATTRIBUTE,
} from '@atlaskit/editor-common/numbered-headings';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Fragment, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import {
	AttrStep,
	ReplaceAroundStep,
	ReplaceStep,
	StepMap,
} from '@atlaskit/editor-prosemirror/transform';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

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
		headings.map(({ node, pos }, index) =>
			Decoration.node(pos, pos + node.nodeSize, { [HEADING_NUMBER_ATTRIBUTE]: numbers[index] }),
		),
	);
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
): NumberedHeadingsAction => {
	const requestedEnabled: unknown = tr.getMeta(numberedHeadingsPluginKey);
	if (typeof requestedEnabled === 'boolean' && requestedEnabled !== state.enabled) {
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

/** Keeps the numbering setting and decorations local to one editor instance. */
export const createNumberedHeadingsPlugin = (): SafePlugin =>
	new SafePlugin<NumberedHeadingsPluginState>({
		key: numberedHeadingsPluginKey,
		state: {
			init: () => ({
				enabled: false,
				decorations: DecorationSet.empty,
			}),
			apply: (tr, pluginState) =>
				reduceNumberedHeadingsState(pluginState, getAction(tr, pluginState), tr),
		},
		props: {
			decorations: (state) => numberedHeadingsPluginKey.getState(state)?.decorations,
		},
	});
