import React from 'react';

import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

export default () => (
  <>
    <div> Flag with long title text that is wrapped</div>
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
        title="This is a flag with a very long title. It spans multiple lines. Therefore, the text should wrap. The banner should grow in height. It should not truncate."
        description="All wires now hooked up."
        actions={[{ content: 'Alrighty then', onClick: () => {} }]}
      />
    </FlagGroup>
  </>
);
