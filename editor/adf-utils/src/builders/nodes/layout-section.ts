import {
  type LayoutColumnDefinition,
  type LayoutSectionDefinition,
} from '@atlaskit/adf-schema';

export const layoutSection =
  () =>
  (content: Array<LayoutColumnDefinition>): LayoutSectionDefinition => ({
    type: 'layoutSection',
    content,
  });
