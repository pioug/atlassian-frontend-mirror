import {
  ExtensionManifest,
  UpdateContextActions,
} from '@atlaskit/editor-common/extensions';
import { LoremParams } from './extension-handler';

async function defaultUpdate(
  data: LoremParams,
  actions?: UpdateContextActions<LoremParams>,
) {
  actions!.editInContextPanel(
    (parameters: LoremParams) => parameters,
    async (parameters: LoremParams) => parameters,
  );
}

const manifest: ExtensionManifest<LoremParams> = {
  title: 'Lorem ipsum',
  type: 'com.atlassian.connect',
  key: 'fake.lorem.ipsum',
  description: 'Extension demo',
  icons: {
    '48': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert: [
      {
        key: 'qi-lorem-ipsum-1',
        title: 'Lorem Ipsum 1',
        description: 'Extension 1',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: {
          type: 'node',
          key: 'lorem-ipsum-1',
          parameters: {
            sentence:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
          },
        },
      },
      {
        key: 'qi-lorem-ipsum-2',
        title: 'Lorem Ipsum 2',
        description: 'Extension 2',
        icon: () => import('@atlaskit/icon/glyph/book'),
        action: {
          type: 'node',
          key: 'lorem-ipsum-2',
          parameters: {
            sentence:
              'Mauris posuere consequat iaculis. Nulla facilisi. Mauris iaculis ex sed vestibulum mattis. Fusce et imperdiet quam. Nunc vulputate, nisi in consectetur sodales, justo nulla pulvinar sapien, vel egestas elit neque non justo. Vestibulum luctus metus quis ornare facilisis. Nullam et nisl quis mauris pharetra pulvinar vitae in velit. Donec facilisis nibh non malesuada dignissim. Phasellus eleifend erat non fermentum viverra. Sed mollis placerat lorem, sit amet elementum urna elementum sit amet. In hac habitasse platea dictumst. Phasellus laoreet non mauris in ultricies. Maecenas id dui eget nisl venenatis molestie. Mauris nisl augue, euismod at diam eget, interdum fringilla diam.',
          },
        },
      },
      {
        key: 'qi-lorem-ipsum-3',
        title: 'Lorem Ipsum 3 with body',
        description: 'Extension 3',
        icon: () => import('@atlaskit/icon/glyph/tray'),
        action: () => import('./adf-node-text-3-with-body'),
      },
      {
        key: 'qi-lorem-ipsum-4',
        title: 'Lorem Ipsum 4 inline',
        description: 'Extension 4',
        icon: () => import('@atlaskit/icon/glyph/bitbucket/pipelines'),
        action: {
          type: 'node',
          key: 'lorem-ipsum-4-inline',
          parameters: {
            words: 'Lorem ipsum dolor sit amet.',
          },
        },
      },
    ],
    nodes: {
      'lorem-ipsum-1': {
        type: 'extension',
        render: () => import('./extension-handler'),
        update: defaultUpdate,
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'sentence',
              label: 'Sentence',
              isRequired: true,
              type: 'string',
            },
          ]),
      },
      'lorem-ipsum-2': {
        type: 'extension',
        render: () => import('./extension-handler'),
        update: defaultUpdate,
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'sentence',
              label: 'Sentence',
              isRequired: true,
              type: 'string',
            },
            {
              name: 'lines',
              label: 'lines',
              isRequired: true,
              type: 'number',
            },
          ]),
      },
      'lorem-ipsum-3-with-body': {
        type: 'bodiedExtension',
        update: defaultUpdate,
        render: () => import('./extension-handler'),
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'sentence',
              label: 'Sentence',
              isRequired: true,
              type: 'string',
            },
          ]),
      },
      'lorem-ipsum-4-inline': {
        type: 'inlineExtension',
        render: () => import('./extension-handler'),
        update: defaultUpdate,
        getFieldsDefinition: () =>
          Promise.resolve([
            {
              name: 'words',
              label: 'Words',
              isRequired: true,
              type: 'string',
            },
          ]),
      },
    },
  },
};

export default manifest;
