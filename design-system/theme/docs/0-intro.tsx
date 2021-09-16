import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

const Disclaimer = () => {
  return (
    <SectionMessage title="Deprecation warning" appearance="warning">
      This package is considered deprecated. The current version (12), will be
      the last major version of this package before the package as whole is
      either archived or re-purposed.
    </SectionMessage>
  );
};

export default md`
  ${(<Disclaimer />)}


  ### Quick links

  - [Theming](/packages/design-system/theme/docs/theming)
  - [Colors](/packages/design-system/theme/docs/colors)
  - [Mixins](/packages/design-system/theme/docs/mixins)
  - [Constants](/packages/design-system/theme/docs/constants)
  - [Deprecations](/packages/design-system/theme/docs/deprecations)
`;
