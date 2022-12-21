import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import noop from '@atlaskit/ds-lib/noop';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

export default () => (
  <>
    <Text>Flag with long content that should scroll</Text>
    <FlagGroup>
      <Flag
        icon={
          <SuccessIcon
            label="Success"
            primaryColor={token('color.icon.success', G300)}
          />
        }
        id="success"
        key="success"
        title="Connected"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. this_really_long_filename_that_spans_longer_than_the_container.png Vestibulum leo elit, commodo non metus at, consequat tempor odio. Morbi in libero venenatis purus efficitur congue non at eros. In hac habitasse platea dictumst. Nulla facilisi. Suspendisse iaculis ligula at erat porttitor, vel vestibulum augue luctus. Pellentesque aliquam turpis non bibendum faucibus. Donec blandit consectetur faucibus."
        actions={[{ content: 'Alrighty then', onClick: noop }]}
      />
    </FlagGroup>
  </>
);
