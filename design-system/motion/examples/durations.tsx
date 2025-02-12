import React from 'react';

import { code, md } from '@atlaskit/docs';

import { durations, easeOut } from '../src';

import { MovesRightBlock } from './utils/blocks';

export default () => md`
  ${code`
import { small } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock appearance="small" curve={easeOut} duration={durations.small} />)}

  ${code`
import { medium } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock curve={easeOut} duration={durations.medium} />)}

  ${code`
import { large } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock appearance="large" curve={easeOut} duration={durations.large} />)}
`;
