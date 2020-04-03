import {
  LayoutColumnDefinition,
  LayoutSectionDefinition,
} from '@atlaskit/adf-schema';

export const layoutSection = () => (
  content: Array<LayoutColumnDefinition>,
): LayoutSectionDefinition => ({
  type: 'layoutSection',
  content,
});
