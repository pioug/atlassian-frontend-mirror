import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  Width Detector is a utility component that informs the child function of the available width.

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
