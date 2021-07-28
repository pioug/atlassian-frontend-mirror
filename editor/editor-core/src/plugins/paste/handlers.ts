import { closeHistory } from 'prosemirror-history';
import {
  Fragment,
  Mark,
  MarkType,
  Node as PMNode,
  Schema,
  Slice,
} from 'prosemirror-model';
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import {
  findParentNodeOfType,
  hasParentNodeOfType,
  safeInsert,
} from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';

import { MentionAttributes } from '@atlaskit/adf-schema';
import { ExtensionAutoConvertHandler } from '@atlaskit/editor-common/extensions';
import { CardAdf, CardAppearance } from '@atlaskit/smart-card';

import { Command, CommandDispatch } from '../../types';
import {
  compose,
  insideTable,
  isParagraph,
  isText,
  isLinkMark,
  processRawValue,
} from '../../utils';
import { mapSlice } from '../../utils/slice';
import { InputMethodInsertMedia, INPUT_METHOD } from '../analytics';
import { insertCard, queueCardsFromChangedTr } from '../card/pm-plugins/doc';
import { CardOptions } from '@atlaskit/editor-common';
import { GapCursorSelection, Side } from '../selection/gap-cursor-selection';
import { linkifyContent } from '../hyperlink/utils';
import { runMacroAutoConvert } from '../macro';
import { insertMediaAsMediaSingle } from '../media/utils/media-single';
import {
  pluginKey as textFormattingPluginKey,
  TextFormattingState,
} from '../text-formatting/pm-plugins/main';
import { replaceSelectedTable } from '../table/transforms/replace-table';

import { applyTextMarksToSlice, hasOnlyNodesOfType } from './util';
import { isListNode, isListItemNode } from '../list/utils/node';
import { canLinkBeCreatedInRange } from '../hyperlink/pm-plugins/main';

import { insertSliceForLists } from './edge-cases';

// remove text attribute from mention for copy/paste (GDPR)
export function handleMention(slice: Slice, schema: Schema): Slice {
  return mapSlice(slice, (node) => {
    if (node.type.name === schema.nodes.mention.name) {
      const mention = node.attrs as MentionAttributes;
      const newMention = { ...mention, text: '' };
      return schema.nodes.mention.create(newMention, node.content, node.marks);
    }
    return node;
  });
}

export function handlePasteIntoTaskAndDecision(slice: Slice): Command {
  return (state: EditorState, dispatch?: CommandDispatch): boolean => {
    const {
      schema,
      tr: { selection },
    } = state;

    const {
      marks: { code: codeMark },
      nodes: {
        decisionItem,
        decisionList,
        emoji,
        hardBreak,
        mention,
        paragraph,
        taskList,
        taskItem,
        text,
      },
    } = schema;

    if (
      !decisionItem ||
      !decisionList ||
      !taskList ||
      !taskItem ||
      !hasParentNodeOfType([decisionItem, taskItem])(state.selection)
    ) {
      return false;
    }

    type Fn = (slice: Slice) => Slice;
    const filters: [Fn, ...Array<Fn>] = [linkifyContent(schema)];

    const selectionMarks = selection.$head.marks();

    const textFormattingState: TextFormattingState = textFormattingPluginKey.getState(
      state,
    );

    if (
      selection instanceof TextSelection &&
      Array.isArray(selectionMarks) &&
      selectionMarks.length > 0 &&
      hasOnlyNodesOfType(paragraph, text, emoji, mention, hardBreak)(slice) &&
      (!codeMark.isInSet(selectionMarks) || textFormattingState.codeActive) // for codeMarks let's make sure mark is active
    ) {
      filters.push(applyTextMarksToSlice(schema, selection.$head.marks()));
    }

    const transformedSlice = compose.apply(null, filters)(slice);

    const tr = closeHistory(state.tr)
      .replaceSelection(transformedSlice)
      .scrollIntoView();

    queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

// If we paste a link onto some selected text, apply the link as a mark
export function handlePasteLinkOnSelectedText(slice: Slice): Command {
  return (state, dispatch) => {
    const {
      schema,
      selection,
      selection: { from, to },
      tr,
    } = state;
    let linkMark;

    // check if we have a link on the clipboard
    if (
      slice.content.childCount === 1 &&
      isParagraph(slice.content.child(0), schema)
    ) {
      const paragraph = slice.content.child(0);
      if (
        paragraph.content.childCount === 1 &&
        isText(paragraph.content.child(0), schema)
      ) {
        const text = paragraph.content.child(0);
        linkMark = text.marks.find(
          (mark) => isLinkMark(mark, schema) && mark.attrs.href === text.text,
        );
      }
    }

    // if we have a link, apply it to the selected text if we have any and it's allowed
    if (
      linkMark &&
      selection instanceof TextSelection &&
      !selection.empty &&
      canLinkBeCreatedInRange(from, to)(state)
    ) {
      tr.addMark(from, to, linkMark);
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };
}

export function handlePasteAsPlainText(
  slice: Slice,
  _event: ClipboardEvent,
): Command {
  return (state: EditorState, dispatch?, view?: EditorView): boolean => {
    // In case of SHIFT+CMD+V ("Paste and Match Style") we don't want to run the usual
    // fuzzy matching of content. ProseMirror already handles this scenario and will
    // provide us with slice containing paragraphs with plain text, which we decorate
    // with "stored marks".
    // @see prosemirror-view/src/clipboard.js:parseFromClipboard()).
    // @see prosemirror-view/src/input.js:doPaste().
    if (view && (view as any).shiftKey) {
      let tr = closeHistory(state.tr);
      const { selection } = tr;

      // <- using the same internal flag that prosemirror-view is using

      // if user has selected table we need custom logic to replace the table
      tr = replaceSelectedTable(state, slice, INPUT_METHOD.CLIPBOARD);
      // otherwise just replace the selection
      if (!tr.docChanged) {
        tr.replaceSelection(slice);
      }

      (state.storedMarks || []).forEach((mark) => {
        tr.addMark(selection.from, selection.from + slice.size, mark);
      });
      tr.scrollIntoView();
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }
    return false;
  };
}

export function handlePastePreservingMarks(slice: Slice): Command {
  return (state: EditorState, dispatch?): boolean => {
    const {
      schema,
      tr: { selection },
    } = state;

    const {
      marks: { code: codeMark, link: linkMark },
      nodes: {
        bulletList,
        emoji,
        hardBreak,
        heading,
        listItem,
        mention,
        orderedList,
        paragraph,
        text,
      },
    } = schema;

    if (!(selection instanceof TextSelection)) {
      return false;
    }

    const selectionMarks = selection.$head.marks();
    if (selectionMarks.length === 0) {
      return false;
    }

    const textFormattingState: TextFormattingState = textFormattingPluginKey.getState(
      state,
    );

    // special case for codeMark: will preserve mark only if codeMark is currently active
    // won't preserve mark if cursor is on the edge on the mark (namely inactive)
    if (codeMark.isInSet(selectionMarks) && !textFormattingState.codeActive) {
      return false;
    }

    const isPlainTextSlice =
      slice.content.childCount === 1 &&
      slice.content.firstChild!.type === paragraph &&
      slice.content.firstChild!.content.childCount === 1 &&
      slice.content.firstChild!.firstChild!.type === text;

    // special case for plainTextSlice & linkMark: merge into existing link
    if (
      isPlainTextSlice &&
      linkMark.isInSet(selectionMarks) &&
      selectionMarks.length === 1
    ) {
      const tr = closeHistory(state.tr)
        .replaceSelectionWith(slice.content.firstChild!.firstChild!, true)
        .setStoredMarks(selectionMarks)
        .scrollIntoView();

      queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    // if the pasted data is one of the node types below
    // we apply current selection marks to the pasted slice
    if (
      hasOnlyNodesOfType(
        bulletList,
        hardBreak,
        heading,
        listItem,
        paragraph,
        text,
        emoji,
        mention,
        orderedList,
      )(slice)
    ) {
      const transformedSlice = applyTextMarksToSlice(
        schema,
        selectionMarks,
      )(slice);

      const tr = closeHistory(state.tr)
        .replaceSelection(transformedSlice)
        .setStoredMarks(selectionMarks)
        .scrollIntoView();

      queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };
}

async function isLinkSmart(
  text: string,
  type: CardAppearance,
  cardOptions: CardOptions,
): Promise<CardAdf> {
  if (!cardOptions.provider) {
    throw Error('No card provider found');
  }
  const provider = await cardOptions.provider;
  return await provider.resolve(text, type);
}

function insertAutoMacro(
  slice: Slice,
  macro: PMNode,
  view?: EditorView,
): boolean {
  if (view) {
    // insert the text or linkified/md-converted clipboard data
    const selection = view.state.tr.selection;

    const tr = view.state.tr.replaceSelection(slice);
    const before = tr.mapping.map(selection.from, -1);
    view.dispatch(tr);

    // replace the text with the macro as a separate transaction
    // so the autoconversion generates 2 undo steps
    view.dispatch(
      closeHistory(view.state.tr)
        .replaceRangeWith(before, before + slice.size, macro)
        .scrollIntoView(),
    );
    return true;
  }
  return false;
}

export function handleMacroAutoConvert(
  text: string,
  slice: Slice,
  cardsOptions?: CardOptions,
  extensionAutoConverter?: ExtensionAutoConvertHandler,
): Command {
  return (
    state: EditorState,
    _dispatch?: CommandDispatch,
    view?: EditorView,
  ) => {
    let macro: PMNode | null = null;

    // try to use auto convert from extension provider first
    if (extensionAutoConverter) {
      const extension = extensionAutoConverter(text);
      if (extension) {
        macro = PMNode.fromJSON(state.schema, extension);
      }
    }

    // then try from macro provider (which will be removed some time in the future)
    if (!macro) {
      macro = runMacroAutoConvert(state, text);
    }

    if (macro) {
      /**
       * if FF enabled, run through smart links and check for result
       */
      if (
        cardsOptions &&
        cardsOptions.resolveBeforeMacros &&
        cardsOptions.resolveBeforeMacros.length
      ) {
        if (
          cardsOptions.resolveBeforeMacros.indexOf(macro.attrs.extensionKey) < 0
        ) {
          return insertAutoMacro(slice, macro, view);
        }

        isLinkSmart(text, 'inline', cardsOptions)
          .then((cardData) => {
            if (!view) {
              throw new Error('Missing view');
            }

            const { schema, tr } = view.state;
            const cardAdf = processRawValue(schema, cardData);

            if (!cardAdf) {
              throw new Error('Received invalid ADF from CardProvider');
            }

            view.dispatch(insertCard(tr, cardAdf, schema));
          })
          .catch(() => insertAutoMacro(slice, macro as PMNode, view));
        return true;
      }

      return insertAutoMacro(slice, macro, view);
    }
    return !!macro;
  };
}

export function handleCodeBlock(text: string): Command {
  return (state, dispatch) => {
    const { codeBlock } = state.schema.nodes;
    if (text && hasParentNodeOfType(codeBlock)(state.selection)) {
      const tr = closeHistory(state.tr);
      tr.scrollIntoView();
      if (dispatch) {
        dispatch(tr.insertText(text));
      }
      return true;
    }
    return false;
  };
}

function isOnlyMedia(state: EditorState, slice: Slice) {
  const { media } = state.schema.nodes;
  return (
    slice.content.childCount === 1 && slice.content.firstChild!.type === media
  );
}

function isOnlyMediaSingle(state: EditorState, slice: Slice) {
  const { mediaSingle } = state.schema.nodes;
  return (
    mediaSingle &&
    slice.content.childCount === 1 &&
    slice.content.firstChild!.type === mediaSingle
  );
}

export function handleMediaSingle(inputMethod: InputMethodInsertMedia) {
  return function (slice: Slice): Command {
    return (state, dispatch, view) => {
      if (view) {
        if (isOnlyMedia(state, slice)) {
          return insertMediaAsMediaSingle(
            view,
            slice.content.firstChild!,
            inputMethod,
          );
        }

        if (insideTable(state) && isOnlyMediaSingle(state, slice)) {
          const tr = state.tr.replaceSelection(slice);
          const nextPos = tr.doc.resolve(
            tr.mapping.map(state.selection.$from.pos),
          );
          if (dispatch) {
            dispatch(
              tr.setSelection(new GapCursorSelection(nextPos, Side.RIGHT)),
            );
          }
          return true;
        }
      }
      return false;
    };
  };
}

export function handleExpand(slice: Slice): Command {
  return (state, dispatch) => {
    if (!insideTable(state)) {
      return false;
    }

    const { expand, nestedExpand } = state.schema.nodes;
    let { tr } = state;
    let hasExpand = false;

    const newSlice = mapSlice(slice, (maybeNode) => {
      if (maybeNode.type === expand) {
        hasExpand = true;
        try {
          return nestedExpand.createChecked(
            maybeNode.attrs,
            maybeNode.content,
            maybeNode.marks,
          );
        } catch (e) {
          tr = safeInsert(maybeNode, tr.selection.$to.pos)(tr);
          return Fragment.empty;
        }
      }
      return maybeNode;
    });

    if (hasExpand && dispatch) {
      // If the slice is a subset, we can let PM replace the selection
      // it will insert as text where it can't place the node.
      // Otherwise we use safeInsert to insert below instead of
      // replacing/splitting the current node.
      if (slice.openStart > 1 && slice.openEnd > 1) {
        dispatch(tr.replaceSelection(newSlice));
      } else {
        dispatch(safeInsert(newSlice.content)(tr));
      }
      return true;
    }

    return false;
  };
}

export function handleMarkdown(markdownSlice: Slice): Command {
  return (state, dispatch) => {
    const tr = closeHistory(state.tr);
    tr.replaceSelection(markdownSlice);

    queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD);
    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }
    return true;
  };
}

function removePrecedingBackTick(tr: Transaction) {
  const {
    $from: { nodeBefore },
    from,
  } = tr.selection;
  if (nodeBefore && nodeBefore.isText && nodeBefore.text!.endsWith('`')) {
    tr.delete(from - 1, from);
  }
}

function hasInlineCode(state: EditorState, slice: Slice) {
  return (
    slice.content.firstChild &&
    slice.content.firstChild.marks.some(
      (m: Mark) => m.type === state.schema.marks.code,
    )
  );
}

function rollupLeafListItems(list: PMNode, leafListItems: PMNode[]) {
  list.content.forEach((child) => {
    if (
      isListNode(child) ||
      (isListItemNode(child) && isListNode(child.firstChild))
    ) {
      rollupLeafListItems(child, leafListItems);
    } else {
      leafListItems.push(child);
    }
  });
}

function shouldFlattenList(state: EditorState, slice: Slice) {
  const node = slice.content.firstChild;
  return (
    node &&
    insideTable(state) &&
    isListNode(node) &&
    slice.openStart > slice.openEnd
  );
}

function sliceHasTopLevelMarks(slice: Slice) {
  let hasTopLevelMarks = false;
  slice.content.descendants((node) => {
    if (node.marks.length > 0) {
      hasTopLevelMarks = true;
    }
    return false;
  });
  return hasTopLevelMarks;
}

function getTopLevelMarkTypesInSlice(slice: Slice) {
  const markTypes = new Set<MarkType>();
  slice.content.descendants((node) => {
    node.marks
      .map((mark) => mark.type)
      .forEach((markType) => markTypes.add(markType));
    return false;
  });
  return markTypes;
}

export function handleParagraphBlockMarks(state: EditorState, slice: Slice) {
  if (slice.content.size === 0) {
    return slice;
  }

  const {
    schema,
    selection: { $from },
  } = state;

  // If no paragraph in the slice contains marks, there's no need for special handling
  // Note: this doesn't check for marks applied to lower level nodes such as text
  if (!sliceHasTopLevelMarks(slice)) {
    return slice;
  }

  // If pasting a single paragraph into pre-existing content, match destination formatting
  const destinationHasContent = $from.parent.textContent.length > 0;
  if (slice.content.childCount === 1 && destinationHasContent) {
    return slice;
  }

  // Check the parent of (paragraph -> text) because block marks are assigned to a wrapper
  // element around the paragraph node
  const grandparent = $from.node(Math.max(0, $from.depth - 1));
  const markTypesInSlice = getTopLevelMarkTypesInSlice(slice);
  let forbiddenMarkTypes: MarkType[] = [];
  for (let markType of markTypesInSlice) {
    if (!grandparent.type.allowsMarkType(markType)) {
      forbiddenMarkTypes.push(markType);
    }
  }

  if (forbiddenMarkTypes.length === 0) {
    // In a slice containing one or more paragraphs at the document level (not wrapped in
    // another node), the first paragraph will only have its text content captured and pasted
    // since openStart is 1. We decrement the open depth of the slice so it retains any block
    // marks applied to it. We only care about the depth at the start of the selection so
    // there's no need to change openEnd - the rest of the slice gets pasted correctly.
    const openStart = Math.max(0, slice.openStart - 1);
    return new Slice(slice.content, openStart, slice.openEnd);
  }

  // If the paragraph contains marks forbidden by the parent node (e.g. alignment/indentation),
  // drop those marks from the slice
  return mapSlice(slice, (node) => {
    if (node.type === schema.nodes.paragraph) {
      return schema.nodes.paragraph.createChecked(
        undefined,
        node.content,
        node.marks.filter((mark) => !forbiddenMarkTypes.includes(mark.type)),
      );
    }
    return node;
  });
}

/**
 * ED-6300: When a nested list is pasted in a table cell and the slice has openStart > openEnd,
 * it splits the table. As a workaround, we flatten the list to even openStart and openEnd.
 *
 * Note: this only happens if the first child is a list
 *
 * Example: copying "one" and "two"
 * - zero
 *   - one
 * - two
 *
 * Before:
 * ul
 *   ┗━ li
 *     ┗━ ul
 *       ┗━ li
 *         ┗━ p -> "one"
 *   ┗━ li
 *     ┗━ p -> "two"
 *
 * After:
 * ul
 *   ┗━ li
 *     ┗━ p -> "one"
 *   ┗━ li
 *     ┗━p -> "two"
 */
export function flattenNestedListInSlice(slice: Slice) {
  if (!slice.content.firstChild) {
    return slice;
  }

  const listToFlatten = slice.content.firstChild;
  const leafListItems: PMNode[] = [];
  rollupLeafListItems(listToFlatten, leafListItems);

  const contentWithFlattenedList = slice.content.replaceChild(
    0,
    listToFlatten.type.createChecked(listToFlatten.attrs, leafListItems),
  );
  return new Slice(contentWithFlattenedList, slice.openEnd, slice.openEnd);
}

export function insertIntoPanel(tr: Transaction, slice: Slice, panel: any) {
  let panelParentOverCurrentSelection = findParentNodeOfType(panel)(
    tr.selection,
  );
  if (
    tr.selection.$from === tr.selection.$to &&
    panelParentOverCurrentSelection &&
    !panelParentOverCurrentSelection.node.textContent
  ) {
    tr = safeInsert(slice.content, tr.selection.$to.pos)(tr);
    // set selection to end of inserted content
    const panelNode = findParentNodeOfType(panel)(tr.selection);
    if (panelNode) {
      tr.setSelection(
        TextSelection.near(
          tr.doc.resolve(panelNode.pos + panelNode.node.nodeSize),
        ),
      );
    }
  } else {
    tr.replaceSelection(slice);
  }
}

export function handleRichText(slice: Slice): Command {
  return (state, dispatch) => {
    const { codeBlock, panel } = state.schema.nodes;
    // In case user is pasting inline code,
    // any backtick ` immediately preceding it should be removed.
    let tr = state.tr;
    if (hasInlineCode(state, slice)) {
      removePrecedingBackTick(tr);
    }

    if (shouldFlattenList(state, slice)) {
      slice = flattenNestedListInSlice(slice);
    }

    closeHistory(tr);

    let panelParentOverCurrentSelection = findParentNodeOfType(panel)(
      tr.selection,
    );

    const isFirstChildListNode = isListNode(slice.content.firstChild);
    const isLastChildListNode = isListNode(slice.content.lastChild);
    const isSliceContentListNodes = isFirstChildListNode || isLastChildListNode;
    const isTargetPanelEmpty =
      panelParentOverCurrentSelection &&
      panelParentOverCurrentSelection.node?.content.size === 2;

    if (isSliceContentListNodes || isTargetPanelEmpty) {
      insertSliceForLists({ tr, slice });
    } else {
      // if inside an empty panel, try and insert content inside it rather than replace it
      insertIntoPanel(tr, slice, panel);
    }

    tr.setStoredMarks([]);
    if (tr.selection.empty && tr.selection.$from.parent.type === codeBlock) {
      tr.setSelection(TextSelection.near(tr.selection.$from, 1) as Selection);
    }
    tr.scrollIntoView();

    // queue link cards, ignoring any errors
    if (dispatch) {
      dispatch(queueCardsFromChangedTr(state, tr, INPUT_METHOD.CLIPBOARD));
    }
    return true;
  };
}

export const handleSelectedTable = (slice: Slice): Command => (
  state,
  dispatch,
) => {
  const tr = replaceSelectedTable(state, slice, INPUT_METHOD.CLIPBOARD);
  if (tr.docChanged) {
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  }
  return false;
};
