import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

export default md`
  ${(
    <PropsTable
      heading="Props"
      props={require('!!extract-react-types-loader!../../../../design-system/icon/src/extract-react-types/glyph-no-color-size')}
    />
  )}
`;
