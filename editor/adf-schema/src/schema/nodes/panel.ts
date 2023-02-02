import { NodeSpec, Node, AttributeSpec } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { OrderedListDefinition as OrderedList } from './types/list';
import { BulletListDefinition as BulletList } from './types/list';
import { HeadingDefinition as Heading } from './heading';
import { BlockCardDefinition as BlockCard } from './block-card';

export enum PanelType {
  INFO = 'info',
  NOTE = 'note',
  TIP = 'tip',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CUSTOM = 'custom',
}
export interface PanelAttributes {
  panelType: PanelType;
  panelIcon?: string; // To identify emojis by shortName
  panelIconId?: string; // To uniquely identify emojis by id
  panelIconText?: string; // falling back to Unicode representation of standard emojis when image representation cannot be loaded
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

type NodeSpecAttributes = {
  [name: string]: AttributeSpec;
};

type ParseDOMAttrs = {
  panelType: string;
  panelIcon?: string;
  panelIconId?: string;
  panelIconText?: string;
  panelColor?: string;
};

const getDefaultAttrs = (): NodeSpecAttributes => {
  let attrs: NodeSpecAttributes = {
    panelType: { default: 'info' },
    panelIcon: { default: null },
    panelIconId: { default: null },
    panelIconText: { default: null },
    panelColor: { default: null },
  };

  return attrs;
};

const getDomAttrs = (nodeAttrs: { [key: string]: any }): DOMAttributes => {
  let attrs: DOMAttributes = {
    'data-panel-type': nodeAttrs.panelType,
    'data-panel-icon': nodeAttrs.panelIcon,
    'data-panel-icon-id': nodeAttrs.panelIconId,
    'data-panel-icon-text': nodeAttrs.panelIconText,
    'data-panel-color': nodeAttrs.panelColor,
  };

  return attrs;
};

const getParseDOMAttrs = (
  allowCustomPanel: boolean,
  dom: string | globalThis.Node,
): ParseDOMAttrs => {
  let parseDOMAttrs: ParseDOMAttrs = {
    panelType: (dom as HTMLElement).getAttribute('data-panel-type')!,
  };

  if (allowCustomPanel) {
    parseDOMAttrs = {
      ...parseDOMAttrs,
      panelIcon: (dom as HTMLElement).getAttribute('data-panel-icon')!,
      panelIconId: (dom as HTMLElement).getAttribute('data-panel-icon-id')!,
      panelIconText: (dom as HTMLElement).getAttribute('data-panel-icon-text')!,
      panelColor: (dom as HTMLElement).getAttribute('data-panel-color')!,
    };
  } else {
    parseDOMAttrs.panelType =
      parseDOMAttrs.panelType === PanelType.CUSTOM
        ? PanelType.INFO
        : parseDOMAttrs.panelType;
  }

  return parseDOMAttrs;
};

export const panel = (allowCustomPanel: boolean): NodeSpec => {
  const panelNodeSpec: NodeSpec = {
    group: 'block',
    content:
      '(paragraph | heading | bulletList | orderedList | blockCard | unsupportedBlock)+',
    marks: 'unsupportedMark unsupportedNodeAttribute',
    attrs: getDefaultAttrs(),
    selectable: true,
    parseDOM: [
      {
        tag: 'div[data-panel-type]',
        getAttrs: (dom) => getParseDOMAttrs(allowCustomPanel, dom),
      },
    ],
    toDOM(node: Node) {
      const attrs: DOMAttributes = getDomAttrs(node.attrs);

      const contentAttrs: Record<string, string> = {
        'data-panel-content': 'true',
      };

      return ['div', attrs, ['div', contentAttrs, 0]];
    },
  };
  return panelNodeSpec;
};
