/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import AtlaskitLozenge from '@atlaskit/lozenge';
import { LozengeProps } from './types';

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
  appearance = 'default',
  name,
  overrideCss,
  text,
  testId = 'smart-element-lozenge',
}) => {
  if (!text) {
    return null;
  }

  return (
    <span
      css={[styles, overrideCss]}
      data-fit-to-content
      data-smart-element={name}
      data-smart-element-lozenge
      data-testid={testId}
    >
      <AtlaskitLozenge appearance={appearance} testId={`${testId}-lozenge`}>
        {text}
      </AtlaskitLozenge>
    </span>
  );
};

export default Lozenge;
