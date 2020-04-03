import {
  isSchemaWithLists,
  isSchemaWithMentions,
  isSchemaWithLinks,
  isSchemaWithAdvancedTextFormattingMarks,
  isSchemaWithCodeBlock,
  isSchemaWithBlockQuotes,
  isSchemaWithMedia,
  isSchemaWithSubSupMark,
  isSchemaWithTextColor,
  isSchemaWithTables,
  normalizeHexColor,
} from '@atlaskit/adf-schema';

import {
  Fragment,
  Mark,
  Node as PMNode,
  Schema,
  NodeType,
} from 'prosemirror-model';

import { mapImageToEmoji } from './emojiHelper';

/**
 * Ensure that each node in the fragment is a block, wrapping
 * in a block node if necessary.
 */
export function ensureBlocks(
  fragment: Fragment,
  schema: Schema,
  nodeType?: NodeType,
): Fragment {
  // If all the nodes are inline, we want to wrap in a single paragraph.
  if (schema.nodes.paragraph.validContent(fragment)) {
    return Fragment.fromArray([
      schema.nodes.paragraph.createChecked({}, fragment),
    ]);
  }

  // Either all the nodes are blocks, or a mix of inline and blocks.
  // We convert each (if any) inline nodes to blocks.
  const blockNodes: PMNode[] = [];

  // Following if condition has been added as fix for #ED-3431.
  // First child of list-item should be paragraph,
  // if that is not the case paragraph requires to be added.
  if (
    nodeType &&
    nodeType === schema.nodes.listItem &&
    fragment.firstChild &&
    (fragment.firstChild.type === schema.nodes.bulletList ||
      fragment.firstChild.type === schema.nodes.orderedList)
  ) {
    blockNodes.push(schema.nodes.paragraph.createAndFill() as PMNode);
  }

  fragment.forEach(child => {
    if (child.isBlock) {
      blockNodes.push(child);
    } else {
      blockNodes.push(schema.nodes.paragraph.createChecked({}, child));
    }
  });

  return Fragment.fromArray(blockNodes);
}

/**
 * This function will convert all content to inline nodes
 */
export const ensureInline = (
  schema: Schema,
  content: Fragment,
  supportedMarks: Mark[],
) => {
  const result: PMNode[] = [];
  content.forEach((node: PMNode) => {
    if (node.isInline) {
      const filteredMarks = node.marks.filter(mark =>
        mark.isInSet(supportedMarks),
      );
      result.push(node.mark(filteredMarks));
      return;
    }
    // We replace an non-inline node with UnsupportedInline node
    result.push(schema.text(node.textContent));
  });
  return Fragment.fromArray(result);
};

export function convert(
  content: Fragment,
  node: Node,
  schema: Schema,
): Fragment | PMNode | null | undefined {
  // text
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    return text ? schema.text(text) : null;
  }

  // marks and nodes
  if (node instanceof HTMLElement) {
    const tag = node.tagName.toUpperCase();
    switch (tag) {
      // Marks
      case 'DEL':
        if (!isSchemaWithAdvancedTextFormattingMarks(schema)) {
          return null;
        }
        return addMarks(content, [schema.marks.strike!.create()]);
      case 'B':
        return addMarks(content, [schema.marks.strong.create()]);
      case 'EM':
        return addMarks(content, [schema.marks.em.create()]);
      case 'TT':
        if (!isSchemaWithAdvancedTextFormattingMarks(schema)) {
          return null;
        }
        return addMarks(content, [schema.marks.code!.create()]);
      case 'SUB':
      case 'SUP':
        if (!isSchemaWithSubSupMark(schema)) {
          return null;
        }
        const type = tag === 'SUB' ? 'sub' : 'sup';
        return addMarks(content, [schema.marks.subsup.create({ type })]);
      case 'INS':
        return addMarks(content, [schema.marks.underline.create()]);
      case 'FONT':
        if (!isSchemaWithTextColor(schema)) {
          return null;
        }
        const color = normalizeHexColor(node.getAttribute('color'), '#333333');
        return color
          ? addMarks(content, [schema.marks.textColor.create({ color })])
          : content;
      // Nodes
      case 'A':
        if (node.className === 'user-hover' && isSchemaWithMentions(schema)) {
          return schema.nodes.mention!.createChecked({
            id: node.getAttribute('rel'),
            text: node.textContent,
          });
        }

        if (
          node.className.match('jira-issue-macro-key') ||
          !content ||
          !isSchemaWithLinks(schema)
        ) {
          return null;
        }
        const href = node.getAttribute('href');
        const title = node.getAttribute('title');
        return href
          ? addMarks(content, [schema.marks.link.create({ href, title })])
          : content;

      case 'SPAN':
        /**
         * JIRA ISSUE MACROS
         * `````````````````
         * <span class="jira-issue-macro" data-jira-key="ED-1">
         *     <a href="https://product-fabric.atlassian.net/browse/ED-1" class="jira-issue-macro-key issue-link">
         *         <img class="icon" src="./epic.svg" />
         *         ED-1
         *     </a>
         *     <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-current jira-macro-single-issue-export-pdf">
         *         In Progress
         *     </span>
         * </span>
         */
        if (node.className.split(' ').indexOf('jira-issue-macro') > -1) {
          const jiraKey = node.getAttribute('data-jira-key');
          const link = node.getElementsByTagName('a')[0];
          if (jiraKey && link) {
            return addMarks(Fragment.from(schema.text(jiraKey)), [
              schema.marks.link!.create({
                href: link.getAttribute('href'),
                title: link.getAttribute('title'),
              }),
            ]);
          }
          return null;
        } else if (node.className.match('jira-macro-single-issue-export-pdf')) {
          return null;
        } else if (node.className.match('code-')) {
          // Removing spans with syntax highlighting from JIRA
          return null;
        } else if (isMedia(node) && isSchemaWithMedia(schema)) {
          const dataNode = node.querySelector('[data-media-services-id]');
          if (dataNode && dataNode instanceof HTMLElement) {
            const id = dataNode.getAttribute('data-media-services-id');
            const type = dataNode.getAttribute('data-media-services-type');
            const collection =
              dataNode.getAttribute('data-media-services-collection') || '';
            const attachmentName = dataNode.getAttribute(
              'data-attachment-name',
            );
            const attachmentType = dataNode.getAttribute(
              'data-attachment-type',
            );
            const fileName = dataNode.getAttribute('data-file-name');
            const displayType = dataNode.getAttribute('data-display-type');
            const width = parseInt(
              dataNode.getAttribute('data-width') || '',
              10,
            );
            const height = parseInt(
              dataNode.getAttribute('data-height') || '',
              10,
            );

            return schema.nodes.media.createChecked({
              id,
              type,
              collection,
              width: width || null,
              height: height || null,
              __fileName: attachmentName || fileName,
              __displayType: attachmentType || displayType || 'thumbnail',
            });
          }
        }
        break;

      case 'IMG':
        if (
          node.parentElement &&
          node.parentElement.className.match('jira-issue-macro-key')
        ) {
          return null;
        } else if (node.className === 'emoticon') {
          let emojiResult = mapImageToEmoji(node as HTMLImageElement);
          if (emojiResult) {
            return schema.text(emojiResult);
          }
        }
        break;
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
        const level = Number(tag.charAt(1));
        const supportedMarks = [schema.marks.link].filter(mark => !!mark);
        return schema.nodes.heading.createChecked(
          // @see ED-4708
          { level: level === 6 ? 5 : level },
          schema.nodes.heading.validContent(content)
            ? content
            : ensureInline(schema, content, supportedMarks as any),
        );
      case 'BR':
        return schema.nodes.hardBreak.createChecked();
      case 'HR':
        return schema.nodes.rule.createChecked();
      case 'P':
        if (node.firstElementChild && isMedia(node.firstElementChild)) {
          // Filter out whitespace text nodes

          const { mediaSingle, mediaGroup, paragraph } = schema.nodes;

          const mediaArray: Array<PMNode> = [];
          const contentArray: Array<PMNode> = [];
          const fragmentArray: Array<PMNode> = [];
          let hasNonMediaChildren = false;
          content.forEach(child => {
            if (child.type === schema.nodes.media) {
              mediaArray.push(child);
              return;
            } else if (!(child.isText && /^\s*$/.test(child.text || ''))) {
              hasNonMediaChildren = true;
            }
            contentArray.push(child);
          });

          if (hasNonMediaChildren && contentArray.length) {
            fragmentArray.push(paragraph.createChecked({}, contentArray));
          }

          if (isSchemaWithMedia(schema) && mediaArray.length) {
            const mediaNodeType = isMediaSingle(node.firstElementChild)
              ? mediaSingle
              : mediaGroup;
            fragmentArray.push(mediaNodeType.createChecked({}, mediaArray));
          }

          if (fragmentArray.length) {
            return Fragment.fromArray(fragmentArray);
          }

          return null;
        }

        return schema.nodes.paragraph.createChecked({}, content);
    }

    // lists
    if (isSchemaWithLists(schema)) {
      switch (tag) {
        case 'UL':
          return schema.nodes.bulletList!.createChecked({}, content);
        case 'OL':
          return schema.nodes.orderedList!.createChecked({}, content);
        case 'LI':
          const compatibleContent = schema.nodes.listItem!.validContent(content)
            ? content
            : ensureBlocks(content, schema, schema.nodes.listItem);
          return schema.nodes.listItem!.createChecked({}, compatibleContent);
      }
    }

    // code block
    if (isSchemaWithCodeBlock(schema)) {
      switch (tag) {
        case 'DIV':
          if (
            node.className === 'codeContent panelContent' ||
            node.className.match('preformattedContent')
          ) {
            return null;
          } else if (
            node.className === 'code panel' ||
            node.className === 'preformatted panel'
          ) {
            const pre = node.querySelector('pre');

            if (!pre) {
              return null;
            }

            const language =
              node.className === 'preformatted panel'
                ? 'plain'
                : pre.className.split('-')[1];

            const textContent = (pre.textContent || '').replace(/\r\n/g, '\n');
            return schema.nodes.codeBlock!.createChecked(
              { language },
              textContent ? schema.text(textContent) : undefined,
            );
          }
          break;
        case 'PRE':
          return null;
      }
    }

    if (isSchemaWithBlockQuotes(schema) && tag === 'BLOCKQUOTE') {
      let blockquoteContent =
        content && (content as any).content.length
          ? content
          : schema.nodes.paragraph.createChecked();
      return schema.nodes.blockquote!.createChecked({}, blockquoteContent);
    }

    // table
    if (isSchemaWithTables(schema)) {
      switch (tag) {
        case 'TABLE':
          return schema.nodes.table.createChecked({}, content);
        case 'TR':
          return schema.nodes.tableRow!.createChecked({}, content);
        case 'TD':
          const tdContent = schema.nodes.tableCell.validContent(content)
            ? content
            : ensureBlocks(content, schema);
          return schema.nodes.tableCell.createChecked({}, tdContent);
        case 'TH':
          const thContent = schema.nodes.tableHeader.validContent(content)
            ? content
            : ensureBlocks(content, schema);
          return schema.nodes.tableHeader.createChecked({}, thContent);
      }
    }
  }
  return;
}

/*
 * Flattens DOM tree into single array
 */
export function bfsOrder(root: Node): Node[] {
  const inqueue = [root];
  const outqueue = [] as Node[];

  let elem;
  while ((elem = inqueue.shift())) {
    outqueue.push(elem);
    let childIndex;
    for (childIndex = 0; childIndex < elem.childNodes.length; childIndex++) {
      const child = elem.childNodes[childIndex];
      switch (child.nodeType) {
        case Node.ELEMENT_NODE:
        case Node.TEXT_NODE:
          inqueue.push(child);
          break;
        default:
          // eslint-disable-next-line no-console
          console.error(`Not pushing: ${child.nodeType} ${child.nodeName}`);
      }
    }
  }
  outqueue.shift();
  return outqueue;
}

/**
 * Create a fragment by adding a set of marks to each node.
 */
function addMarks(fragment: Fragment, marks: Mark[]): Fragment {
  let result = fragment;
  for (let i = 0; i < fragment.childCount; i++) {
    const child = result.child(i);
    let newChild = child;
    for (const mark of marks) {
      newChild = newChild.mark(mark.addToSet(newChild.marks));
    }
    result = result.replaceChild(i, newChild);
  }
  return result;
}

function getNodeName(node: Node): string {
  return node.nodeName.toUpperCase();
}

function isMedia(node: Node): boolean {
  if (node && node instanceof HTMLElement) {
    if (node.parentNode && getNodeName(node.parentNode) === 'P') {
      if (getNodeName(node) === 'SPAN') {
        return !!node.querySelector(
          'a > jira-attachment-thumbnail > img[data-attachment-type="thumbnail"], ' +
            'a[data-attachment-type="file"]',
        );
      }
    }
  }
  return false;
}

function isMediaSingle(node: Node): boolean {
  if (isMedia(node)) {
    const dataNode = (node as HTMLElement).querySelector(
      '[data-media-services-id]',
    );
    if (dataNode instanceof HTMLElement) {
      const width = parseInt(dataNode.getAttribute('data-width') || '', 10);
      const height = parseInt(dataNode.getAttribute('data-height') || '', 10);
      if (
        (node.parentNode as HTMLElement).classList.contains('mediaSingle') &&
        width &&
        height
      ) {
        return true;
      }
    }
  }

  return false;
}
