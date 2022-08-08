import React from 'react';
import { md, Props } from '@atlaskit/docs';
import IconExplorer from '../examples/icon-explorer';

export default md`
  ## Icon explorer

  ${(
    <p>
      <IconExplorer />
    </p>
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../../../design-system/icon/src/extract-react-types/glyph-no-color-size')}
    />
  )}
`;
