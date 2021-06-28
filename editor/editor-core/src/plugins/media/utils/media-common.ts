import { deleteSelection, splitBlock } from 'prosemirror-commands';
import {
  Node as PMNode,
  ResolvedPos,
  Fragment,
  Slice,
  Schema,
} from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { findPositionOfNodeBefore } from 'prosemirror-utils';
import {
  createParagraphNear,
  createNewParagraphBelow,
} from '../../../commands';
import { isTemporary } from '../../../utils';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import { MediaState } from '../types';
import { mapSlice } from '../../../utils/slice';
import {
  walkUpTreeUntil,
  removeNestedEmptyEls,
  unwrap,
} from '../../../utils/dom';
import { isImage } from './is-image';
import {
  atTheBeginningOfBlock,
  atTheBeginningOfDoc,
  atTheEndOfBlock,
  endPositionOfParent,
  startPositionOfParent,
} from '../../../utils/prosemirror/position';
import { GapCursorSelection } from '../../selection/gap-cursor/selection';
import { MediaADFAttrs } from '@atlaskit/adf-schema';
import { isMediaBlobUrl } from '@atlaskit/media-client';

export const isMediaBlobUrlFromAttrs = (attrs: MediaADFAttrs): boolean => {
  return !!(attrs && attrs.type === 'external' && isMediaBlobUrl(attrs.url));
};

export const posOfMediaGroupNearby = (
  state: EditorState,
): number | undefined => {
  return (
    posOfParentMediaGroup(state) ||
    posOfFollowingMediaGroup(state) ||
    posOfPrecedingMediaGroup(state) ||
    posOfMediaGroupNextToGapCursor(state)
  );
};

export const isSelectionNonMediaBlockNode = (state: EditorState): boolean => {
  const { node } = state.selection as NodeSelection;

  return node && node.type !== state.schema.nodes.media && node.isBlock;
};

export const isSelectionMediaSingleNode = (state: EditorState): boolean => {
  const { node } = state.selection as NodeSelection;

  return node && node.type === state.schema.nodes.mediaSingle;
};

export const posOfPrecedingMediaGroup = (
  state: EditorState,
): number | undefined => {
  if (!atTheBeginningOfBlock(state)) {
    return;
  }

  return posOfMediaGroupAbove(state, state.selection.$from);
};

const posOfMediaGroupNextToGapCursor = (
  state: EditorState,
): number | undefined => {
  const { selection } = state;

  if (selection instanceof GapCursorSelection) {
    const $pos = state.selection.$from;
    const mediaGroupType = state.schema.nodes.mediaGroup;
    return (
      posOfImmediatePrecedingMediaGroup($pos, mediaGroupType) ||
      posOfImmediateFollowingMediaGroup($pos, mediaGroupType)
    );
  }
};

const posOfImmediatePrecedingMediaGroup = (
  $pos: ResolvedPos,
  mediaGroupType: any,
): number | undefined => {
  if ($pos.nodeBefore && $pos.nodeBefore.type === mediaGroupType) {
    return $pos.pos - $pos.nodeBefore.nodeSize + 1;
  }
};

const posOfImmediateFollowingMediaGroup = (
  $pos: ResolvedPos,
  mediaGroupType: any,
): number | undefined => {
  if ($pos.nodeAfter && $pos.nodeAfter.type === mediaGroupType) {
    return $pos.pos + 1;
  }
};

const posOfFollowingMediaGroup = (state: EditorState): number | undefined => {
  if (!atTheEndOfBlock(state)) {
    return;
  }
  return posOfMediaGroupBelow(state, state.selection.$to);
};

const posOfMediaGroupAbove = (
  state: EditorState,
  $pos: ResolvedPos,
): number | undefined => {
  let adjacentPos;
  let adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeBefore;
  } else {
    adjacentPos = startPositionOfParent($pos) - 1;
    adjacentNode = state.doc.resolve(adjacentPos).nodeBefore;
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return adjacentPos - adjacentNode.nodeSize + 1;
  }
  return;
};

/**
 * Determine whether the cursor is inside empty paragraph
 * or the selection is the entire paragraph
 */
export const isInsidePotentialEmptyParagraph = (
  state: EditorState,
): boolean => {
  const { $from } = state.selection;

  return (
    $from.parent.type === state.schema.nodes.paragraph &&
    atTheBeginningOfBlock(state) &&
    atTheEndOfBlock(state)
  );
};

export const posOfMediaGroupBelow = (
  state: EditorState,
  $pos: ResolvedPos,
  prepend: boolean = true,
): number | undefined => {
  let adjacentPos;
  let adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeAfter;
  } else {
    adjacentPos = endPositionOfParent($pos);
    adjacentNode = state.doc.nodeAt(adjacentPos);
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return prepend ? adjacentPos + 1 : adjacentPos + adjacentNode.nodeSize - 1;
  }
  return;
};

export const posOfParentMediaGroup = (
  state: EditorState,
  $pos?: ResolvedPos,
  prepend: boolean = false,
): number | undefined => {
  const { $from } = state.selection;
  $pos = $pos || $from;

  if ($pos.parent.type === state.schema.nodes.mediaGroup) {
    return prepend
      ? startPositionOfParent($pos)
      : endPositionOfParent($pos) - 1;
  }
  return;
};

/**
 * The function will return the position after current selection where mediaGroup can be inserted.
 */
export function endPositionForMedia(
  state: EditorState,
  resolvedPos: ResolvedPos,
): number {
  const { mediaGroup } = state.schema.nodes;
  let i = resolvedPos.depth;
  for (; i > 1; i--) {
    const nodeType = resolvedPos.node(i).type;
    if (nodeType.validContent(Fragment.from(mediaGroup.create()))) {
      break;
    }
  }
  return resolvedPos.end(i) + 1;
}

export const removeMediaNode = (
  view: EditorView,
  node: PMNode,
  getPos: ProsemirrorGetPosHandler,
) => {
  const { id } = node.attrs;
  const { state } = view;
  const { tr, selection, doc } = state;

  const currentMediaNodePos = getPos();
  tr.deleteRange(currentMediaNodePos, currentMediaNodePos + node.nodeSize);

  if (isTemporary(id)) {
    tr.setMeta('addToHistory', false);
  }

  const $currentMediaNodePos = doc.resolve(currentMediaNodePos);
  const { nodeBefore, parent } = $currentMediaNodePos;
  const isLastMediaNode =
    $currentMediaNodePos.index() === parent.childCount - 1;

  // If deleting a selected media node, we need to tell where the cursor to go next.
  // Prosemirror didn't gave us the behaviour of moving left if the media node is not the last one.
  // So we handle it ourselves.
  if (
    selection.from === currentMediaNodePos &&
    !isLastMediaNode &&
    !atTheBeginningOfDoc(state) &&
    nodeBefore &&
    nodeBefore.type.name === 'media'
  ) {
    const nodeBefore = findPositionOfNodeBefore(tr.selection);
    if (nodeBefore) {
      tr.setSelection(NodeSelection.create(tr.doc, nodeBefore));
    }
  }

  view.dispatch(tr);
};

export const splitMediaGroup = (view: EditorView): boolean => {
  const { selection } = view.state;

  // if selection is not a media node, do nothing.
  if (
    !(selection instanceof NodeSelection) ||
    selection.node.type !== view.state.schema.nodes.media
  ) {
    return false;
  }

  deleteSelection(view.state, view.dispatch);

  if (selection.$to.nodeAfter) {
    splitBlock(view.state, view.dispatch);
    createParagraphNear(false)(view.state, view.dispatch);
  } else {
    createNewParagraphBelow(view.state, view.dispatch);
  }

  return true;
};

const isOptionalAttr = (attr: string) =>
  attr.length > 1 && attr[0] === '_' && attr[1] === '_';

export const copyOptionalAttrsFromMediaState = (
  mediaState: MediaState,
  node: PMNode,
) => {
  Object.keys(node.attrs)
    .filter(isOptionalAttr)
    .forEach((key) => {
      const mediaStateKey = key.substring(2);
      const attrValue = mediaState[mediaStateKey as keyof typeof mediaState];
      if (attrValue !== undefined) {
        node.attrs[key] = attrValue;
      }
    });
};

export const transformSliceToCorrectMediaWrapper = (
  slice: Slice,
  schema: Schema,
) => {
  const { mediaGroup, mediaSingle, media } = schema.nodes;
  return mapSlice(slice, (node, parent) => {
    if (!parent && node.type === media) {
      if (
        mediaSingle &&
        (isImage(node.attrs.__fileMimeType) || node.attrs.type === 'external')
      ) {
        return mediaSingle.createChecked({}, node);
      } else {
        return mediaGroup.createChecked({}, [node]);
      }
    }

    return node;
  });
};

/**
 * Check base styles to see if an element will be invisible when rendered in a document.
 * @param element
 */
const isElementInvisible = (element: HTMLElement) => {
  return (
    element.style.opacity === '0' ||
    element.style.display === 'none' ||
    element.style.visibility === 'hidden'
  );
};

const VALID_TAGS_CONTAINER = ['DIV', 'TD'];
function canContainImage(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }
  return VALID_TAGS_CONTAINER.indexOf(element.tagName) !== -1;
}

/**
 * Given a html string, we attempt to hoist any nested `<img>` tags,
 * not wrapped by a `<div>` as ProseMirror no-op's on those scenarios.
 * @param html
 */
export const unwrapNestedMediaElements = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const wrapper = doc.body;

  // Remove Google Doc's wrapper <b> el
  const docsWrapper = wrapper.querySelector<HTMLElement>(
    'b[id^="docs-internal-guid-"]',
  );
  if (docsWrapper) {
    unwrap(wrapper, docsWrapper);
  }

  const imageTags = wrapper.querySelectorAll('img');
  if (!imageTags.length) {
    return html;
  }

  imageTags.forEach((imageTag) => {
    // Capture the immediate parent, we may remove the media from here later.
    const mediaParent = imageTag.parentElement;
    if (!mediaParent) {
      return;
    }

    // If either the parent or the image itself contains styles that would make
    // them invisible on copy, dont paste them.
    if (isElementInvisible(mediaParent) || isElementInvisible(imageTag)) {
      mediaParent.removeChild(imageTag);
      return;
    }

    // If its wrapped by a div we assume its safe to bypass.
    // ProseMirror should handle this case properly.
    if (mediaParent instanceof HTMLDivElement) {
      return;
    }

    // Find the top most element that the parent has a valid container for the image.
    // Stop just before found the wrapper
    const insertBeforeElement = walkUpTreeUntil(mediaParent, (element) => {
      // If is at the top just use this element as reference
      if (element.parentElement === wrapper) {
        return true;
      }

      return canContainImage(element.parentElement);
    });

    // Here we try to insert the media right after its top most valid parent element
    // Unless its the last element in our structure then we will insert above it.
    if (insertBeforeElement && insertBeforeElement.parentElement) {
      // Insert as close as possible to the most closest valid element index in the tree.
      insertBeforeElement.parentElement.insertBefore(
        imageTag,
        insertBeforeElement.nextElementSibling || insertBeforeElement,
      );

      // Attempt to clean up lines left behind by the image
      mediaParent.innerText = mediaParent.innerText.trim();
      // Walk up and delete empty elements left over after removing the image tag
      removeNestedEmptyEls(mediaParent);
    }
  });

  // If last child is a hardbreak we don't want it
  if (wrapper.lastElementChild && wrapper.lastElementChild.tagName === 'BR') {
    wrapper.removeChild(wrapper.lastElementChild);
  }

  return wrapper.innerHTML;
};

export const getMediaNodeFromSelection = (
  state: EditorState,
): PMNode | null => {
  if (!isSelectionMediaSingleNode(state)) {
    return null;
  }

  const tr = state.tr;
  const pos = tr.selection.from + 1;
  const mediaNode = tr.doc.nodeAt(pos);

  if (mediaNode && mediaNode.type === state.schema.nodes.media) {
    return mediaNode;
  }

  return null;
};
