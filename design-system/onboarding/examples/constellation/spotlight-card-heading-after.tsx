import React from 'react';

import Button from '@atlaskit/button';
import __noop from '@atlaskit/ds-lib/noop';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N0 } from '@atlaskit/theme/colors';

import { SpotlightCard } from '../../src';

const SpotlightCardHeadingAfterExample = () => {
  return (
    <SpotlightCard
      headingAfterElement={
        <Button
          iconBefore={<CrossIcon label="Close" primaryColor={N0} />}
          appearance="subtle"
        />
      }
      heading="Switch it up"
      actions={[{ text: 'Next', onClick: __noop }]}
    >
      Quickly switch between your most recent projects by selecting the project
      name and icon.
    </SpotlightCard>
  );
};

export default SpotlightCardHeadingAfterExample;
