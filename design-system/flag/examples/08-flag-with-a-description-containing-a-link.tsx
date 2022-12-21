import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

export default () => (
  <>
    <Text>This is a flag with a description containing a link.</Text>
    <FlagGroup>
      <Flag
        description={
          <Text>
            My favourite issue is{' '}
            {/* eslint-disable-next-line @repo/internal/react/use-primitives */}
            <a href="https://ecosystem.atlassian.net/browse/AK-90210">
              AK-90210
            </a>
          </Text>
        }
        icon={
          <SuccessIcon
            primaryColor={token('color.icon.success', G300)}
            label="Success"
          />
        }
        id="1"
        key="1"
        title="I am a Flag"
      />
    </FlagGroup>
  </>
);
