import React from 'react';

import { RovoDevAgentLogoCS as NewComponent } from '../artifacts/logo-components/rovo-dev-agent/logo-cs';
import { tempSizeWrapper } from '../temp-size-wrapper';
import type { LogoProps } from '../types';

/**
 * __Rovo Dev Agent logo__
 *
 * The Rovo Dev Agent logo.
 *
 * - [Examples](https://atlassian.design/components/logo/examples)
 * - [Code](https://atlassian.design/components/logo/code)
 * - [Usage](https://atlassian.design/components/logo/usage)
 */
export const RovoDevAgentLogoCS: ({ size, ...props }: LogoProps) => React.JSX.Element =
	tempSizeWrapper(NewComponent);
