import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  A container around a [Tag](/components/tag) component that applies consistent
  styling to the collection of ties.

  ## Usage

  ${code`import TagGroup from '@atlaskit/tag-group';`}

  ${(
    <Example
      packageName="@atlaskit/tag-group"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      heading="TagGroup Props"
      props={require('!!extract-react-types-loader!../src/TagGroup')}
    />
  )}
`;
