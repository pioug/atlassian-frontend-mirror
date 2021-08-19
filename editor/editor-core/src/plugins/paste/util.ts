import {
  Slice,
  Mark,
  Node as PMNode,
  NodeType,
  Schema,
} from 'prosemirror-model';
import { isMediaBlobUrl } from '@atlaskit/media-client';
import { Selection } from 'prosemirror-state';
import { PasteSource } from '../analytics';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';

export function isPastedFromWord(html?: string): boolean {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:word') >= 0;
}

export function isPastedFromExcel(html?: string): boolean {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:excel') >= 0;
}

export function isPastedFromDropboxPaper(html?: string): boolean {
  return !!html && !!html.match(/class=\"\s?author-d-.+"/gim);
}

export function isPastedFromGoogleDocs(html?: string): boolean {
  return !!html && !!html.match(/id=\"docs-internal-guid-.+"/gim);
}

export function isPastedFromGoogleSpreadSheets(html?: string): boolean {
  return !!html && !!html.match(/data-sheets-.+=/gim);
}

export function isPastedFromPages(html?: string): boolean {
  return !!html && html.indexOf('content="Cocoa HTML Writer"') >= 0;
}

export function isPastedFromFabricEditor(html?: string): boolean {
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

// TODO: Write JEST tests for this part
export function isCode(str: string) {
  const lines = str.split(/\r?\n|\r/);
  if (3 > lines.length) {
    return false;
  }
  let weight = 0;
  lines.forEach((line) => {
    // Ends with : or ;
    if (/[:;]$/.test(line)) {
      weight++;
    }
    // Contains second and third braces
    if (/[{}\[\]]/.test(line)) {
      weight++;
    }
    // Contains <tag> or </
    if (/<\w+>/.test(line) || /<\//.test(line)) {
      weight++;
    }
    // Contains () <- function calls
    if (/\(\)/.test(line)) {
      weight++;
    }
    // Contains a link
    if (/(^|[^!])\[(.*?)\]\((\S+)\)$/.test(line)) {
      weight--;
    }
    // New line starts with less than two chars. e.g- if, {, <, etc
    const token = /^(\s+)[a-zA-Z<{]{2,}/.exec(line);
    if (token && 2 <= token[1].length) {
      weight++;
    }
    if (/&&/.test(line)) {
      weight++;
    }
  });
  return 4 <= weight && weight >= 0.5 * lines.length;
}

// @see https://product-fabric.atlassian.net/browse/ED-3159
// @see https://github.com/markdown-it/markdown-it/issues/38
export function escapeLinks(text: string) {
  return text.replace(/(\[([^\]]+)\]\()?((https?|ftp):\/\/[^\s]+)/g, (str) => {
    return str.match(/^(https?|ftp):\/\/[^\s]+$/) ? `<${str}>` : str;
  });
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
  marks?: Mark<any>[],
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
        ];
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
