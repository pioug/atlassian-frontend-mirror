import { manifest as jqlTable } from './jql-table';
import { manifest as loremIpsum } from './lorem-ipsum';
import { manifest as awesomeExtension } from './awesome';
import { default as awesomeMochi } from './mochi';
import { manifest as tableCharts } from './table-charts';
import dropbox from '@atlaskit/editor-extension-dropbox';

import { DefaultExtensionProvider } from '@atlaskit/editor-common';

export const getXProductExtensionProvider = () =>
  new DefaultExtensionProvider<any>(
    [
      jqlTable,
      loremIpsum,
      awesomeExtension,
      awesomeMochi,
      tableCharts,
      // BC: This API key currently only gives permission to me to access dropbox
      // If you need to test this, lmk, and I will add you, or you can make your own app
      dropbox({ appKey: '3wzehwdgypoymz9', canMountinIframe: true }),
    ],
    [
      (text: string) => {
        if (text.startsWith(`http://jql-xconvert`)) {
          return {
            type: 'extension',
            attrs: {
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'jql-table',
              parameters: {
                macroParams: {
                  url: text,
                },
              },
            },
          };
        }
      },
    ],
  );
