import {
  entireSelectionContainsMark,
  isMarkAllowedInRange,
  isMarkExcluded,
} from '@atlaskit/editor-common/mark';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';

const hasLinkMark = ($pos: ResolvedPos): boolean => {
  const {
    doc: {
      type: {
        schema: {
          marks: { link: linkMarkType },
        },
      },
    },
    pos,
  } = $pos;

  if (!linkMarkType) {
    return false;
  }

  return $pos.doc.rangeHasMark(
    pos,
    Math.min(pos + 1, $pos.doc.content.size),
    linkMarkType,
  );
};

const hasHighlightMark = ($pos: ResolvedPos): boolean => {
  const {
    doc: {
      type: {
        schema: {
          marks: { backgroundColor: highlightMarkType },
        },
      },
    },
  } = $pos;

  if (!highlightMarkType) {
    return false;
  }
  const node = $pos.nodeBefore;
  if (!node) {
    return false;
  }
  return !!highlightMarkType.isInSet(node.marks);
};

const hasHighlightMarkInRange = (
  $from: ResolvedPos,
  $to: ResolvedPos,
): boolean => {
  const {
    doc: {
      type: {
        schema: {
          marks: { backgroundColor: highlightMarkType },
        },
      },
    },
    pos,
    doc,
  } = $from;
  if (!highlightMarkType) {
    return false;
  }
  return entireSelectionContainsMark(highlightMarkType, doc, pos, $to.pos);
};

export const getDisabledState = (state: EditorState): boolean => {
  const { textColor } = state.schema.marks;
  if (textColor) {
    const { empty, ranges, $cursor, $from, $to } =
      state.selection as TextSelection;
    if (
      (empty && !$cursor) ||
      ($cursor && hasLinkMark($cursor)) ||
      ($cursor && hasHighlightMark($cursor)) ||
      (!$cursor && $from && $to && hasHighlightMarkInRange($from, $to)) ||
      isMarkAllowedInRange(state.doc, ranges, textColor) === false
    ) {
      return true;
    }

    if (
      isMarkExcluded(
        textColor,
        state.storedMarks || ($cursor && $cursor.marks()),
      )
    ) {
      return true;
    }

    return false;
  }

  return true;
};
