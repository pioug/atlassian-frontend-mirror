import { NodeSpec } from 'prosemirror-model';
import { LayoutColumnDefinition } from './layout-column';
import { BreakoutMarkDefinition } from '../marks';

/**
 * @name layoutSection_node
 */
export type LayoutSectionBaseDefinition = {
  type: 'layoutSection';
  marks?: Array<BreakoutMarkDefinition>;
  // Can't use Array<any> because `prosemirror-schema-compatibility-tests` can't handle it.
  content: Array<LayoutColumnDefinition>;
};

/**
 * Need duplicate `type` and `marks` to make both validator and json-schema satisfied
 */

/**
 * @name layoutSection_full_node
 */
export type LayoutSectionFullDefinition = LayoutSectionBaseDefinition & {
  type: 'layoutSection';
  marks?: Array<BreakoutMarkDefinition>;
  /**
   * @minItems 2
   * @maxItems 3
   * @allowUnsupportedBlock true
   */
  content: Array<LayoutColumnDefinition>;
};

/**
 * @stage 0
 * @name layoutSection_with_single_column_node
 */
export type LayoutSectionWithSingleColumnDefinition = LayoutSectionBaseDefinition & {
  type: 'layoutSection';
  marks?: Array<BreakoutMarkDefinition>;
  /**
   * @minItems 1
   * @maxItems 3
   * @allowUnsupportedBlock true
   */
  content: Array<LayoutColumnDefinition>;
};

export type LayoutSectionDefinition =
  | LayoutSectionFullDefinition
  | LayoutSectionWithSingleColumnDefinition;

export const layoutSection: NodeSpec = {
  content:
    '(layoutColumn | unsupportedBlock){1,3} unsupportedBlock* | unsupportedBlock+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-section]',
      skip: true,
    },
    {
      tag: 'div[data-layout-section]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-section': 'true' };
    return ['div', attrs, 0];
  },
};

export const layoutSectionWithSingleColumn: NodeSpec = {
  content:
    '(layoutColumn | unsupportedBlock){1,3} unsupportedBlock* | unsupportedBlock+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-section]',
      skip: true,
    },
    {
      tag: 'div[data-layout-section]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-section': 'true' };
    return ['div', attrs, 0];
  },
};
