import React from 'react';

import { code, md } from '@atlaskit/docs';

import { MovesRightBlock } from '../examples-utils/blocks';
import { easeIn, easeInOut, easeOut } from '../src';

export default () => md`
  ${code`
import { easeIn } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock curve={easeIn} duration={1000} />)}

  ${code`
import { easeInOut } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock curve={easeInOut} duration={1000} />)}

  ${code`
import { easeOut } from '@atlaskit/motion';
  `}

  ${(<MovesRightBlock curve={easeOut} duration={1000} />)}
`;
