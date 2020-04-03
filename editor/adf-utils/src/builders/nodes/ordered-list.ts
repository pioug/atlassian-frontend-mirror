import {
  ListItemDefinition,
  OrderedListDefinition,
} from '@atlaskit/adf-schema';

export const orderedList = (attrs?: OrderedListDefinition['attrs']) => (
  ...content: Array<ListItemDefinition>
): OrderedListDefinition => ({
  type: 'orderedList',
  attrs,
  content,
});
