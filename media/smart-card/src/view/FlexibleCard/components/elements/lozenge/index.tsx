/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import AtlaskitLozenge from '@atlaskit/lozenge';
import { LozengeProps } from './types';

const styles = css`
  line-height: inherit;
`;

const Lozenge: React.FC<LozengeProps> = ({
  appearance = 'default',
  text,
  testId = 'smart-element-lozenge',
}) => {
  if (!text) {
    return null;
  }

  return (
    <span css={styles} data-fit-to-content data-smart-element-lozenge>
      <AtlaskitLozenge appearance={appearance} testId={testId}>
        {text}
      </AtlaskitLozenge>
    </span>
  );
};

export default Lozenge;
