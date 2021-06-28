import { NodeSpec, Node } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { OrderedListDefinition as OrderedList } from './ordered-list';
import { BulletListDefinition as BulletList } from './bullet-list';
import { HeadingDefinition as Heading } from './heading';
import { BlockCardDefinition as BlockCard } from './block-card';

export enum PanelType {
  INFO = 'info',
  NOTE = 'note',
  TIP = 'tip',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  /**
   * @stage 0
   */
  CUSTOM = 'custom',
}
export interface PanelAttributes {
  panelType: PanelType;
  /**
   * @stage 0
   */
  panelIcon?: string;
  /**
   * @stage 0
   */
  panelColor?: string;
}

/**
 * @name panel_node
 */
export interface PanelDefinition {
  type: 'panel';
  attrs: PanelAttributes;
  /**
   * @minItems 1
   * @allowUnsupportedBlock true
   */
  content: Array<Paragraph | Heading | OrderedList | BulletList | BlockCard>;
}

export interface DOMAttributes {
  [propName: string]: string;
}

//TODO: ED-10445 rename to panel and merge with the other panel node spec, after emoji panels moved to full schema
export const customPanel: NodeSpec = {
  group: 'block',
  content:
    '(paragraph | heading | bulletList | orderedList | blockCard | unsupportedBlock)+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  attrs: {
    panelType: { default: 'info' },
    panelIcon: { default: null },
    panelColor: { default: null },
  },
  parseDOM: [
    {
      tag: 'div[data-panel-type]',
      getAttrs: (dom) => ({
        panelType: (dom as HTMLElement).getAttribute('data-panel-type')!,
        panelIcon: (dom as HTMLElement).getAttribute('data-panel-icon')!,
        panelColor: (dom as HTMLElement).getAttribute('data-panel-color')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const { panelType, panelIcon, panelColor } = node.attrs;
    const attrs: DOMAttributes = {
      'data-panel-type': panelType,
      'data-panel-icon': panelIcon,
      'data-panel-color': panelColor,
    };
    return ['div', attrs, ['div', {}, 0]];
  },
};

export const panel: NodeSpec = {
  group: 'block',
  content:
    '(paragraph | heading | bulletList | orderedList | blockCard | unsupportedBlock)+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  attrs: {
    panelType: { default: 'info' },
  },
  parseDOM: [
    {
      tag: 'div[data-panel-type]',
      getAttrs: (dom) => ({
        panelType: (dom as HTMLElement).getAttribute('data-panel-type')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const { panelType } = node.attrs;
    const attrs: DOMAttributes = {
      'data-panel-type': panelType,
    };
    return ['div', attrs, ['div', {}, 0]];
  },
};
