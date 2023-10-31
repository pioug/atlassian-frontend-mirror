import type {
  Node as PMNode,
  NodeType,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { Slice, Mark, Fragment } from '@atlaskit/editor-prosemirror/model';
import { isMediaBlobUrl } from '@atlaskit/media-client';
import type {
  EditorState,
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type {
  PasteSource,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import {
  TextSelection,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import {
  getSelectedTableInfo,
  isTableSelected,
} from '@atlaskit/editor-tables/utils';
import { sortByOrderWithTypeName } from '@atlaskit/editor-common/legacy-rank-plugins';
import {
  isSupportedInParent,
  mapChildren,
} from '@atlaskit/editor-common/utils';
import type { CardOptions } from '@atlaskit/editor-common/card';

export function isPastedFromWord(html?: string): boolean {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:word') >= 0;
}

export function isPastedFromExcel(html?: string): boolean {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:excel') >= 0;
}

function isPastedFromDropboxPaper(html?: string): boolean {
  return !!html && !!html.match(/class=\"\s?author-d-.+"/gim);
}

function isPastedFromGoogleDocs(html?: string): boolean {
  return !!html && !!html.match(/id=\"docs-internal-guid-.+"/gim);
}

function isPastedFromGoogleSpreadSheets(html?: string): boolean {
  return !!html && !!html.match(/data-sheets-.+=/gim);
}

function isPastedFromPages(html?: string): boolean {
  return !!html && html.indexOf('content="Cocoa HTML Writer"') >= 0;
}

function isPastedFromFabricEditor(html?: string): boolean {
  return !!html && html.indexOf('data-pm-slice="') >= 0;
}

export const isSingleLine = (text: string): boolean => {
  return !!text && text.trim().split('\n').length === 1;
};

export function htmlContainsSingleFile(html: string): boolean {
  return !!html.match(/<img .*>/) && !isMediaBlobUrl(html);
}

export function getPasteSource(event: ClipboardEvent): PasteSource {
  const html = event.clipboardData!.getData('text/html');

  if (isPastedFromDropboxPaper(html)) {
    return 'dropbox-paper';
  } else if (isPastedFromWord(html)) {
    return 'microsoft-word';
  } else if (isPastedFromExcel(html)) {
    return 'microsoft-excel';
  } else if (isPastedFromGoogleDocs(html)) {
    return 'google-docs';
  } else if (isPastedFromGoogleSpreadSheets(html)) {
    return 'google-spreadsheets';
  } else if (isPastedFromPages(html)) {
    return 'apple-pages';
  } else if (isPastedFromFabricEditor(html)) {
    return 'fabric-editor';
  }

  return 'uncategorized';
}

// @see https://product-fabric.atlassian.net/browse/ED-3159
// @see https://github.com/markdown-it/markdown-it/issues/38
export function escapeLinks(text: string) {
  return text.replace(
    /(\[([^\]]+)\]\()?((https?|ftp|jamfselfservice):\/\/[^\s"'>]+)/g,
    (str) => {
      return str.match(/^(https?|ftp|jamfselfservice):\/\/[^\s"'>]+$/)
        ? `<${str}>`
        : str;
    },
  );
}

export function hasOnlyNodesOfType(
  ...nodeTypes: NodeType[]
): (slice: Slice) => boolean {
  return (slice: Slice) => {
    let hasOnlyNodesOfType = true;

    slice.content.descendants((node: PMNode) => {
      hasOnlyNodesOfType =
        hasOnlyNodesOfType && nodeTypes.indexOf(node.type) > -1;

      return hasOnlyNodesOfType;
    });

    return hasOnlyNodesOfType;
  };
}

export function applyTextMarksToSlice(
  schema: Schema,
  marks?: readonly Mark[],
): (slice: Slice) => Slice {
  return (slice: Slice) => {
    const {
      marks: { code: codeMark, link: linkMark, annotation: annotationMark },
    } = schema;

    if (!Array.isArray(marks) || marks.length === 0) {
      return slice;
    }

    const sliceCopy = Slice.fromJSON(schema, slice.toJSON() || {});

    // allow links and annotations to be pasted
    const allowedMarksToPaste = [linkMark, annotationMark];

    sliceCopy.content.descendants((node, _pos, parent) => {
      if (node.isText && parent && parent.isBlock) {
        // @ts-ignore - [unblock prosemirror bump] assigning to readonly prop
        node.marks = [
          // remove all marks from pasted slice when applying code mark
          // and exclude all marks that are not allowed to be pasted
          ...((node.marks &&
            !codeMark.isInSet(marks) &&
            node.marks.filter((mark) =>
              allowedMarksToPaste.includes(mark.type),
            )) ||
            []),
          // add marks to a slice if they're allowed in parent node
          // and exclude link marks
          ...parent.type
            .allowedMarks(marks)
            .filter((mark) => mark.type !== linkMark),
        ].sort(sortByOrderWithTypeName('marks'));
        return false;
      }

      return true;
    });

    return sliceCopy;
  };
}

export function isEmptyNode(node: PMNode | null | undefined) {
  if (!node) {
    return false;
  }
  const { type: nodeType } = node;
  const emptyNode = nodeType.createAndFill();
  return (
    emptyNode &&
    emptyNode.nodeSize === node.nodeSize &&
    emptyNode.content.eq(node.content) &&
    Mark.sameSet(emptyNode.marks, node.marks)
  );
}

export function isCursorSelectionAtTextStartOrEnd(selection: Selection) {
  return (
    selection instanceof TextSelection &&
    selection.empty &&
    selection.$cursor &&
    (!selection.$cursor.nodeBefore || !selection.$cursor.nodeAfter)
  );
}

export function isPanelNode(node: PMNode | null | undefined) {
  return Boolean(node && node.type.name === 'panel');
}

export function isSelectionInsidePanel(selection: Selection): PMNode | null {
  if (selection instanceof NodeSelection && isPanelNode(selection.node)) {
    return selection.node;
  }
  const {
    doc: {
      type: {
        schema: {
          nodes: { panel },
        },
      },
    },
  } = selection.$from;

  const panelPosition = findParentNodeOfType(panel)(selection);

  if (panelPosition) {
    return panelPosition.node;
  }

  return null;
}

// https://product-fabric.atlassian.net/browse/ED-11714
// Checks for broken html that comes from links in a list item copied from Notion
export const htmlHasInvalidLinkTags = (html?: string): boolean => {
  return !!html && (html.includes('</a></a>') || html.includes('"></a><a'));
};

// https://product-fabric.atlassian.net/browse/ED-11714
// Example of broken html edge case we're solving
// <li><a href="http://www.atlassian.com\"<a> href="http://www.atlassian.com\"http://www.atlassian.com</a></a></li>">
export const removeDuplicateInvalidLinks = (html: string): string => {
  if (htmlHasInvalidLinkTags(html)) {
    const htmlArray = html.split(/(?=<a)/);
    const htmlArrayWithoutInvalidLinks = htmlArray.filter((item) => {
      return (
        !(item.includes('<a') && item.includes('"></a>')) &&
        !(item.includes('<a') && !item.includes('</a>'))
      );
    });
    const fixedHtml = htmlArrayWithoutInvalidLinks
      .join('')
      .replace(/<\/a><\/a>/gi, '</a>')
      .replace(/<a>/gi, '<a');
    return fixedHtml;
  }
  return html;
};

export const addReplaceSelectedTableAnalytics = (
  state: EditorState,
  tr: Transaction,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Transaction => {
  if (isTableSelected(state.selection)) {
    const { totalRowCount, totalColumnCount } = getSelectedTableInfo(
      state.selection,
    );
    editorAnalyticsAPI?.attachAnalyticsEvent({
      action: TABLE_ACTION.REPLACED,
      actionSubject: ACTION_SUBJECT.TABLE,
      attributes: {
        totalColumnCount,
        totalRowCount,
        inputMethod: INPUT_METHOD.CLIPBOARD,
      },
      eventType: EVENT_TYPE.TRACK,
    })(tr);
    return tr;
  }
  return state.tr;
};

export const transformUnsupportedBlockCardToInline = (
  slice: Slice,
  state: EditorState,
  cardOptions?: CardOptions,
): Slice => {
  const { blockCard, inlineCard } = state.schema.nodes;
  const children = [] as PMNode[];

  mapChildren(slice.content, (node: PMNode, i: number, frag: Fragment) => {
    if (
      node.type === blockCard &&
      !isBlockCardSupported(state, frag, cardOptions?.allowBlockCards ?? false)
    ) {
      children.push(
        inlineCard.createChecked(node.attrs, node.content, node.marks),
      );
    } else {
      children.push(node);
    }
  });

  return new Slice(
    Fragment.fromArray(children),
    slice.openStart,
    slice.openEnd,
  );
};
/**
 * Function to determine if a block card is supported by the editor
 * @param state
 * @param frag
 * @param allowBlockCards
 * @returns
 */
const isBlockCardSupported = (
  state: EditorState,
  frag: Fragment,
  allowBlockCards: boolean,
) => {
  return allowBlockCards && isSupportedInParent(state, frag);
};
