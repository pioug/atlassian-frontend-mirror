import React from 'react';

import Text from '@atlaskit/primitives/text';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
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
            <a href="https://ecosystem.atlassian.net/browse/AK-90210">
              AK-90210
            </a>
          </Text>
        }
        icon={
          <SuccessIcon
            primaryColor={token('color.icon.success')}
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
