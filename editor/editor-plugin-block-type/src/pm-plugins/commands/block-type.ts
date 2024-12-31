import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type {
	Command,
	EditorCommand,
	HeadingLevelsAndNormalText,
} from '@atlaskit/editor-common/types';
import { filterChildrenBetween, wrapSelectionIn } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Slice, Fragment } from '@atlaskit/editor-prosemirror/model';
import type { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables';

import type { TextBlockTypes } from '../block-types';
import { HEADINGS_BY_NAME, NORMAL_TEXT } from '../block-types';

import {
	FORMATTING_NODE_TYPES,
	FORMATTING_MARK_TYPES,
	cellSelectionNodesBetween,
	formatTypes,
	clearNodeFormattingOnSelection,
} from './clear-formatting';
import { wrapSelectionInBlockType } from './wrapSelectionIn';

export type InputMethod =
	| INPUT_METHOD.TOOLBAR
	| INPUT_METHOD.INSERT_MENU
	| INPUT_METHOD.SHORTCUT
	| INPUT_METHOD.FORMATTING
	| INPUT_METHOD.KEYBOARD
	| INPUT_METHOD.FLOATING_TB;

export type ClearFormattingInputMethod =
	| INPUT_METHOD.TOOLBAR
	| INPUT_METHOD.SHORTCUT
	| INPUT_METHOD.FLOATING_TB;

export function setBlockType(name: TextBlockTypes): EditorCommand {
	return ({ tr }) => {
		const { nodes } = tr.doc.type.schema;
		if (name === NORMAL_TEXT.name && nodes.paragraph) {
			return setNormalText()({ tr });
		}

		const headingBlockType = HEADINGS_BY_NAME[name];
		if (headingBlockType && nodes.heading && headingBlockType.level) {
			return setHeading(headingBlockType.level)({ tr });
		}

		return null;
	};
}

export function setHeading(
	level: HeadingLevelsAndNormalText,
	fromBlockQuote?: boolean,
): EditorCommand {
	return function ({ tr }) {
		const {
			selection,
			doc: {
				type: { schema },
			},
		} = tr;
		const ranges = selection instanceof CellSelection ? selection.ranges : [selection];
		ranges.forEach(({ $from, $to }) => {
			if (fromBlockQuote) {
				const range = $from.blockRange($to);
				if (!range) {
					return;
				}

				const content = $from.node().content;

				const headingNode = schema.nodes.heading.createChecked(
					{
						level,
					},
					content,
				);

				const slice = new Slice(Fragment.from(headingNode), 0, 0);
				tr.replaceRange(range.start, range.end, slice);
			} else {
				tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, {
					level,
				});
			}
		});

		return tr;
	};
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
export function setBlockTypeWithAnalytics(
	name: TextBlockTypes,
	inputMethod: InputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	fromBlockQuote?: boolean,
): EditorCommand {
	return ({ tr }) => {
		const { nodes } = tr.doc.type.schema;
		if (name === 'normal' && nodes.paragraph) {
			return setNormalTextWithAnalytics(inputMethod, editorAnalyticsApi, fromBlockQuote)({ tr });
		}

		const headingBlockType = HEADINGS_BY_NAME[name];
		if (headingBlockType && nodes.heading && headingBlockType.level) {
			return setHeadingWithAnalytics(
				headingBlockType.level,
				inputMethod,
				editorAnalyticsApi,
				fromBlockQuote,
			)({ tr });
		}

		return null;
	};
}

export function setNormalText(fromBlockQuote?: boolean): EditorCommand {
	return function ({ tr }) {
		const {
			selection,
			doc: {
				type: { schema },
			},
		} = tr;
		const ranges = selection instanceof CellSelection ? selection.ranges : [selection];
		ranges.forEach(({ $from, $to }) => {
			if (fromBlockQuote) {
				const range = $from.blockRange($to);
				if (!range) {
					return;
				}
				tr.lift(range, 0);
			} else {
				tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph);
			}
		});

		return tr;
	};
}

export function clearFormatting(
	inputMethod: ClearFormattingInputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): EditorCommand {
	return function ({ tr }) {
		const formattingCleared: string[] = [];
		const schema = tr.doc.type.schema;

		FORMATTING_MARK_TYPES.forEach((mark) => {
			const { from, to } = tr.selection;
			const markType = schema.marks[mark];

			if (!markType) {
				return;
			}

			if (tr.selection instanceof CellSelection) {
				cellSelectionNodesBetween(tr.selection, tr.doc, (node, pos): boolean => {
					const isTableCell =
						node.type === schema.nodes.tableCell || node.type === schema.nodes.tableHeader;

					if (!isTableCell) {
						return true;
					}

					if (tr.doc.rangeHasMark(pos, pos + node.nodeSize, markType)) {
						formattingCleared.push(formatTypes[mark]);
						tr.removeMark(pos, pos + node.nodeSize, markType);
					}

					return false;
				});
			} else if (tr.doc.rangeHasMark(from, to, markType)) {
				formattingCleared.push(formatTypes[mark]);
				tr.removeMark(from, to, markType);
			}
		});

		FORMATTING_NODE_TYPES.forEach((nodeName) => {
			const formattedNodeType = schema.nodes[nodeName];
			const { $from, $to } = tr.selection;
			if (tr.selection instanceof CellSelection) {
				cellSelectionNodesBetween(
					tr.selection,
					tr.doc,
					clearNodeFormattingOnSelection(
						schema,
						tr,
						formattedNodeType,
						nodeName,
						formattingCleared,
					),
				);
			} else {
				tr.doc.nodesBetween(
					$from.pos,
					$to.pos,
					clearNodeFormattingOnSelection(
						schema,
						tr,
						formattedNodeType,
						nodeName,
						formattingCleared,
					),
				);
			}
		});

		tr.setStoredMarks([]);

		if (formattingCleared.length) {
			editorAnalyticsApi?.attachAnalyticsEvent({
				action: ACTION.FORMATTED,
				eventType: EVENT_TYPE.TRACK,
				actionSubject: ACTION_SUBJECT.TEXT,
				actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CLEAR,
				attributes: {
					inputMethod,
					formattingCleared,
					dropdownMenu: 'textStyle',
				},
			})(tr);
		}

		return tr;
	};
}

function withCurrentHeadingLevel(
	fn: (level?: HeadingLevelsAndNormalText) => EditorCommand,
): EditorCommand {
	return ({ tr }) => {
		// Find all headings and paragraphs of text
		const { heading, paragraph } = tr.doc.type.schema.nodes;
		const nodes = filterChildrenBetween(
			tr.doc,
			tr.selection.from,
			tr.selection.to,
			(node: PMNode) => {
				return node.type === heading || node.type === paragraph;
			},
		);

		// Check each paragraph and/or heading and check for consistent level
		let level: undefined | HeadingLevelsAndNormalText;
		for (const node of nodes) {
			const nodeLevel = node.node.type === heading ? node.node.attrs.level : 0;
			if (!level) {
				level = nodeLevel;
			} else if (nodeLevel !== level) {
				// Conflict in level, therefore inconsistent and undefined
				level = undefined;
				break;
			}
		}

		return fn(level)({ tr });
	};
}

export function setNormalTextWithAnalytics(
	inputMethod: InputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	fromBlockQuote?: boolean,
): EditorCommand {
	return withCurrentHeadingLevel((previousHeadingLevel) => ({ tr }) => {
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			eventType: EVENT_TYPE.TRACK,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
			attributes: {
				inputMethod,
				newHeadingLevel: 0,
				previousHeadingLevel,
			},
		})(tr);
		return setNormalText(fromBlockQuote)({ tr });
	});
}

export const setHeadingWithAnalytics = (
	newHeadingLevel: HeadingLevelsAndNormalText,
	inputMethod: InputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
	fromBlockQuote?: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	return withCurrentHeadingLevel((previousHeadingLevel) => ({ tr }) => {
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			eventType: EVENT_TYPE.TRACK,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
			attributes: {
				inputMethod,
				newHeadingLevel,
				previousHeadingLevel,
			},
		})(tr);
		return setHeading(newHeadingLevel, fromBlockQuote)({ tr });
	});
};

function insertBlockQuote(): Command {
	return function (state, dispatch) {
		const { nodes } = state.schema;

		if (nodes.paragraph && nodes.blockquote) {
			return wrapSelectionIn(nodes.blockquote)(state, dispatch);
		}

		return false;
	};
}

/**
 *
 * @param name - block type name
 * @param inputMethod - input method
 * @param editorAnalyticsApi - analytics api, undefined if not available either because it failed to load or wasn't added
 * otherwise Editor becomes very sad and crashes
 * @returns - command that inserts block type
 */
export const insertBlockQuoteWithAnalytics = (
	inputMethod: InputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
	return withAnalytics(editorAnalyticsApi, {
		action: ACTION.FORMATTED,
		actionSubject: ACTION_SUBJECT.TEXT,
		eventType: EVENT_TYPE.TRACK,
		actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
		attributes: {
			inputMethod: inputMethod,
		},
	})(insertBlockQuote());
};

export function insertBlockQuoteWithAnalyticsCommand(
	inputMethod: InputMethod,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): EditorCommand {
	return withCurrentHeadingLevel((previousHeadingLevel) => ({ tr }) => {
		const { nodes } = tr.doc.type.schema;
		editorAnalyticsApi?.attachAnalyticsEvent({
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			eventType: EVENT_TYPE.TRACK,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
			attributes: {
				inputMethod: inputMethod,
			},
		})(tr);

		return wrapSelectionInBlockType(nodes.blockquote)({ tr });
	});
}

export const cleanUpAtTheStartOfDocument: Command = (state, dispatch) => {
	const { $cursor } = state.selection as TextSelection;
	if ($cursor && !$cursor.nodeBefore && !$cursor.nodeAfter && $cursor.pos === 1) {
		const { tr, schema } = state;
		const { paragraph } = schema.nodes;
		const { parent } = $cursor;

		/**
		 * Use cases:
		 * 1. Change `heading` to `paragraph`
		 * 2. Remove block marks
		 *
		 * NOTE: We already know it's an empty doc so it's safe to use 0
		 */
		tr.setNodeMarkup(0, paragraph, parent.attrs, []);
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	}
	return false;
};
