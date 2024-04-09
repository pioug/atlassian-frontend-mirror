import React from 'react';

import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

const Disclaimer = () => {
  return (
    <SectionMessage title="Deprecation warning" appearance="warning">
      <p>
        This package is deprecated. The current version (12) is the last major
        version before the package as whole will be archived.
      </p>{' '}
      <p>
        We recommend migrating to the{' '}
        <a href="https://atlassian.design/components/tokens/all-tokens">
          @atlaskit/tokens
        </a>{' '}
        package which provides a more flexible and modern theming solution.
        Refer to the{' '}
        <a href="https://atlassian.design/tokens/migrate-to-tokens">
          migration guide
        </a>{' '}
        for information on how to adopt this package.
      </p>
    </SectionMessage>
  );
};

export default md`
  ${(<Disclaimer />)}


  ### Quick links

  - [Colors](/packages/design-system/theme/docs/colors)
  - [Mixins](/packages/design-system/theme/docs/mixins)
  - [Constants](/packages/design-system/theme/docs/constants)
  - [Deprecations](/packages/design-system/theme/docs/deprecations)
`;
