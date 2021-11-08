import React, { Ref } from 'react';

import Tooltip from '@atlaskit/tooltip';

import { Decorator } from './styled';
import { CodeBidiWarningProps } from './types';

export default function BidiWarning({
  testId,
  bidiCharacter,
  skipChildren,
  tooltipEnabled,
  label = 'Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.',
}: CodeBidiWarningProps) {
  if (tooltipEnabled) {
    return (
      // Following patches, this should be updated to use the render props signature which will provide aria attributes.
      // Note: this should be tested, as initial testing did not see attributes work with current tooltip implementation.
      <Tooltip content={label} tag={CustomizedTagWithRef}>
        <Decorator testId={testId} bidiCharacter={bidiCharacter}>
          {skipChildren ? null : bidiCharacter}
        </Decorator>
      </Tooltip>
    );
  }

  return (
    <Decorator testId={testId} bidiCharacter={bidiCharacter}>
      {skipChildren ? null : bidiCharacter}
    </Decorator>
  );
}

const CustomizedTagWithRef = React.forwardRef((props, ref: Ref<any>) => {
  const { children, ...rest } = props;
  return (
    <span {...rest} ref={ref}>
      {children}
    </span>
  );
});
