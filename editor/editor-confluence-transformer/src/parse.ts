import {
  MediaAttributes,
  RichMediaAttributes as MediaSingleAttributes,
  RichMediaLayout as MediaSingleLayout,
  acNameToEmoji,
  acShortcutToEmoji,
  tableBackgroundColorNames,
  NameToEmoji,
} from '@atlaskit/adf-schema';
import {
  akEditorFullPageMaxWidth,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles/consts';
import { Fragment, Node as PMNode, Schema } from 'prosemirror-model';
import parseCxhtml from './parse-cxhtml';
import { AC_XMLNS, default as encodeCxhtml } from './encode-cxhtml';
import {
  findTraversalPath,
  getNodeName,
  addMarks,
  parseMacro,
  createCodeFragment,
  getAcTagNode,
  getMacroAttribute,
  getMacroParameters,
  hasClass,
  marksFromStyle,
  getContent,
  getExtensionMacroParams,
  mapPanelTypeToPm,
  calcPixelsFromCSSValue,
} from './utils';
import {
  blockquoteContentWrapper,
  listContentWrapper,
  listItemContentWrapper,
  ensureInline,
  docContentWrapper,
} from './content-wrapper';

const supportedSingleMediaLayouts = [
  'center',
  'wrap-left',
  'wrap-right',
  'wide',
  'full-width',
];

const convertedNodes = new WeakMap<Node, Fragment | PMNode>();
// This reverted mapping is used to map Unsupported Node back to it's original cxhtml
const convertedNodesReverted = new WeakMap<Fragment | PMNode, Node>();

export default function (cxhtml: string, schema: Schema) {
  const dom = parseCxhtml(cxhtml).querySelector('body')!;
  return schema.nodes.doc.createChecked({}, parseDomNode(schema, dom));
}

function parseDomNode(schema: Schema, dom: Element): PMNode {
  const nodes = findTraversalPath(
    Array.prototype.slice.call(dom.childNodes, 0),
  );

  // Process through nodes in reverse (so deepest child elements are first).
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    const content = getContent(node, convertedNodes);
    const candidate = converter(schema, content, node);
    if (typeof candidate !== 'undefined' && candidate !== null) {
      convertedNodes.set(node, candidate);
      convertedNodesReverted.set(candidate, node);
    }
  }

  const content = getContent(dom, convertedNodes);
  const compatibleContent =
    content.childCount > 0
      ? // Dangling inline nodes can't be directly inserted into a document, so
        // we attempt to wrap in a paragraph.
        schema.nodes.doc.validContent(content)
        ? content
        : docContentWrapper(schema, content, convertedNodesReverted)
      : // The document must have at least one block element.
        schema.nodes.paragraph.createChecked({});

  return compatibleContent as PMNode;
}

function converter(
  schema: Schema,
  content: Fragment,
  node: Node,
): Fragment | PMNode | null | undefined {
  // text
  if (
    node.nodeType === Node.TEXT_NODE ||
    node.nodeType === Node.CDATA_SECTION_NODE
  ) {
    const text = node.textContent;
    return text ? schema.text(text) : null;
  }

  // All unsupported content is wrapped in an `unsupportedInline` node. Wrapping
  // `unsupportedInline` inside `paragraph` where appropriate is handled when
  // the content is inserted into a parent.
  const unsupportedInline = schema.nodes.confluenceUnsupportedInline.createChecked(
    {
      cxhtml: encodeCxhtml(node),
    },
  );

  // marks and nodes
  if (node instanceof Element) {
    const tag = getNodeName(node);

    switch (tag) {
      // Marks
      case 'DEL':
      case 'S':
        return content
          ? addMarks(content, [schema.marks.strike.create()])
          : null;
      case 'B':
      case 'STRONG':
        return content
          ? addMarks(content, [schema.marks.strong.create()])
          : null;
      case 'I':
      case 'EM':
        return content ? addMarks(content, [schema.marks.em.create()]) : null;
      case 'CODE':
        return content ? addMarks(content, [schema.marks.code.create()]) : null;
      case 'SUB':
      case 'SUP':
        const type = tag === 'SUB' ? 'sub' : 'sup';
        return content
          ? addMarks(content, [schema.marks.subsup.create({ type })])
          : null;
      case 'U':
        return content
          ? addMarks(content, [schema.marks.underline.create()])
          : null;
      case 'A':
        const href = node.getAttribute('href');
        if (content) {
          return href
            ? addMarks(content, [schema.marks.link.create({ href })])
            : content;
        }
        return null;
      // Nodes
      case 'BLOCKQUOTE':
        return schema.nodes.blockquote.createChecked(
          {},
          schema.nodes.blockquote.validContent(content)
            ? content
            : blockquoteContentWrapper(schema, content, convertedNodesReverted),
        );
      case 'SPAN':
        return addMarks(
          content,
          marksFromStyle(schema, (node as HTMLSpanElement).style),
        );
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
        const level = Number(tag.charAt(1));
        const supportedMarks = [schema.marks.link].filter((mark) => !!mark);
        return schema.nodes.heading.createChecked(
          { level },
          schema.nodes.heading.validContent(content)
            ? content
            : ensureInline(
                schema,
                content,
                convertedNodesReverted,
                // TODO: Fix any, potential issue. ED-5048
                supportedMarks as any,
              ),
        );
      case 'BR':
        return schema.nodes.hardBreak.createChecked();
      case 'HR':
        return schema.nodes.rule.createChecked();
      case 'UL':
        return schema.nodes.bulletList.createChecked(
          {},
          schema.nodes.bulletList.validContent(content)
            ? content
            : listContentWrapper(schema, content, convertedNodesReverted),
        );
      case 'OL':
        return schema.nodes.orderedList.createChecked(
          {},
          schema.nodes.orderedList.validContent(content)
            ? content
            : listContentWrapper(schema, content, convertedNodesReverted),
        );
      case 'LI':
        return schema.nodes.listItem.createChecked(
          {},
          schema.nodes.listItem.validContent(content)
            ? content
            : listItemContentWrapper(schema, content, convertedNodesReverted),
        );
      case 'P':
        const textNodes: PMNode[] = [];

        if (!node.childNodes.length) {
          return schema.nodes.paragraph.createChecked({}, content);
        }

        content.forEach((childNode) => {
          textNodes.push(childNode);
        });

        // combine remaining text nodes
        if (textNodes.length) {
          return schema.nodes.paragraph.createChecked(
            {},
            ensureInline(
              schema,
              Fragment.fromArray(textNodes),
              convertedNodesReverted,
            ),
          );
        }

        return null;
      case 'AC:HIPCHAT-EMOTICON':
      case 'AC:EMOTICON':
        let emoji = {
          id: node.getAttribute('ac:emoji-id') || '',
          shortName: node.getAttribute('ac:emoji-shortname') || '',
          text: node.getAttribute('ac:emoji-fallback') || '',
        };

        if (!emoji.id) {
          const acName = node.getAttribute('ac:name');
          const acShortcut = node.getAttribute('ac:shortcut');
          if (acName) {
            emoji = acNameToEmoji(acName as NameToEmoji);
          }
          if (acShortcut) {
            emoji = acShortcutToEmoji(acShortcut);
          }
        }

        return schema.nodes.emoji.createChecked(emoji);

      case 'AC:STRUCTURED-MACRO':
        return convertConfluenceMacro(schema, node) || unsupportedInline;
      case 'FAB:LINK':
        if (
          node.firstChild &&
          node.firstChild instanceof Element &&
          getNodeName(node.firstChild) === 'FAB:MENTION'
        ) {
          const cdata = node.firstChild.firstChild!;

          return schema.nodes.mention.createChecked({
            id: node.firstChild.getAttribute('atlassian-id'),
            text: cdata!.nodeValue,
          });
        }
        break;
      case 'FAB:MENTION':
        const cdata = node.firstChild!;

        return schema.nodes.mention.createChecked({
          id: node.getAttribute('atlassian-id'),
          text: cdata!.nodeValue,
        });
      case 'FAB:MEDIA-GROUP':
        const mediaNodes: PMNode[] = [];

        if (!node.childNodes.length) {
          throw new Error(
            '<fab:media-group> must have at least one <fab:media> as child',
          );
        }

        content.forEach((childNode) => {
          if (childNode.type === schema.nodes.media) {
            mediaNodes.push(childNode);
          } else {
            throw new Error(
              '<fab:media-group> can only have <fab:media> as child',
            );
          }
        });

        if (mediaNodes.length) {
          return schema.nodes.mediaGroup.createChecked({}, mediaNodes);
        }

        return null;
      case 'FAB:MEDIA-SINGLE':
        if (node.childNodes.length !== 1) {
          throw new Error(
            '<fab:media-single> must have only one <fab:media> as child',
          );
        }

        const mediaNode = content.firstChild;
        if (!mediaNode || mediaNode.type !== schema.nodes.media) {
          throw new Error(
            '<fab:media-single> can only have <fab:media> as child',
          );
        }

        const layout = node.getAttribute('layout') || '';
        const mediaSingleAttrs: MediaSingleAttributes = {
          layout: (supportedSingleMediaLayouts.indexOf(layout) > -1
            ? layout
            : 'center') as MediaSingleLayout,
        };

        return schema.nodes.mediaSingle.createChecked(
          mediaSingleAttrs,
          mediaNode,
        );
      case 'FAB:MEDIA':
        const mediaAttrs: MediaAttributes = {
          id: node.getAttribute('media-id') || '',
          type: (node.getAttribute('media-type') || 'file') as 'file' | 'link',
          collection: node.getAttribute('media-collection') || '',
        };

        if (node.hasAttribute('width')) {
          mediaAttrs.width = parseInt(node.getAttribute('width')!, 10);
        }

        if (node.hasAttribute('height')) {
          mediaAttrs.height = parseInt(node.getAttribute('height')!, 10);
        }

        if (node.hasAttribute('file-name')) {
          mediaAttrs.__fileName = node.getAttribute('file-name')!;
        }

        if (node.hasAttribute('file-size')) {
          mediaAttrs.__fileSize = parseInt(node.getAttribute('file-size')!, 10);
        }

        if (node.hasAttribute('file-mime-type')) {
          mediaAttrs.__fileMimeType = node.getAttribute('file-mime-type')!;
        }

        return schema.nodes.media.createChecked(mediaAttrs);

      case 'AC:INLINE-COMMENT-MARKER':
        if (!content) {
          return null;
        }
        const attrs = { reference: node.getAttribute('ac:ref') };
        return addMarks(content, [
          schema.marks.confluenceInlineComment.create(attrs),
        ]);

      case 'AC:TASK-LIST':
        return convertTaskList(schema, node) || unsupportedInline;

      case 'AC:PLACEHOLDER':
        const text = node.textContent;
        if (text) {
          return schema.nodes.placeholder.createChecked({ text });
        }
        return null;

      case 'FAB:ADF':
        return convertADF(schema, node) || unsupportedInline;

      case 'PRE':
        return schema.nodes.codeBlock.createChecked(
          { language: null },
          schema.text(node.textContent || ''),
        );

      case 'TABLE':
        if (hasClass(node, 'wysiwyg-macro')) {
          return convertWYSIWYGMacro(schema, node) || unsupportedInline;
        } else {
          return convertTable(schema, node as HTMLTableElement);
        }
      case 'TIME':
        const dateStr = node.getAttribute('datetime');
        if (dateStr) {
          let timestamp = Date.parse(dateStr);
          return schema.nodes.date.createChecked({ timestamp });
        }
        return unsupportedInline;
      case 'DIV':
        if (hasClass(node, 'codeHeader')) {
          const codeHeader = schema.text(node.textContent || '', [
            schema.marks.strong.create(),
          ]);
          const supportedMarks = [schema.marks.link].filter((mark) => !!mark);
          return schema.nodes.heading.createChecked(
            { level: 5 },
            ensureInline(
              schema,
              Fragment.from(codeHeader),
              convertedNodesReverted,
              // TODO: Fix any, potential issue. ED-5048
              supportedMarks as any,
            ),
          );
        } else if (node.querySelector('.syntaxhighlighter')) {
          const codeblockNode = node.querySelector('.syntaxhighlighter');
          return (
            convertCodeFromView(schema, codeblockNode as Element) ||
            unsupportedInline
          );
        } else if (hasClass(node, 'preformatted')) {
          return convertNoFormatFromView(schema, node) || unsupportedInline;
        } else if (hasClass(node, 'content-wrapper')) {
          const { content } = parseDomNode(schema, node);
          return Fragment.from(content);
        }
        return unsupportedInline;
    }
  }

  return unsupportedInline;
}

function convertConfluenceMacro(
  schema: Schema,
  node: Element,
): Fragment | PMNode | null | undefined {
  const { macroName, macroId, params, properties } = parseMacro(node);
  const richBodyNode = getAcTagNode(node, 'ac:rich-text-body')!;
  const richTextBody = richBodyNode
    ? parseDomNode(schema, richBodyNode).content
    : null;
  const plainTextBody = properties['ac:plain-text-body'] || '';
  const schemaVersion = node.getAttributeNS(AC_XMLNS, 'schema-version');

  switch (macroName.toUpperCase()) {
    case 'CODE':
      const { language, title } = params;
      return createCodeFragment(schema, plainTextBody, language, title);

    case 'WARNING':
    case 'INFO':
    case 'NOTE':
    case 'TIP':
      const panelTitle = params.title;
      let panelBody: Array<PMNode | Fragment> = [];

      if (panelTitle) {
        panelBody.push(
          schema.nodes.heading.createChecked(
            { level: 3 },
            schema.text(panelTitle),
          ),
        );
      }

      if (richTextBody) {
        panelBody = panelBody.concat(richTextBody);
      } else {
        panelBody.push(schema.nodes.paragraph.createChecked({}));
      }
      return schema.nodes.panel.createChecked(
        { panelType: mapPanelTypeToPm(macroName) },
        // TODO: Fix any, potential issue. ED-5048
        panelBody as any,
      );

    case 'PANEL':
      return schema.nodes.panel.createChecked(
        { panelType: 'note' },
        richTextBody || [schema.nodes.paragraph.createChecked()],
      );

    case 'JIRA':
      const { server, serverId, key: issueKey } = params;

      // if this is an issue list, render it as unsupported node
      // @see https://product-fabric.atlassian.net/browse/ED-1193?focusedCommentId=26672&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-26672
      if (!issueKey) {
        return schema.nodes.confluenceUnsupportedInline.createChecked({
          cxhtml: encodeCxhtml(node),
        });
      }

      return schema.nodes.confluenceJiraIssue.createChecked({
        issueKey,
        macroId,
        schemaVersion,
        server,
        serverId,
      });
  }

  if (plainTextBody) {
    return schema.nodes.codeBlock.createChecked(
      { language: null },
      schema.text(plainTextBody),
    );
  }

  switch (properties['fab:display-type']) {
    case 'INLINE':
      return schema.nodes.inlineExtension.createChecked({
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: macroName,
        parameters: {
          macroParams: getExtensionMacroParams(params),
          macroMetadata: {
            macroId: { value: macroId },
            schemaVersion: { value: schemaVersion },
            placeholder: [
              {
                data: { url: properties['fab:placeholder-url'] },
                type: 'image',
              },
            ],
          },
        },
      });
    case 'BLOCK':
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: macroName,
        parameters: {
          macroParams: getExtensionMacroParams(params),
          macroMetadata: {
            macroId: { value: macroId },
            schemaVersion: { value: schemaVersion },
            placeholder: [
              {
                data: { url: properties['fab:placeholder-url'] },
                type: 'image',
              },
            ],
          },
        },
      };
      return richTextBody
        ? schema.nodes.bodiedExtension.createChecked(
            attrs,
            Fragment.from(richTextBody),
          )
        : schema.nodes.extension.createChecked(attrs);
  }

  return null;
}

function convertWYSIWYGMacro(
  schema: Schema,
  node: Element,
): Fragment | PMNode | null | undefined {
  const name = getMacroAttribute(node, 'name').toUpperCase();

  switch (name) {
    case 'CODE':
    case 'NOFORMAT':
      const codeContent = node.querySelector('pre')!.textContent || ' ';
      const { language, title } = getMacroParameters(node);
      return createCodeFragment(schema, codeContent, language, title);
  }

  return null;
}

function convertCodeFromView(
  schema: Schema,
  node: Element,
): Fragment | PMNode | null | undefined {
  const container = node.querySelector('.container');

  let content = '';
  if (container) {
    const { childNodes } = container;
    for (let i = 0, len = childNodes.length; i < len; i++) {
      content += childNodes[i].textContent + (i === len - 1 ? '' : '\n');
    }
  }

  let language;
  if (node.className) {
    language = (node.className.match(/\w+$/) || [''])[0];
  }

  return createCodeFragment(schema, content, language);
}

function convertNoFormatFromView(
  schema: Schema,
  node: Element,
): Fragment | PMNode | null | undefined {
  const codeContent = node.querySelector('pre')!.textContent || ' ';
  return createCodeFragment(schema, codeContent);
}

const RELATIVE_TABLE_WIDTH = akEditorFullPageMaxWidth;
const NUMBER_COL_WIDTH = akEditorTableNumberColumnWidth;

function convertTable(schema: Schema, node: HTMLTableElement) {
  const { table, tableRow, tableCell, tableHeader } = schema.nodes;
  const rowNodes: PMNode[] = [];
  const rows = node.querySelectorAll('tr');
  const colgroup = node.querySelector('colgroup');
  const columnInfos = colgroup ? colgroup.querySelectorAll('col') : [];

  const tableBaseWidth = calcPixelsFromCSSValue(
    node.style.width || '100%',
    RELATIVE_TABLE_WIDTH,
  );

  const columnSizes: number[] = [];
  for (let i = 0, len = columnInfos.length; i < len; i++) {
    const columnInfo = columnInfos[i];
    if (columnInfo.style.width) {
      columnSizes.push(
        calcPixelsFromCSSValue(columnInfo.style.width, tableBaseWidth),
      );
    } else {
      columnSizes.push(0);
    }
  }

  let isNumberColumnEnabled;
  for (let i = 0, rowsCount = rows.length; i < rowsCount; i++) {
    // skip nested tables from query selector
    if (rows[i].parentNode !== null) {
      let parent;

      if (rows[i].parentNode!.nodeName === 'tbody') {
        parent = rows[i].parentNode!.parentNode;
      } else {
        parent = rows[i].parentNode;
      }

      if (parent !== node) {
        continue;
      }
    }

    const cellNodes: PMNode[] = [];
    const cols = rows[i].querySelectorAll('td,th');
    if (typeof isNumberColumnEnabled === 'undefined') {
      isNumberColumnEnabled = cols[0].classList.contains('numberingColumn');
    }

    if (isNumberColumnEnabled && columnSizes.length) {
      columnSizes[0] = NUMBER_COL_WIDTH;
    }

    let colwidthIdx = 0;
    for (let j = 0, colsCount = cols.length; j < colsCount; j++) {
      // skip nested tables from query selector
      if (cols[j].parentElement && cols[j].parentElement !== rows[i]) {
        continue;
      }

      const cell = cols[j].nodeName === 'td' ? tableCell : tableHeader;
      const pmNode = parseDomNode(schema, cols[j]);
      const colspan = parseInt(cols[j].getAttribute('colspan') || '1', 10);

      let background = cols[j].getAttribute('data-highlight-colour') || null;
      if (background) {
        // convert confluence color name to editor color
        background =
          tableBackgroundColorNames.get(background.toLowerCase()) || background;
      }

      const colwidth = columnSizes.length
        ? columnSizes.slice(colwidthIdx, colwidthIdx + colspan)
        : null;

      const attrs = {
        colspan,
        colwidth:
          colwidth && colwidth.length && colwidth.every((width) => width > 0)
            ? colwidth
            : null,
        background,
        rowspan: parseInt(cols[j].getAttribute('rowspan') || '1', 10),
      };

      colwidthIdx += colspan;
      cellNodes.push(cell.createChecked(attrs, pmNode));
    }
    rowNodes.push(tableRow.createChecked(undefined, Fragment.from(cellNodes)));
  }

  return table.createChecked(
    {
      isNumberColumnEnabled,
      __autoSize:
        columnSizes.length === 0 || columnSizes.every((width) => width === 0),
    },
    Fragment.from(rowNodes),
  );
}

function convertTaskList(schema: Schema, node: Element) {
  const nodes: PMNode[] = [];

  for (let i = 0, count = node.childNodes.length; i < count; i++) {
    const child = node.childNodes[i] as Element;
    if (child.nodeName.toLowerCase() === 'ac:task') {
      nodes.push(convertTaskItem(schema, child));
    }
  }

  return nodes.length ? schema.nodes.taskList.createChecked({}, nodes) : null;
}

function convertTaskItem(schema: Schema, node: Element) {
  const id = getAcTagNode(node, 'ac:task-id');
  const status = getAcTagNode(node, 'ac:task-status');
  const body = getAcTagNode(node, 'ac:task-body');
  const nodes: PMNode[] = [];

  if (body) {
    const { content } = parseDomNode(schema, body);
    content.forEach((child) => {
      child.descendants((node) => {
        // only nested inline nodes are supported (for now)
        if (node.isInline) {
          nodes.push(node);
        }
      });
    });
  }

  const attrs: { localId?: string | null; state?: string } = {};
  if (id) {
    attrs['localId'] = id.textContent;
  }
  if (status) {
    attrs['state'] = status.textContent === 'complete' ? 'DONE' : 'TODO';
  }

  return schema.nodes.taskItem.createChecked(attrs, nodes);
}

function convertADF(schema: Schema, node: Element) {
  const str = node.textContent || '';
  const json = JSON.parse(str);
  return schema.nodeFromJSON(json);
}
