/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useCallback, useState } from 'react';
import Lozenge from '@atlaskit/lozenge';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { triggerButtonStyles, triggerLozengeStyles } from '../styled';

import type { FC } from 'react';
import { LozengeActionTriggerProps } from './type';

const LozengeActionTrigger: FC<LozengeActionTriggerProps> = ({
  appearance,
  testId,
  text,
  triggerRef,
  ...props
}) => {
  const [isBold, setIsBold] = useState(false);
  const onMouseEnter = useCallback(() => setIsBold(true), []);
  const onMouseLeave = useCallback(() => setIsBold(false), []);

  return (
    <button
      type="button"
      {...props}
      css={triggerButtonStyles}
      data-testid={`${testId}--trigger`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={triggerRef}
    >
      <Lozenge appearance={appearance} isBold={isBold}>
        <span css={triggerLozengeStyles}>
          <span>{text}</span>
          <ChevronDownIcon label="options" size="medium" />
        </span>
      </Lozenge>
    </button>
  );
};

export default LozengeActionTrigger;
