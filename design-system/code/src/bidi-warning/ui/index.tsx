import React, { Ref } from 'react';

import Tooltip from '@atlaskit/tooltip';

import { Decorator } from './styled';
import { CodeBidiWarningProps } from './types';

/**
 * __Bidi Warning__
 *
 * A component used to render a bidi character warning.
 * A bidi character can be used to perform a "bidi override attack".
 *
 * See https://hello.atlassian.net/wiki/spaces/PRODSEC/pages/1347434677/PSHELP-2943+Investigate+Trojan+Source+Attack+Vulnerability#1)-Providing-visual-cues-for-our-Customers-in-our-affected-products
 */
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
