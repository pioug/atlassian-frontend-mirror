import React, { memo } from 'react';

import Button from '@atlaskit/button/standard-button';

import type { SectionMessageActionProps } from './types';

/**
 * __Section message action__
 *
 * A section message action is designed to work with the `action` prop from
 * `SectionMessage`. It renders either a button or a link depending on whether
 * an `onClick` or `href` prop is supplied, with a dot separator in between actions.
 *
 * - [Examples](https://atlassian.design/components/section-message/examples#actions)
 */
const SectionMessageAction = memo(function SectionMessageAction({
  children,
  onClick,
  href,
  testId,
  linkComponent,
}: SectionMessageActionProps) {
  // FIXME: This path doesn't make sense
  // If the intent of the design for this component is to use an action, not providing `href` or `onClick`
  // makes the use case invalid. This should be addressed.
  return onClick || href ? (
    <Button
      testId={testId}
      appearance="link"
      spacing="none"
      onClick={onClick}
      href={href}
      component={href ? linkComponent : undefined}
    >
      {children}
    </Button>
  ) : (
    <>{children}</>
  );
});

SectionMessageAction.displayName = 'SectionMessageAction';

export default SectionMessageAction;
