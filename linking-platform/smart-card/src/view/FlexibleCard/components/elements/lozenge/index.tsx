/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import AtlaskitLozenge from '@atlaskit/lozenge';
import LozengeAction from './lozenge-action';
import type { LozengeProps } from './types';
import { useFlexibleUiOptionContext } from '../../../../../state/flexible-ui-context';

const styles = css`
  display: inline-flex;
  line-height: inherit;
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
  overrideCss,
  text,
  testId = 'smart-element-lozenge',
}) => {
  const ui = useFlexibleUiOptionContext();

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
    <AtlaskitLozenge appearance={appearance} testId={`${testId}-lozenge`}>
      {text}
    </AtlaskitLozenge>
  );

  return (
    <span
      css={[styles, overrideCss]}
      data-fit-to-content
      data-smart-element={name}
      data-smart-element-lozenge
      data-testid={testId}
    >
      {lozenge}
    </span>
  );
};

export default Lozenge;
