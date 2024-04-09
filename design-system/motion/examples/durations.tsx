import React from 'react';

import { code, md } from '@atlaskit/docs';

import {
  easeOut,
  largeDurationMs,
  mediumDurationMs,
  smallDurationMs,
} from '../src';

import { MovesRightBlock } from './utils/blocks';

export default () => md`
  ${code`
import { smallDurationMs } from '@atlaskit/motion';
  `}

  ${(
    <MovesRightBlock
      appearance="small"
      curve={easeOut}
      duration={smallDurationMs}
    />
  )}

  ${code`
import { mediumDurationMs } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock curve={easeOut} duration={mediumDurationMs} />)}

  ${code`
import { largeDurationMs } from '@atlaskit/motion';
  `}

  ${(
    <MovesRightBlock
      appearance="large"
      curve={easeOut}
      duration={largeDurationMs}
    />
  )}
`;
