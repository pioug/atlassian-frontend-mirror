import {
  MediaAttributes,
  getEmojiAcName,
  hexToRgb,
  MediaSingleAttributes,
  tableBackgroundColorPalette,
} from '@atlaskit/adf-schema';
import {
  timestampToIsoFormat,
  calcTableColumnWidths,
} from '@atlaskit/editor-common';
import { Fragment, Node as PMNode, Mark, Schema } from 'prosemirror-model';
import parseCxhtml from './parse-cxhtml';
import { AC_XMLNS, FAB_XMLNS, default as encodeCxhtml } from './encode-cxhtml';
import { mapCodeLanguage } from './languageMap';
import {
  getNodeMarkOfType,
  encodeMacroParams,
  mapPanelTypeToCxhtml,
} from './utils';

export default function encode(node: PMNode, schema: Schema) {
  const docType = document.implementation.createDocumentType(
    'html',
    '-//W3C//DTD XHTML 1.0 Strict//EN',
    'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd',
  );
  const doc = document.implementation.createDocument(
    'http://www.w3.org/1999/xhtml',
    'html',
    docType,
  );

  return encodeCxhtml(encodeFragment(node.content));

  function encodeNode(node: PMNode) {
    if (node.isText) {
      return encodeText(node);
    } else if (node.type === schema.nodes.blockquote) {
      return encodeBlockquote(node);
    } else if (node.type === schema.nodes.bulletList) {
      return encodeBulletList(node);
    } else if (node.type === schema.nodes.heading) {
      return encodeHeading(node);
    } else if (node.type === schema.nodes.confluenceJiraIssue) {
      return encodeJiraIssue(node);
    } else if (node.type === schema.nodes.rule) {
      return encodeHorizontalRule();
    } else if (node.type === schema.nodes.listItem) {
      return encodeListItem(node);
    } else if (node.type === schema.nodes.orderedList) {
      return encodeOrderedList(node);
    } else if (node.type === schema.nodes.paragraph) {
      return encodeParagraph(node);
    } else if (node.type === schema.nodes.hardBreak) {
      return encodeHardBreak();
    } else if (node.type === schema.nodes.codeBlock) {
      return encodeCodeBlock(node);
    } else if (node.type === schema.nodes.panel) {
      return encodePanel(node);
    } else if (node.type === schema.nodes.mention) {
      return encodeMention(node);
    } else if (
      node.type === schema.nodes.confluenceUnsupportedBlock ||
      node.type === schema.nodes.confluenceUnsupportedInline
    ) {
      return encodeUnsupported(node);
    } else if (node.type === schema.nodes.mediaGroup) {
      return encodeMediaGroup(node);
    } else if (node.type === schema.nodes.mediaSingle) {
      return encodeMediaSingle(node);
    } else if (node.type === schema.nodes.media) {
      return encodeMedia(node);
    } else if (node.type === schema.nodes.table) {
      return encodeTable(node);
    } else if (node.type === schema.nodes.emoji) {
      return encodeEmoji(node);
    } else if (node.type === schema.nodes.taskList) {
      return encodeTaskList(node);
    } else if (node.type === schema.nodes.date) {
      return encodeDate(node);
    } else if (node.type === schema.nodes.placeholder) {
      return encodePlaceholder(node);
    }

    return encodeAsADF(node);
  }

  function encodeBlockquote(node: PMNode) {
    const elem = doc.createElement('blockquote');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeFragment(fragment: Fragment) {
    const documentFragment = doc.createDocumentFragment();
    fragment.forEach(node => {
      const domNode = encodeNode(node);
      if (domNode) {
        documentFragment.appendChild(domNode);
      }
    });
    return documentFragment;
  }

  function encodeEmoji(node: PMNode) {
    const elem = doc.createElementNS(AC_XMLNS, 'ac:emoticon');
    const { id, shortName, text } = node.attrs;
    elem.setAttributeNS(AC_XMLNS, 'ac:name', getEmojiAcName({ id, shortName }));
    elem.setAttributeNS(AC_XMLNS, 'ac:emoji-id', id);
    elem.setAttributeNS(AC_XMLNS, 'ac:emoji-shortname', shortName);
    if (text) {
      elem.setAttributeNS(AC_XMLNS, 'ac:emoji-fallback', text);
    }
    return elem;
  }

  function encodeHeading(node: PMNode) {
    const elem = doc.createElement(`h${node.attrs.level}`);
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeParagraph(node: PMNode) {
    const elem = doc.createElement('p');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeMediaGroup(node: PMNode) {
    const elem = doc.createElementNS(FAB_XMLNS, 'fab:media-group');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeMediaSingle(node: PMNode) {
    const elem = doc.createElementNS(FAB_XMLNS, 'fab:media-single');
    const attrs = node.attrs as MediaSingleAttributes;
    elem.setAttribute('layout', attrs.layout);
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeMedia(node: PMNode): Element {
    const elem = doc.createElementNS(FAB_XMLNS, 'fab:media');
    const attrs = node.attrs as MediaAttributes;
    elem.setAttribute('media-id', attrs.id);
    elem.setAttribute('media-type', attrs.type);
    elem.setAttribute('media-collection', attrs.collection);
    if (attrs.width) {
      elem.setAttribute('width', `${attrs.width}`);
    }
    if (attrs.height) {
      elem.setAttribute('height', `${attrs.height}`);
    }
    if (attrs.__fileName) {
      elem.setAttribute('file-name', attrs.__fileName);
    }
    if (attrs.__fileSize) {
      elem.setAttribute('file-size', `${attrs.__fileSize}`);
    }
    if (attrs.__fileMimeType) {
      elem.setAttribute('file-mime-type', attrs.__fileMimeType);
    }
    return elem;
  }

  function encodeTable(node: PMNode): Element {
    const elem = doc.createElement('table');
    const colgroup = doc.createElement('colgroup');
    const tbody = doc.createElement('tbody');
    const { isNumberColumnEnabled } = node.attrs;
    const tableColumnWidths = calcTableColumnWidths(node);

    node.content.forEach(rowNode => {
      const rowElement = doc.createElement('tr');

      rowNode.content.forEach((colNode, _, j) => {
        const {
          attrs: { background, rowspan, colspan },
        } = colNode;

        const cellElement =
          colNode.type === schema.nodes.tableCell
            ? doc.createElement('td')
            : doc.createElement('th');

        if (isNumberColumnEnabled && j === 0) {
          cellElement.className = 'numberingColumn';
        }

        if (background) {
          cellElement.setAttribute(
            'data-highlight-colour',
            (
              tableBackgroundColorPalette.get(background.toLowerCase()) ||
              background
            ).toLowerCase(),
          );
        }

        if (colspan && colspan !== 1) {
          cellElement.setAttribute('colspan', colspan);
        }

        if (rowspan && rowspan !== 1) {
          cellElement.setAttribute('rowspan', rowspan);
        }

        cellElement.appendChild(encodeFragment(colNode.content));
        rowElement.appendChild(cellElement);
      });

      tbody.appendChild(rowElement);
    });

    // now we have all the column widths, assign them to each <col> in the <colgroup>
    tableColumnWidths.forEach(colwidth => {
      const colInfoElement = document.createElement('col');
      if (colwidth) {
        colInfoElement.style.width = colwidth + 'px';
      }
      colgroup.appendChild(colInfoElement);
    });

    elem.appendChild(colgroup);
    elem.appendChild(tbody);

    const tableClasses = ['wrapped'];
    if (
      tableColumnWidths.length &&
      tableColumnWidths.every(width => width > 0)
    ) {
      tableClasses.push('fixed-table');
    }
    elem.setAttribute('class', tableClasses.join(' '));

    return elem;
  }

  function encodeText(node: PMNode) {
    if (node.text) {
      const root = doc.createDocumentFragment();
      let elem = root as Node;

      // Group marks by type name so we can have better processing of duplicate types
      const groupedMarks: { [type: string]: Mark[] } = {};
      node.marks.forEach((mark: Mark) => {
        if (!groupedMarks[mark.type.name]) {
          groupedMarks[mark.type.name] = [];
        }
        groupedMarks[mark.type.name].push(mark);
      }, {});

      for (const type of Object.keys(groupedMarks)) {
        let marks = groupedMarks[type];
        switch (type) {
          case 'strong':
            elem = elem.appendChild(doc.createElement('strong'));
            break;
          case 'em':
            elem = elem.appendChild(doc.createElement('em'));
            break;
          case 'strike':
            elem = elem.appendChild(doc.createElement('s'));
            break;
          case 'underline':
            elem = elem.appendChild(doc.createElement('u'));
            break;
          case 'subsup':
            elem = elem.appendChild(doc.createElement(marks[0].attrs['type']));
            break;
          case 'code':
            elem = elem.appendChild(doc.createElement('code'));
            break;
          case 'mentionQuery':
            break;
          case 'link':
            const mark = getNodeMarkOfType(node, schema.marks.link);
            if (mark && mark.attrs.__confluenceMetadata !== null) {
              // need to use fab:adf to maintain confluenceMetadata
              return encodeAsADF(node);
            } else {
              elem = elem.appendChild(encodeLink(node));
            }
            break;
          case 'confluenceInlineComment':
            // Because this function encodes marks into dom nodes inwards, multiple inline comment
            // marks on the same PM node will be applied in reverse order. The code below compensates
            // for that while retaining current behaviour.
            for (let mark of [...marks].reverse()) {
              elem = elem.appendChild(encodeConfluenceInlineComment(mark));
            }
            break;
          case 'textColor':
            elem = elem.appendChild(encodeTextColor(node, schema));
            break;
          case 'emojiQuery':
            break;
          default:
            throw new Error(`Unable to encode mark '${type}'`);
        }
      }

      elem.textContent = node.text;
      return root;
    } else {
      return doc.createTextNode('');
    }
  }

  function encodeHardBreak() {
    return doc.createElement('br');
  }

  function encodeHorizontalRule() {
    return doc.createElement('hr');
  }

  function encodeBulletList(node: PMNode) {
    const elem = doc.createElement('ul');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeOrderedList(node: PMNode) {
    const elem = doc.createElement('ol');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeListItem(node: PMNode) {
    const elem = doc.createElement('li');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeLink(node: PMNode) {
    const link: HTMLAnchorElement = doc.createElement('a');
    const mark = getNodeMarkOfType(node, schema.marks.link);
    link.href = mark ? mark.attrs.href : '';
    return link;
  }

  function encodeTextColor(node: PMNode, schema: Schema) {
    const elem: HTMLSpanElement = doc.createElement('span');
    const mark = getNodeMarkOfType(node, schema.marks.textColor);
    const hexColor = mark ? mark.attrs.color : '';
    elem.style.color = hexToRgb(hexColor);
    return elem;
  }

  function encodeCodeBlock(node: PMNode) {
    const elem = createMacroElement('code', '1');

    if (node.attrs.language) {
      elem.appendChild(
        encodeMacroParams(doc, {
          language: { value: mapCodeLanguage(node.attrs.language) },
        }),
      );
    }

    const plainTextBody = doc.createElementNS(AC_XMLNS, 'ac:plain-text-body');
    const fragment = doc.createDocumentFragment();
    (node.textContent || '')
      .split(/]]>/g)
      .map((value, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const prefix = isFirst ? '' : '>';
        const suffix = isLast ? '' : ']]';
        return doc.createCDATASection(prefix + value + suffix);
      })
      .forEach(cdata => fragment.appendChild(cdata));

    plainTextBody.appendChild(fragment);
    elem.appendChild(plainTextBody);

    return elem;
  }

  function encodePanel(node: PMNode) {
    const panelType = mapPanelTypeToCxhtml(node.attrs.panelType);
    const elem = createMacroElement(panelType, '1');
    const body = doc.createElementNS(AC_XMLNS, 'ac:rich-text-body');
    const fragment = doc.createDocumentFragment();

    node.descendants(function(node, pos) {
      // there is at least one top-level paragraph node in the panel body
      // all text nodes will be handled by "encodeNode"
      if (node.isBlock) {
        // panel title
        if (node.type.name === 'heading' && pos === 0) {
          elem.appendChild(
            encodeMacroParams(doc, {
              title: { value: node.firstChild!.textContent },
            }),
          );
        } else {
          // panel content
          const domNode = encodeNode(node);
          if (domNode) {
            fragment.appendChild(domNode);
          }
        }
      }

      return false;
    });

    // special treatment for <ac:structured-macro ac:name="panel" />
    // it should be converted to "purple" Confluence panel
    if (panelType === 'panel') {
      elem.appendChild(
        encodeMacroParams(doc, {
          borderColor: { value: '#998DD9' },
          bgColor: { value: '#EAE6FF' },
        }),
      );
    }

    body.appendChild(fragment);
    elem.appendChild(body);

    return elem;
  }

  function encodeMention(node: PMNode) {
    const link = doc.createElementNS(FAB_XMLNS, 'fab:link');
    const mention = doc.createElementNS(FAB_XMLNS, 'fab:mention');
    mention.setAttribute('atlassian-id', node.attrs['id']);

    // ED-3634: we're removing cdata completely
    link.appendChild(mention);

    return link;
  }

  function encodeUnsupported(node: PMNode) {
    const domNode = parseCxhtml(node.attrs.cxhtml || '').querySelector('body')!
      .firstChild;
    if (domNode) {
      return doc.importNode(domNode, true);
    }
    return;
  }

  function encodeJiraIssue(node: PMNode) {
    const elem = createMacroElement('jira', node.attrs.schemaVersion);
    elem.setAttributeNS(AC_XMLNS, 'ac:macro-id', node.attrs.macroId);

    elem.appendChild(
      encodeMacroParams(doc, {
        key: { value: node.attrs.issueKey },
        server: { value: node.attrs.server },
        serverId: { value: node.attrs.serverId },
      }),
    );

    return elem;
  }

  function createMacroElement(name: string, version: string) {
    const elem = doc.createElementNS(AC_XMLNS, 'ac:structured-macro');
    elem.setAttributeNS(AC_XMLNS, 'ac:name', name);
    elem.setAttributeNS(AC_XMLNS, 'ac:schema-version', version);
    return elem;
  }

  function encodeConfluenceInlineComment(mark: Mark) {
    let marker = doc.createElementNS(AC_XMLNS, 'ac:inline-comment-marker');
    const reference = mark ? mark.attrs.reference : '';
    marker.setAttributeNS(AC_XMLNS, 'ac:ref', reference);

    return marker;
  }

  function encodeTaskList(node: PMNode): Element {
    const elem = doc.createElementNS(AC_XMLNS, 'ac:task-list');

    node.descendants(item => {
      if (item.type === schema.nodes.taskItem) {
        const taskItem = doc.createElementNS(AC_XMLNS, 'ac:task');
        const id = doc.createElementNS(AC_XMLNS, 'ac:task-id');
        const status = doc.createElementNS(AC_XMLNS, 'ac:task-status');

        id.textContent = item.attrs.localId;
        status.textContent =
          item.attrs.state === 'DONE' ? 'complete' : 'incomplete';
        taskItem.appendChild(id);
        taskItem.appendChild(status);

        if (item.content.size) {
          const body = doc.createElementNS(AC_XMLNS, 'ac:task-body');
          const span: HTMLSpanElement = doc.createElement('span');
          span.setAttribute('class', 'placeholder-inline-tasks');
          span.appendChild(encodeFragment(item.content));
          body.appendChild(span);
          taskItem.appendChild(body);
        }

        elem.appendChild(taskItem);
      }
      return false;
    });

    return elem;
  }

  function encodeDate(node: PMNode): Element {
    const elem = doc.createElement('time');
    const { timestamp } = node.attrs;
    if (timestamp) {
      elem.setAttribute('datetime', timestampToIsoFormat(timestamp));
    }
    return elem;
  }

  function encodePlaceholder(node: PMNode): Element {
    let elem = doc.createElementNS(AC_XMLNS, 'ac:placeholder');
    const { text } = node.attrs;
    elem.textContent = text;
    return elem;
  }

  function encodeAsADF(node: PMNode): Element {
    const nsNode = doc.createElementNS(FAB_XMLNS, 'fab:adf');
    nsNode.appendChild(doc.createCDATASection(JSON.stringify(node.toJSON())));
    return nsNode;
  }
}
