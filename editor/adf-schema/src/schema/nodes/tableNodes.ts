import { Node as PmNode, NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { CellAttributes } from '@atlaskit/editor-tables/types';
import { hexToEditorBackgroundPaletteRawValue } from '@atlaskit/editor-palette';
import {
  B100,
  B50,
  B75,
  G200,
  G50,
  G75,
  hexToRgba,
  isHex,
  isRgb,
  N0,
  N20,
  N60,
  N800,
  P100,
  P50,
  P75,
  R100,
  R50,
  R75,
  rgbToHex,
  T100,
  T50,
  T75,
  Y200,
  Y50,
  Y75,
} from '../../utils/colors';
import { PanelDefinition as Panel } from './panel';
import {
  ParagraphDefinition as Paragraph,
  ParagraphWithAlignmentDefinition as ParagraphWithMarks,
} from './paragraph';
import { BlockQuoteDefinition as Blockquote } from './blockquote';
import { OrderedListDefinition as OrderedList } from './types/list';
import { BulletListDefinition as BulletList } from './types/list';
import { RuleDefinition as Rule } from './rule';
import {
  HeadingDefinition as Heading,
  HeadingWithMarksDefinition as HeadingWithMarks,
} from './heading';
import { CodeBlockDefinition as CodeBlock } from './code-block';
import { MediaGroupDefinition as MediaGroup } from './media-group';
import { MediaSingleDefinition as MediaSingle } from './media-single';
import { DecisionListDefinition as DecisionList } from './decision-list';
import { TaskListDefinition as TaskList } from './task-list';
import { ExtensionDefinition as Extension } from './extension';
import { BlockCardDefinition as BlockCard } from './block-card';
import { EmbedCardDefinition as EmbedCard } from './embed-card';
import { NestedExpandDefinition as NestedExpand } from './nested-expand';
import { uuid } from '../../utils/uuid';
import { FragmentDefinition } from '../marks/fragment';

export type { CellAttributes };
export const tablePrefixSelector = 'pm-table';

export const tableCellSelector = `${tablePrefixSelector}-cell-content-wrap`;
export const tableHeaderSelector = `${tablePrefixSelector}-header-content-wrap`;
export const tableCellContentWrapperSelector = `${tablePrefixSelector}-cell-nodeview-wrapper`;
export const tableCellContentDomSelector = `${tablePrefixSelector}-cell-nodeview-content-dom`;

const DEFAULT_TABLE_HEADER_CELL_BACKGROUND = N20.toLocaleLowerCase();

export const getCellAttrs = (
  dom: HTMLElement,
  defaultValues: CellAttributes = {},
) => {
  const widthAttr = dom.getAttribute('data-colwidth');
  const width =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr)
      ? widthAttr.split(',').map((str) => Number(str))
      : null;
  const colspan = Number(dom.getAttribute('colspan') || 1);
  let { backgroundColor } = dom.style;

  /**
   * We have pivoted to store background color information in
   *  data-cell-background.
   * We will have original hex code (which we map to DST token)
   *  stored in data-cell-background, use that.
   * More details at https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3472556903/Tokenising+tableCell+background+colors#Update-toDom-and-parseDom-to-store-and-read-background-color-from-data-cell-background-attribute.4
   */
  const dataCellBackground = dom.getAttribute('data-cell-background');
  const dataCellBackgroundHexCode =
    dataCellBackground && isHex(dataCellBackground)
      ? dataCellBackground
      : undefined;

  // ignore setting background attr if ds neutral token is detected
  if (backgroundColor.includes('--ds-background-neutral')) {
    backgroundColor = '';
  } else {
    if (backgroundColor && isRgb(backgroundColor)) {
      const result = rgbToHex(backgroundColor);
      if (result !== null) {
        backgroundColor = result;
      }
    }
  }

  const backgroundHexCode =
    dataCellBackgroundHexCode ||
    (backgroundColor && backgroundColor !== defaultValues['background']
      ? backgroundColor
      : null);

  return {
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    colwidth: width && width.length === colspan ? width : null,
    background: backgroundHexCode,
  };
};

export type CellDomAttrs = {
  colspan?: string;
  rowspan?: string;
  style?: string;
  colorname?: string;
  'data-colwidth'?: string;
  'data-cell-background'?: string;
  class?: string;
};

/**
 * gets cell dom attributes based on node attributes
 * @returns CellDomAttrs
 */
export const getCellDomAttrs = (node: PmNode): CellDomAttrs => {
  const attrs: CellDomAttrs = {};
  const nodeType = node.type.name;

  if (node.attrs.colspan !== 1) {
    attrs.colspan = node.attrs.colspan;
  }
  if (node.attrs.rowspan !== 1) {
    attrs.rowspan = node.attrs.rowspan;
  }

  if (node.attrs.colwidth) {
    attrs['data-colwidth'] = node.attrs.colwidth.join(',');
  }
  if (node.attrs.background) {
    const { background } = node.attrs;

    // to ensure that we don't overwrite product's style:
    // - it clears background color for <th> if its set to gray
    // - it clears background color for <td> if its set to white
    // - it clears background color for <th> if ds neutral token is detected
    const ignored =
      (nodeType === 'tableHeader' &&
        background === tableBackgroundColorNames.get('light gray')) ||
      (nodeType === 'tableCell' &&
        background === tableBackgroundColorNames.get('white')) ||
      (nodeType === 'tableHeader' &&
        background.includes('--ds-background-neutral'));

    if (ignored) {
      attrs.style = '';
    } else {
      const color =
        isRgb(background) && rgbToHex(background)
          ? rgbToHex(background)
          : background;
      const tokenColor = hexToEditorBackgroundPaletteRawValue(color) || color;

      attrs.style = `${attrs.style || ''}background-color: ${tokenColor};`;

      /**
       * Storing hex code in data-cell-background because
       *  we want to have DST token (css variable) or
       *  DST token value (value (hex code) of css variable) in
       *  inline style to correct render table cell background
       *  based on selected theme.
       * Currently we rely on background color hex code stored in
       *  inline style.
       * Because of that when we copy and paste table, we end up
       *  having DST token or DST token value in ADF instead of
       *  original hex code which we map to DST token.
       * So, introducing data-cell-background.
       * More details at https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3472556903/Tokenising+tableCell+background+colors#Update-toDom-and-parseDom-to-store-and-read-background-color-from-data-cell-background-attribute.4
       */
      if (color) {
        attrs['data-cell-background'] = color;
      }

      attrs.colorname = tableBackgroundColorPalette.get(color);
    }
  }

  if (nodeType === 'tableHeader') {
    attrs.class = tableHeaderSelector;
  } else {
    attrs.class = tableCellSelector;
  }

  return attrs;
};

export const tableBackgroundColorPalette = new Map<string, string>();

export const tableBackgroundBorderColor = hexToRgba(N800, 0.12) || N0;
export const tableBackgroundColorNames = new Map<string, string>();

[
  [N0, 'White'],
  [B50, 'Light blue'],
  [T50, 'Light teal'],
  [G50, 'Light green'],
  [Y50, 'Light yellow'],
  [R50, 'Light red'],
  [P50, 'Light purple'],

  [N20, 'Light gray'],
  [B75, 'Blue'],
  [T75, 'Teal'],
  [G75, 'Green'],
  [Y75, 'Yellow'],
  [R75, 'Red'],
  [P75, 'Purple'],

  [N60, 'Gray'],
  [B100, 'Dark blue'],
  [T100, 'Dark teal'],
  [G200, 'Dark green'],
  [Y200, 'Dark yellow'],
  [R100, 'Dark red'],
  [P100, 'Dark purple'],
].forEach(([colorValue, colorName]) => {
  tableBackgroundColorPalette.set(colorValue.toLowerCase(), colorName);
  tableBackgroundColorNames.set(
    colorName.toLowerCase(),
    colorValue.toLowerCase(),
  );
});

export type Layout = 'default' | 'full-width' | 'wide';

export interface TableAttributes {
  isNumberColumnEnabled?: boolean;
  layout?: Layout;
  __autoSize?: boolean;
  /**
   * @minLength 1
   */
  localId?: string;
  /**
   * @stage 0
   */
  width?: number;
}

/**
 * @name table_node
 */
export interface TableDefinition {
  type: 'table';
  attrs?: TableAttributes;
  /**
   * @minItems 1
   */
  content: Array<TableRow>;
  marks?: Array<FragmentDefinition>;
}

/**
 * @name table_row_node
 */
export interface TableRow {
  type: 'tableRow';
  content: Array<TableHeader | TableCell>;
}

/**
 * @name table_cell_content
 * @minItems 1
 * @allowUnsupportedBlock true
 */
export type TableCellContent = Array<
  | Panel
  | Paragraph
  | ParagraphWithMarks
  | Blockquote
  | OrderedList
  | BulletList
  | Rule
  | Heading
  | HeadingWithMarks
  | CodeBlock
  | MediaGroup
  | MediaSingle
  | DecisionList
  | TaskList
  | Extension
  | BlockCard
  | NestedExpand
  | EmbedCard
>;

/**
 * @name table_cell_node
 */
export interface TableCell {
  type: 'tableCell';
  attrs?: CellAttributes;
  content: TableCellContent;
}

/**
 * @name table_header_node
 */
export interface TableHeader {
  type: 'tableHeader';
  attrs?: CellAttributes;
  content: TableCellContent;
}

// TODO: Fix any, potential issue. ED-5048
const createTableSpec = (allowCustomWidth: boolean = false): NodeSpec => {
  const attrs = {
    isNumberColumnEnabled: { default: false },
    layout: { default: 'default' },
    __autoSize: { default: false },
    localId: { default: '' },
  };
  const finalAttrs = allowCustomWidth
    ? {
        ...attrs,
        width: { default: null },
      }
    : attrs;

  const tableNodeSpec: NodeSpec = {
    content: 'tableRow+',
    attrs: finalAttrs,
    marks: 'unsupportedMark unsupportedNodeAttribute',
    tableRole: 'table',
    isolating: true,
    selectable: true,
    group: 'block',
    parseDOM: [
      {
        tag: 'table',
        getAttrs: (node: string | Node) => {
          const dom = node as HTMLElement;
          const breakoutWrapper = dom.parentElement?.parentElement;

          return {
            isNumberColumnEnabled:
              dom.getAttribute('data-number-column') === 'true',
            layout:
              // copying from editor
              dom.getAttribute('data-layout') ||
              // copying from renderer
              breakoutWrapper?.getAttribute('data-layout') ||
              'default',
            __autoSize: dom.getAttribute('data-autosize') === 'true',
            localId: dom.getAttribute('data-table-local-id') || uuid.generate(),
            width: Number(dom.getAttribute('data-table-width')) || null,
          };
        },
      },
    ],
    toDOM(node: PmNode) {
      const attrs = {
        'data-number-column': node.attrs.isNumberColumnEnabled,
        'data-layout': node.attrs.layout,
        'data-autosize': node.attrs.__autoSize,
        'data-table-local-id': node.attrs.localId,
        'data-table-width': node.attrs.width,
      };
      return ['table', attrs, ['tbody', 0]];
    },
  };
  return tableNodeSpec;
};

export const table = createTableSpec(false);
export const tableWithCustomWidth = createTableSpec(true);

const shouldIncludeAttribute = (key: string, value?: string) =>
  !key.startsWith('__') && (key !== 'localId' || !!value);

export const tableToJSON = (node: PmNode) => ({
  attrs: Object.keys(node.attrs)
    .filter((key) => shouldIncludeAttribute(key, node.attrs[key]))
    .reduce<typeof node.attrs>((obj, key) => {
      return {
        ...obj,
        [key]: node.attrs[key],
      };
    }, {}),
});

export const tableRow: NodeSpec = {
  selectable: false,
  content: '(tableCell | tableHeader)+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  tableRole: 'row',
  parseDOM: [{ tag: 'tr' }],
  toDOM() {
    return ['tr', 0];
  },
};

const cellAttrs = {
  colspan: { default: 1 },
  rowspan: { default: 1 },
  colwidth: { default: null },
  background: { default: null },
};

export const tableCell: NodeSpec = {
  selectable: false,
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaSingle |  mediaGroup | decisionList | taskList | blockCard | embedCard | extension | nestedExpand | unsupportedBlock)+',
  attrs: cellAttrs,
  tableRole: 'cell',
  marks:
    'alignment dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
  isolating: true,
  parseDOM: [
    // Ignore number cell copied from renderer
    {
      tag: '.ak-renderer-table-number-column',
      ignore: true,
    },
    {
      tag: 'td',
      getAttrs: (dom: string | Node) => getCellAttrs(dom as HTMLElement),
    },
  ],
  toDOM: (node: PmNode) => ['td', getCellDomAttrs(node), 0],
};

export const toJSONTableCell = (node: PmNode) => ({
  attrs: (Object.keys(node.attrs) as Array<keyof CellAttributes>).reduce<
    Record<string, any>
  >((obj, key) => {
    if (cellAttrs[key].default !== node.attrs[key]) {
      obj[key] = node.attrs[key];
    }

    return obj;
  }, {}),
});

export const tableHeader: NodeSpec = {
  selectable: false,
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaSingle |  mediaGroup | decisionList | taskList | blockCard | embedCard | extension | nestedExpand)+',
  attrs: cellAttrs,
  tableRole: 'header_cell',
  isolating: true,
  marks:
    'alignment dataConsumer fragment unsupportedMark unsupportedNodeAttribute',
  parseDOM: [
    {
      tag: 'th',
      getAttrs: (dom: string | Node) =>
        getCellAttrs(dom as HTMLElement, {
          background: DEFAULT_TABLE_HEADER_CELL_BACKGROUND,
        }),
    },
  ],

  toDOM: (node: PmNode) => ['th', getCellDomAttrs(node), 0],
};

export const toJSONTableHeader = toJSONTableCell;
