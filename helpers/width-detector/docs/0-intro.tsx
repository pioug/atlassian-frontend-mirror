import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  Width Detector is a utility component that informs the child function of the available width.

  ### Note

  ${(
    <SectionMessage appearance="warning">
      <p>
        The default export WidthDetector will be deprecated in the next major
        release of width-detector. Follow our upgrade guide and
        <a href="width-detector/example/on-resize-width-observer"> examples </a>
        to migrate to WidthObserver.
      </p>
    </SectionMessage>
  )}

  ## Documentation

  Migration guide can be found in the **sidebar nav links**  👈
  - [Migration guide](/packages/helpers/width-detector/docs/migration-guide)

  ## Usage

  ${code`import WidthDetector from '@atlaskit/width-detector';`}

  ${(
    <Example
      packageName="@atlaskit/width-detector"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      heading="WidthDetector Props"
      props={require('!!extract-react-types-loader!../src/WidthDetector')}
    />
  )}
`;
