import { closeHistory } from 'prosemirror-history';
import {
  Fragment,
  Mark,
  Node as PMNode,
  Schema,
  Slice,
} from 'prosemirror-model';
import {
  EditorState,
  Selection,
  TextSelection,
  NodeSelection,
  Transaction,
} from 'prosemirror-state';
import {
  findParentNodeOfType,
  hasParentNodeOfType,
  safeInsert,
} from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { Transform } from 'prosemirror-transform';

import { MentionAttributes } from '@atlaskit/adf-schema';
import { ExtensionAutoConvertHandler } from '@atlaskit/editor-common/extensions';
import { CardAdf, CardAppearance } from '@atlaskit/smart-card';

import { Command, CommandDispatch } from '../../types';
import { compose, insideTable, processRawValue } from '../../utils';
import { mapSlice } from '../../utils/slice';
import { InputMethodInsertMedia, INPUT_METHOD } from '../analytics';
import { insertCard, queueCardsFromChangedTr } from '../card/pm-plugins/doc';
import { CardOptions } from '../card/types';
import { GapCursorSelection, Side } from '../selection/gap-cursor-selection';
import { linkifyContent } from '../hyperlink/utils';
import { runMacroAutoConvert } from '../macro';
import { insertMediaAsMediaSingle } from '../media/utils/media-single';
import {
  pluginKey as textFormattingPluginKey,
  TextFormattingState,
} from '../text-formatting/pm-plugins/main';
import { replaceSelectedTable } from '../table/transforms/replace-table';

import {
  applyTextMarksToSlice,
  hasOnlyNodesOfType,
  isEmptyNode,
  isCursorSelectionAtTextStartOrEnd,
  isSelectionInsidePanel,
} from './util';
import { getFeatureFlags } from '../feature-flags-context';
import { isListNode } from '../lists-predictable/utils/node';

// remove text attribute from mention for copy/paste (GDPR)
export function handleMention(slice: Slice, schema: Schema): Slice {
  return mapSlice(slice, node => {
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

      (state.storedMarks || []).forEach(mark => {
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
          .then(cardData => {
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

    const newSlice = mapSlice(slice, maybeNode => {
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

export function insertSlice({ tr, slice }: { tr: Transaction; slice: Slice }) {
  const {
    selection,
    selection: { $to, $from, to, from },
  } = tr;
  const { $cursor } = selection as TextSelection;
  const panelNode = isSelectionInsidePanel(selection);
  const selectionIsInsideList = $from.blockRange($to, isListNode);

  // if pasting a list inside another list, ensure no empty list items get added
  const newRange = $from.blockRange($to);
  if (selectionIsInsideList && newRange) {
    const startPos = from;
    const endPos = $to.nodeAfter ? to : to + 2;
    const newSlice = tr.doc.slice(endPos, newRange.end);
    tr.deleteRange(startPos, newRange.end);
    const mapped = tr.mapping.map(startPos);
    tr.replaceRange(mapped, mapped, slice);
    if (newSlice.size <= 0) {
      return;
    }
    const newSelection = TextSelection.near(
      tr.doc.resolve(tr.mapping.map(mapped)),
      -1,
    );
    newSlice.openEnd = newSlice.openStart;
    tr.replaceRange(newSelection.from, newSelection.from, newSlice);
    return;
  }

  // if inside an empty panel, try and insert content inside it rather than replace it
  if (panelNode && isEmptyNode(panelNode) && $from.node() === $to.node()) {
    const { from: panelPosition } = selection;

    // if content of slice isn't valid for a panel node, insert slice after
    if (
      panelNode &&
      !panelNode.type.validContent(Fragment.from(slice.content))
    ) {
      const insertPosition = $to.pos + 2;
      tr.replaceRange(insertPosition, insertPosition, slice);
      tr.setSelection(
        TextSelection.near(
          tr.doc.resolve(insertPosition + slice.content.size),
          -1,
        ),
      );
      return;
    }

    const temporaryDoc = new Transform(tr.doc.type.createAndFill()!);
    temporaryDoc.replaceRange(0, temporaryDoc.doc.content.size, slice);
    const sliceWithoutInvalidListSurrounding = temporaryDoc.doc.slice(0);
    const newPanel = panelNode.copy(sliceWithoutInvalidListSurrounding.content);
    const panelNodeSelected =
      selection instanceof NodeSelection ? selection.node : null;

    const replaceFrom = panelNodeSelected
      ? panelPosition
      : tr.doc.resolve(panelPosition).start();
    const replaceTo = panelNodeSelected
      ? panelPosition + panelNodeSelected.nodeSize
      : replaceFrom;

    tr.replaceRangeWith(replaceFrom, replaceTo, newPanel);

    tr.setSelection(
      TextSelection.near(tr.doc.resolve($from.pos + newPanel.content.size), -1),
    );
  } else if ($cursor && isCursorSelectionAtTextStartOrEnd(selection)) {
    const position = Math.max($cursor.pos - 1, 0);

    if (isEmptyNode(tr.doc.resolve($cursor.pos).node())) {
      tr.replaceRange(position, $cursor.end(), slice);
    } else {
      const position = !$cursor.nodeBefore ? $from.before() : $from.after();
      tr.replaceRange(position, position, slice);
    }
    const startSlicePosition = tr.doc.resolve(
      Math.min(position + slice.size, tr.doc.content.size),
    );

    const newSlicePosition = Math.min(
      startSlicePosition.pos + slice.content.size - slice.openEnd,
      tr.doc.content.size,
    );
    const direction = -1;

    tr.setSelection(
      TextSelection.near(tr.doc.resolve(newSlicePosition), direction),
    );
  } else {
    tr.replaceSelection(slice);
  }
}

function isList(schema: Schema, node: PMNode | null | undefined) {
  const { bulletList, orderedList } = schema.nodes;
  return node && (node.type === bulletList || node.type === orderedList);
}

function flattenList(state: EditorState, node: PMNode, nodesArr: PMNode[]) {
  const { listItem } = state.schema.nodes;
  node.content.forEach(child => {
    if (
      isList(state.schema, child) ||
      (child.type === listItem && isList(state.schema, child.firstChild))
    ) {
      flattenList(state, child, nodesArr);
    } else {
      nodesArr.push(child);
    }
  });
}

function shouldFlattenList(state: EditorState, slice: Slice) {
  const node = slice.content.firstChild;
  return (
    node &&
    insideTable(state) &&
    isList(state.schema, node) &&
    slice.openStart > slice.openEnd
  );
}

function sliceHasAlignmentOrIndentationMarks(slice: Slice) {
  for (let i = 0; i < slice.content.childCount; i++) {
    const node = slice.content.child(i);
    const marks = node.marks.map(mark => mark.type.name);
    if (marks.includes('alignment') || marks.includes('indentation')) {
      return true;
    }
  }
  return false;
}

export function handleParagraphBlockMarks(state: EditorState, slice: Slice) {
  if (slice.content.size === 0) {
    return slice;
  }

  const {
    schema,
    selection: { $from },
  } = state;

  // If no paragraph in the slice contains alignment or indentation marks, there's no need
  // for special handling
  if (!sliceHasAlignmentOrIndentationMarks(slice)) {
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
  if (
    grandparent.type.allowsMarkType(schema.marks.alignment) ||
    grandparent.type.allowsMarkType(schema.marks.indentation)
  ) {
    // In a slice containing one or more paragraphs at the document level (not wrapped in
    // another node), the first paragraph will only have its text content captured and pasted
    // since openStart is 1. We decrement the open depth of the slice so it retains any block
    // marks applied to it. We only care about the depth at the start of the selection so
    // there's no need to change openEnd - the rest of the slice gets pasted correctly.
    const openStart = Math.max(0, slice.openStart - 1);
    return new Slice(slice.content, openStart, slice.openEnd);
  }

  // If the paragraph's parent node doesn't support alignment or indentation, drop those
  // marks from the slice
  return mapSlice(slice, node => {
    if (node.type === schema.nodes.paragraph) {
      return schema.nodes.paragraph.createChecked(
        undefined,
        node.content,
        node.marks.filter(
          mark =>
            mark.type.name !== 'alignment' && mark.type.name !== 'indentation',
        ),
      );
    }
    return node;
  });
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
    /**
     * ED-6300: When a nested list is pasted in a table cell and the slice has openStart > openEnd,
     * it splits the table. As a workaround, we flatten the list to even openStart and openEnd
     *
     *  Before:
     *  ul
     *    ┗━ li
     *      ┗━ ul
     *        ┗━ li
     *          ┗━ p -> "one"
     *    ┗━ li
     *      ┗━ p -> "two"
     *
     *  After:
     *  ul
     *    ┗━ li
     *      ┗━ p -> "one"
     *    ┗━ li
     *      ┗━p -> "two"
     */
    if (shouldFlattenList(state, slice) && slice.content.firstChild) {
      const node = slice.content.firstChild;
      const nodes: PMNode[] = [];
      flattenList(state, node, nodes);
      slice = new Slice(
        Fragment.from(node.type.createChecked(node.attrs, nodes)),
        slice.openEnd,
        slice.openEnd,
      );
    }

    closeHistory(tr);

    const featureFlags = getFeatureFlags(state);
    const allowPredictableLists = featureFlags && featureFlags.predictableLists;

    if (
      allowPredictableLists &&
      (isList(state.schema, slice.content.firstChild) ||
        isList(state.schema, slice.content.lastChild))
    ) {
      insertSlice({ tr, slice });
    } else {
      // if inside an empty panel, try and insert content inside it rather than replace it
      let panelParent = findParentNodeOfType(panel)(tr.selection);
      if (
        tr.selection.$from === tr.selection.$to &&
        panelParent &&
        !panelParent.node.textContent
      ) {
        tr = safeInsert(slice.content, tr.selection.$to.pos)(tr);
        // set selection to end of inserted content
        panelParent = findParentNodeOfType(panel)(tr.selection);
        if (panelParent) {
          tr.setSelection(
            TextSelection.near(
              tr.doc.resolve(panelParent.pos + panelParent.node.nodeSize),
            ),
          );
        }
      } else {
        tr.replaceSelection(slice);
      }
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
