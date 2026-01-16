import React from 'react';

import { code, md } from '@atlaskit/docs';
import { durations, easeOut } from '@atlaskit/motion';

import { MovesRightBlock } from './utils/blocks';

export default (): any => md`
  ${code`
<SlideIn duration="small">...</SlideIn>
  `}

  ${(<MovesRightBlock appearance="small" curve={easeOut} duration={durations.small} />)}

  ${code`
<SlideIn duration="medium">...</SlideIn>
  `}

  ${(<MovesRightBlock curve={easeOut} duration={durations.medium} />)}

  ${code`
<SlideIn duration="large">...</SlideIn>
  `}

  ${(<MovesRightBlock appearance="large" curve={easeOut} duration={durations.large} />)}
`;
