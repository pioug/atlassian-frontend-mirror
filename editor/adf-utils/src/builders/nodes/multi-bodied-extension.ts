import type {
  ExtensionFrameDefinition,
  MultiBodiedExtensionDefinition,
} from '@atlaskit/adf-schema';
export const bodiedExtension =
  (attrs: MultiBodiedExtensionDefinition['attrs']) =>
  (
    ...content: Array<ExtensionFrameDefinition>
  ): MultiBodiedExtensionDefinition => ({
    type: 'multiBodiedExtension',
    attrs,
    content,
  });
