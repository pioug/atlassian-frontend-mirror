import React, { ReactNode } from 'react';

import NodeResolver from 'react-node-resolver';

import { TargetConsumer } from './spotlight-manager';

interface SpotlightTargetProps {
  /**
   * A single child
   */
  children: ReactNode;
  /**
   * The name to reference from Spotlight
   */
  name: string;
}

/**
 * __Spotlight target__
 *
 * Wraps an element, allowing it to be targeted by a spotlight.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/onboarding)
 */
const SpotlightTarget: React.FC<SpotlightTargetProps> = ({
  children,
  name,
}) => (
  <TargetConsumer>
    {(targetRef) =>
      targetRef ? (
        <NodeResolver innerRef={targetRef(name)}>{children}</NodeResolver>
      ) : (
        children
      )
    }
  </TargetConsumer>
);

export default SpotlightTarget;
