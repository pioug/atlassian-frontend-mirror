import {
  ExtensionManifest,
  ExtensionModuleNodes,
  ExtensionModule,
} from '@atlaskit/editor-common';

import { mockFieldResolver } from './confluence-fields-data-providers';

import { cqlSerializer, cqlDeserializer } from './cql-helpers';

import { setSmartUserPickerEnv } from '@atlaskit/user-picker';
import { nativeFields, customFields } from './fields';

const exampleFields = [...nativeFields, ...customFields];

const quickInsert: ExtensionModule[] = exampleFields.map(field => ({
  key: field.name,
  title: field.label,
  description: `type: ${field.type} (${field.name})`,
  icon: () => import('@atlaskit/icon/glyph/editor/code'),
  action: {
    type: 'node',
    key: field.name,
    parameters: {},
  },
}));

const nodes = exampleFields.reduce<ExtensionModuleNodes>((curr, field) => {
  curr[field.name] = {
    type: 'extension',
    render: async () => () => null,
    getFieldsDefinition: async () => [field],
  };

  return curr;
}, {});

const manifest: ExtensionManifest = {
  title: 'Editor fields example',
  type: 'twp.editor.example',
  key: 'all-fields',
  description: 'Example of fields supported by the editor',
  icons: {
    '48': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert,
    nodes,
    fields: {
      custom: {
        'mock-resolver': {
          resolver: mockFieldResolver,
        },
      },
      fieldset: {
        cql: {
          serializer: cqlSerializer,
          deserializer: cqlDeserializer,
        },
      },
      user: {
        'user-jdog-provider': {
          provider: async () => {
            // WARNING: this is required by the SmartUserPicker for testing environments
            setSmartUserPickerEnv('local');

            return {
              siteId: '497ea592-beb4-43c3-9137-a6e5fa301088',
              principalId: 'Context',
              fieldId: 'storybook',
              productKey: 'jira',
            };
          },
        },
      },
    },
  },
};

export default manifest;
