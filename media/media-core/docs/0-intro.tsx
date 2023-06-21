import React from 'react';
import { md, code, AtlassianInternalWarning } from '@atlaskit/docs';
import {
  createRxjsNotice,
  createMediaUseOnlyNotice,
  createSingletonNotice,
} from '@atlaskit/media-common/docs';

const packageName = 'Media Core';

export default md`
${createSingletonNotice(packageName)}

${createMediaUseOnlyNotice(packageName, [
  { name: 'Media Card', link: '/packages/media/media-card' },
  { name: 'Media Picker', link: '/packages/media/media-picker' },
])}

${(<AtlassianInternalWarning />)}

${createRxjsNotice(packageName)}

  This package is required by other Media Components, and should not be used
  directly.

  It holds shared code between Media Components, such as:

  * models
  * providers
  * interfaces

  ## Usage

  \`Context\` is the main object that is created with \`ContextFactory\`. It can
  be created using either \`token\` and either \`clientId\` or \`asapIssuer\`.

  ${code`
import { Context, ContextConfig, ContextFactory } from '@atlaskit/media-core';

const authProvider = ({ collectionName }) =>
  new Promise((resolve, reject) => {
    resolve({
      token: 'token-that-was-recieved-in-some-async-way',
      clientId: 'some-client-id',
      baseUrl: 'http://example.com',
      //  asapIssuer: 'asap-issuer'
    });
  });
const config: ContextConfig = {
  authProvider,
};
const context: Context = ContextFactory.create(config);
  `}
`;
