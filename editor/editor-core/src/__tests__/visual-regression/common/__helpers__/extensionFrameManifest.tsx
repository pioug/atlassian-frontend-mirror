import React from 'react';

import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import { token } from '@atlaskit/tokens';

const icon = () =>
  import(
    /* webpackChunkName: "@atlaskit-internal_editor-success" */ '@atlaskit/icon/glyph/editor/success'
  ).then((mod) => mod.default);

const manifest: ExtensionManifest = {
  title: 'My awesome extension',
  type: 'com.atlassian.mochi',
  key: 'fluffy',
  description: 'Extension that does fluffy things',
  icons: {
    '16': icon,
    '24': icon,
    '48': icon,
  },
  modules: {
    quickInsert: [
      {
        key: 'framelessList',
        title: 'Oarsome frameless list',
        icon,
        action: {
          type: 'node',
          key: 'framelessList',
          parameters: {
            items: ['a', 'b', 'c', 'd'],
          },
        },
      },
      {
        key: 'framelessList',
        title: 'Oarsome bodied frameless list',
        icon,
        action: {
          type: 'node',
          key: 'bodiedFramelessList',
          parameters: {
            items: ['a', 'b', 'c', 'd'],
          },
        },
      },
      {
        key: 'list',
        title: 'Oarsome list',
        icon,
        action: {
          type: 'node',
          key: 'list',
          parameters: {
            items: ['a', 'b', 'c', 'd'],
          },
        },
      },
    ],
    nodes: {
      bodiedFramelessList: {
        type: 'bodiedExtension',
        render: () => {
          return Promise.resolve(({ node }) => {
            const { parameters } = node;
            return (
              <div
                style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
                  border: '1px dashed purple',
                  margin: `${token('space.150', '12px')} 0`,
                }}
                title="framelessList"
                data-frameless-list-id="mochilist"
              >
                <div>A bodied extension WITHOUT an extension frame.</div>
                {parameters && parameters.items && parameters.items.join('-')}
              </div>
            );
          });
        },
        update: (data, actions) => {
          return new Promise(() => {
            actions!.editInContextPanel(
              (parameters) => parameters,
              (parameters) => Promise.resolve(parameters),
            );
          });
        },
      },
      framelessList: {
        type: 'extension',
        render: () => {
          return Promise.resolve(({ node }) => {
            const { parameters } = node;
            return (
              <div
                style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
                  border: '1px dashed purple',
                  margin: `${token('space.150', '12px')} 0`,
                }}
                title="framelessList"
                data-frameless-list-id="mochilist"
              >
                <div>This renders WITHOUT an extension frame.</div>
                {parameters && parameters.items && parameters.items.join('-')}
              </div>
            );
          });
        },
      },
      list: {
        type: 'extension',
        render: () => {
          return Promise.resolve(({ node }) => {
            const { parameters } = node;
            return (
              <div
                style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
                  border: '1px dashed green',
                  margin: `${token('space.150', '12px')} 0`,
                }}
                title="list"
                data-list-id="mochilist"
              >
                <div>This renders WITH an extension frame</div>
                {parameters && parameters.items && parameters.items.join('-')}
              </div>
            );
          });
        },
      },
    },
  },
};

if ((manifest as any)?.modules?.nodes?.bodiedFramelessList) {
  (manifest as any).modules.nodes.bodiedFramelessList.__hideFrame = true;
}
if ((manifest as any)?.modules?.nodes?.framelessList) {
  (manifest as any).modules.nodes.framelessList.__hideFrame = true;
}

export const createExtensionFramesProvider = () => {
  return new DefaultExtensionProvider<any>([manifest], []);
};

export { manifest };
