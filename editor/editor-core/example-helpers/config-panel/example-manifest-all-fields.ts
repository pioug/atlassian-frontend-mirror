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

import { nativeFields, customFields } from './fields';

const exampleFields = [...nativeFields, ...customFields];

const key = 'allFields';

const quickInsert: ExtensionModule[] = [
  {
    key,
    title: 'All fields',
    icon: () => import('@atlaskit/icon/glyph/editor/code'),
    action: {
      type: 'node',
      key,
      parameters: {},
    },
  },
];

const nodes: ExtensionModuleNodes = {
  [key]: {
    type: 'extension',
    render: () => Promise.resolve(() => null),
    getFieldsDefinition: () => Promise.resolve(exampleFields),
  },
};

const manifest: ExtensionManifest = {
  title: 'Editor fields example',
  type: 'twp.editor.example',
  key: 'example-fields',
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
    },
  },
};

export default manifest;
