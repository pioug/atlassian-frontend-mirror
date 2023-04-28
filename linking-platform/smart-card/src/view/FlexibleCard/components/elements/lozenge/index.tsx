/** @jsx jsx */
import React, { useCallback, useState } from 'react';
import { css, jsx } from '@emotion/react';
import AtlaskitLozenge from '@atlaskit/lozenge';
import LozengeAction from '../../common/lozenge-action';
import type { LozengeProps } from './types';
import { useFlexibleUiOptionContext } from '../../../../../state/flexible-ui-context';

const styles = css`
  display: inline-flex;
  line-height: inherit;
`;

const actionStyles = css`
  overflow: visible;
`;

/**
 * A base element that displays a Lozenge.
 * @internal
 * @param {LozengeProps} LozengeProps - The props necessary for the Lozenge element.
 * @see State
 */
const Lozenge: React.FC<LozengeProps> = ({
  action,
  appearance = 'default',
  name,
  onClick,
  overrideCss,
  text,
  testId = 'smart-element-lozenge',
}) => {
  const ui = useFlexibleUiOptionContext();

  const [isBold, setIsBold] = useState(false);
  const onHover = useCallback(
    (isHover: boolean) => {
      if (onClick) {
        setIsBold(isHover);
      }
    },
    [onClick],
  );
  const onMouseEnter = useCallback(() => onHover(true), [onHover]);
  const onMouseLeave = useCallback(() => onHover(false), [onHover]);

  if (!text) {
    return null;
  }

  const lozenge = action ? (
    <LozengeAction
      action={action}
      appearance={appearance}
      testId={testId}
      text={text}
      zIndex={ui?.zIndex}
    />
  ) : (
    <AtlaskitLozenge
      appearance={appearance}
      isBold={isBold}
      testId={`${testId}-lozenge`}
    >
      {text}
    </AtlaskitLozenge>
  );

  return (
    <span
      css={[styles, onClick ? actionStyles : undefined, overrideCss]}
      data-fit-to-content
      data-smart-element={name}
      data-smart-element-lozenge
      data-testid={testId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={onClick ? 0 : -1}
    >
      {lozenge}
    </span>
  );
};

export default Lozenge;
