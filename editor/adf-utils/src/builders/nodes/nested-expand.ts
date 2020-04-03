import {
  NestedExpandDefinition,
  NestedExpandContent,
} from '@atlaskit/adf-schema';

export const nestedExpand = (attrs: NestedExpandDefinition['attrs']) => (
  ...content: NestedExpandContent
): NestedExpandDefinition => ({
  type: 'nestedExpand',
  attrs,
  content,
});
