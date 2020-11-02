import {
  ExtensionManifest,
  ExtensionModuleNodes,
  ExtensionModule,
} from '@atlaskit/editor-common';

import {
  spaceKeyFieldResolver,
  usernameFieldResolver,
  labelFieldResolver,
  confluenceContentFieldResolver,
} from './confluence-fields-data-providers';

import { cqlSerializer, cqlDeserializer } from './cql-helpers';

import { setEnv } from '@atlaskit/user-picker/src/components/smart-user-picker/config';
import { nativeFields, customFields } from './fields';

const exampleFields = [...nativeFields, ...customFields];

const quickInsert: ExtensionModule[] = exampleFields.map(field => ({
  key: field.name,
  title: field.label,
  description: `type: ${field.type}`,
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
        spacekey: {
          resolver: spaceKeyFieldResolver,
        },
        username: {
          resolver: usernameFieldResolver,
        },
        label: {
          resolver: labelFieldResolver,
        },
        'confluence-content': {
          resolver: confluenceContentFieldResolver,
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
            setEnv('local');

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
