import React from 'react';
import { md, code, Example, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  Upload large files from the browser with ease

  ## Usage

  ${code`
    import {chunkinator} from '@atlaskit/chunkinator';

    const { response, cancel } = chunkinator(
      blob,
      {
        hashingConcurrency: 5,
        probingBatchSize: 10,
        chunkSize: 10000,
        uploadingConcurrency: 3,
        uploadingFunction,
        probingFunction,
        processingBatchSize,
        processingFunction: createProcessingFunction(deferredUploadId),
      },
      {
        onProgress(progress) {
          console.log({progress})
        },
      },
    );
  `}

  ${(
    <Example
      Component={require('../examples/1-integrator').default}
      title="Chunkinator"
      source={require('!!raw-loader!../examples/1-integrator')}
    />
  )}
`;
